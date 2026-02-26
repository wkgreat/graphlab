#include ./scene.wgsl

fn computeJacobian(splatviewpos: vec3f) -> mat3x2f {
    let x = splatviewpos.x;
    let y = splatviewpos.y;
    let z = splatviewpos.z;
    let z2 = z * z;
    let height = scene.viewport.height;
    let width = scene.viewport.width;
    let fovy = scene.projection.fovy;
    let aspect = scene.projection.aspect;

    let fy = height / (2 * tan(fovy / 2));
    let fx = aspect * fy;
    return mat3x2f(
        vec2f(fx / z, 0.0),            
        vec2f(0.0, fy / z),            
        vec2f(-fx * x / z2, -fy * y / z2)
    );
}

fn computeAABB(splatndspos: vec2f, m2d: mat2x2f) -> vec4f {
    let u = splatndspos.x;
    let v = splatndspos.y;
    let sxx = m2d[0][0];
    let syy = m2d[1][1];
    let rx = 3 * sqrt(sxx);
    let ry = 3 * sqrt(syy);
    let xmin = u - rx;
    let xmax = u + rx;
    let ymin = v - ry;
    let ymax = v + ry;
    return vec4f(xmin,ymin,xmax,ymax);
}

// dview = cameraWorldPos - splatWorldPos
fn sh_color(dview: vec3f, sh: array<vec4f,16>) -> vec3f {
    let x = dview.x;
    let y = dview.y;
    let z = dview.z;

    let x2 = x * x;
    let y2 = y * y;
    let z2 = z * z;
    let xy = x * y;
    let yz = y * z;
    let xz = x * z;

    // SH 常数定义
    const SH_C0: f32 = 0.28209479177387814;
    const SH_C1: f32 = 0.4886025119029199;
    const SH_C2: array<f32, 5> = array<f32, 5>(
        1.0925484305920792,
        -1.0925484305920792,
        0.31539156525252005,
        -1.0925484305920792,
        0.5462742152960396
    );
    const SH_C3: array<f32, 7> = array<f32, 7>(
        -0.5900435899266435,
        2.890611442640554,
        -0.4570457994644658,
        0.3731763325901154,
        -0.4570457994644658,
        1.445305721320277,
        -0.5900435899266435
    );

    // Degree 0 (基础色)
    var result = SH_C0 * sh[0].rgb;

    // Degree 1
    result += SH_C1 * (-y * sh[1].rgb + z * sh[2].rgb - x * sh[3].rgb);

    // Degree 2
    result += SH_C2[0] * xy * sh[4].rgb;
    result += SH_C2[1] * yz * sh[5].rgb;
    result += SH_C2[2] * (2.0 * z2 - x2 - y2) * sh[6].rgb;
    result += SH_C2[3] * xz * sh[7].rgb;
    result += SH_C2[4] * (x2 - y2) * sh[8].rgb;

    // Degree 3
    result += SH_C3[0] * y * (3.0 * x2 - y2) * sh[9].rgb;
    result += SH_C3[1] * xy * z * sh[10].rgb;
    result += SH_C3[2] * y * (4.0 * z2 - x2 - y2) * sh[11].rgb;
    result += SH_C3[3] * z * (2.0 * z2 - 3.0 * x2 - 3.0 * y2) * sh[12].rgb;
    result += SH_C3[4] * x * (4.0 * z2 - x2 - y2) * sh[13].rgb;
    result += SH_C3[5] * z * (x2 - y2) * sh[14].rgb;
    result += SH_C3[6] * x * (x2 - 3.0 * y2) * sh[15].rgb;

    return max(result + 0.5, vec3<f32>(0.0)); 
}

struct VSInput {
    @builtin(vertex_index) vertidx: u32,
    @builtin(instance_index) instidx: u32
}

struct VSOutput {
    @builtin(position) position : vec4f,
    @location(0) ndspos: vec4f,
    @location(1) centerndspos: vec4f,
    @location(2) m2dr0: vec2f,
    @location(3) m2dr1: vec2f,
    @location(4) color: vec4f
}

struct FSOutput {
    @location(0) color: vec4f
};

struct SplatData {
    @align(16) center: vec4f,
    @align(16) opacity: vec4f, //f32 对齐至 vec4f
    @align(16) sigma3d: mat4x4f, // mat3x3f 对齐至 mat4x4f
    @align(16) shcolor: array<vec4f, 16>
}
@group(1) @binding(0) var<storage, read> splatData: array<SplatData>;

@group(1) @binding(1) var<storage, read> splatIndex: array<u32>;

//TODO 每个splat instance的数据只计算一次
@vertex fn vs(input: VSInput) -> VSOutput {

    let index = splatIndex[input.instidx];
    let splat = splatData[index];

    let splatworldpos = splat.center;
    let splatviewpos = scene.camera.viewmtx * splatworldpos;
    var splatndcpos = scene.projection.projmtx * splatviewpos;
    splatndcpos = splatndcpos / splatndcpos.w;
    var splatndspos = scene.viewport.viewportmtx * splatndcpos;
    splatndspos = splatndspos / splatndspos.w;
    
    let J = computeJacobian(splatviewpos.xyz);

    var M3D = mat3x3f(
        splat.sigma3d[0].xyz,
        splat.sigma3d[1].xyz,
        splat.sigma3d[2].xyz
    );

    let W = mat3x3f(
        scene.camera.viewmtx[0].xyz,
        scene.camera.viewmtx[1].xyz,
        scene.camera.viewmtx[2].xyz
    ); 

    M3D = W * M3D * transpose(W);

    var M2D: mat2x2f = J * (M3D * transpose(J));

    // 添加低通滤波 (通常做法) 这能确保 Splat 至少占据一个像素的大小
    M2D[0][0] += 0.3;
    M2D[1][1] += 0.3;

    let aabb = computeAABB(splatndspos.xy, M2D);

    let corners: array<vec4f, 6> = array(
        vec4f(aabb[0],aabb[1],splatndspos.z,1),
        vec4f(aabb[2],aabb[3],splatndspos.z,1),
        vec4f(aabb[0],aabb[3],splatndspos.z,1),
        vec4f(aabb[0],aabb[1],splatndspos.z,1),
        vec4f(aabb[2],aabb[1],splatndspos.z,1),
        vec4f(aabb[2],aabb[3],splatndspos.z,1)
    );

    let cornernds = corners[input.vertidx];
    var cornerndc = scene.viewport.viewportmtxInv * cornernds;
    cornerndc = cornerndc / cornerndc.w;

    let dview = normalize(scene.camera.eye - splatworldpos.xyz);
    let color = vec4f(sh_color(dview, splat.shcolor), splat.opacity.r);

    var output: VSOutput;
    output.position = cornerndc;
    output.ndspos = cornernds;
    output.centerndspos = splatndspos;
    output.m2dr0 = M2D[0];
    output.m2dr1 = M2D[1];
    output.color = color;

    return output;
}

fn computeWeight(d: vec2f, m2d: mat2x2f) -> f32 {
    let a = m2d[0][0];
    let b = m2d[1][0]; // column-major
    let c = m2d[1][1];

    let r2 = (c*d.x*d.x - 2.0*b*d.x*d.y + a*d.y*d.y) / (a*c - b*b);
    let weight = exp(-0.5 * r2);
    return weight;
}

@fragment fn fs(input: VSOutput) -> FSOutput {

    let p = input.ndspos.xy;
    let u = input.centerndspos.xy;
    let m2d = mat2x2f(input.m2dr0, input.m2dr1);
    let d = p - u;
    let w = computeWeight(d, m2d);
    if(w <0.011f) {
        discard;
    }
    var color = input.color;
    color.a = color.a * w;
    
    var output: FSOutput;
    output.color = color;
    return output;
}