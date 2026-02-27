#include ./scene.wgsl

fn computeJacobian(splatviewpos: vec3f) -> mat3x2f {
    let x = splatviewpos.x;
    let y = splatviewpos.y;
    let z = min(-0.05, splatviewpos.z);
    let z2 = z * z;
    let height = scene.viewport.height;
    let width = scene.viewport.width;
    let fovy = scene.projection.fovy;
    let aspect = scene.projection.aspect;
    let fy = height / (2.0 * tan(fovy * 0.5));
    let fx = fy; // 使用统一焦距
    return mat3x2f(
        vec2f(fx / z, 0.0),            
        vec2f(0.0, fy / z),            
        vec2f(-fx * x / z2, -fy * y / z2)
    );
}

fn computeAABB(splatndspos: vec2f, m2d: mat2x2f) -> vec4f {
    let u = splatndspos.x;
    let v = splatndspos.y;
    let sxx = max(m2d[0][0], 0.3);
    let syy = max(m2d[1][1], 0.3);
    let sxy = m2d[0][1];
    let trace = sxx + syy;
    let det = max(sxx * syy - sxy * sxy, 1e-6);
    let lambda_max = 0.5 * (trace + sqrt(max(0.0, trace*trace - 4.0*det)));
    let r = clamp(3.0 * sqrt(lambda_max), 1.0, 1024.0);
    let xmin = u - r;
    let xmax = u + r;
    let ymin = v - r;
    let ymax = v + r;
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

override workGroupSizeX : u32 = 128u;

struct SplatUniform {
    modelmtx: mat4x4f
}

struct SplatInputData { 
    @align(16) center: vec4f,
    @align(16) opacity: vec4f, //f32 对齐至 vec4f
    @align(16) sigma3d: mat4x4f, // mat3x3f 对齐至 mat4x4f
    @align(16) shcolor: array<vec4f, 16>
}

struct SplatOutputData {
    @align(16) ndspos: vec4f,
    @align(16) sigma2d: mat2x2f,
    @align(16) color: vec4f,
    @align(16) vertndspos: array<vec4f, 6>,
    @align(16) vertndcpos: array<vec4f, 6>
}

@group(1) @binding(0) var<storage, read> splatInputData: array<SplatInputData>;
@group(1) @binding(1) var<storage, read_write> splatOutputData: array<SplatOutputData>;
@group(1) @binding(2) var<uniform> splatUniform: SplatUniform;

@compute 
@workgroup_size(workGroupSizeX)
fn splatCompute(
    @builtin(workgroup_id) wid : vec3<u32>,
    @builtin(global_invocation_id) gid : vec3<u32>,
    @builtin(local_invocation_id) lid : vec3<u32>
) {
    let splat = splatInputData[gid.x];

    let modelmtx4 = splatUniform.modelmtx;

    let modelmtx3 = mat3x3f(
        modelmtx4[0].xyz,
        modelmtx4[1].xyz,
        modelmtx4[2].xyz,
    );

    var splatworldpos = modelmtx4 * splat.center;
    let splatviewpos = scene.camera.viewmtx * splatworldpos;
    var splatndcpos = scene.projection.projmtx * splatviewpos;
    splatndcpos = splatndcpos / splatndcpos.w;
    var splatndspos = scene.viewport.viewportmtx * splatndcpos;
    splatndspos = splatndspos / splatndspos.w;

    let j = computeJacobian(splatviewpos.xyz);

    var sigma3d = mat3x3f(
        splat.sigma3d[0].xyz,
        splat.sigma3d[1].xyz,
        splat.sigma3d[2].xyz
    );

    sigma3d = modelmtx3 * sigma3d * transpose(modelmtx3);

    let viewmtx3 = mat3x3f(
        scene.camera.viewmtx[0].xyz,
        scene.camera.viewmtx[1].xyz,
        scene.camera.viewmtx[2].xyz
    ); 

    sigma3d = viewmtx3 * sigma3d * transpose(viewmtx3);

    var sigma2d: mat2x2f = j * (sigma3d * transpose(j));

    let b = 0.5 * (sigma2d[0][1] + sigma2d[1][0]);
    sigma2d[0][1] = b;
    sigma2d[1][0] = b;
    sigma2d[0][0] = max(0.3, sigma2d[0][0]);
    sigma2d[1][1] = max(0.3, sigma2d[1][1]);

    let aabb = computeAABB(splatndspos.xy, sigma2d);

    let vertndspos: array<vec4f, 6> = array(
        vec4f(aabb[0],aabb[1],splatndspos.z,1),
        vec4f(aabb[2],aabb[3],splatndspos.z,1),
        vec4f(aabb[0],aabb[3],splatndspos.z,1),
        vec4f(aabb[0],aabb[1],splatndspos.z,1),
        vec4f(aabb[2],aabb[1],splatndspos.z,1),
        vec4f(aabb[2],aabb[3],splatndspos.z,1)
    );

    // let vertndspos: array<vec4f, 6> = array(
    //     vec4f(0,0,splatndspos.z,1),
    //     vec4f(200,200,splatndspos.z,1),
    //     vec4f(0,200,splatndspos.z,1),
    //     vec4f(0,0,splatndspos.z,1),
    //     vec4f(200,0,splatndspos.z,1),
    //     vec4f(200,200,splatndspos.z,1)
    // );

    var vertndcpos: array<vec4f, 6>;
    vertndcpos[0] = scene.viewport.viewportmtxInv * vertndspos[0];
    vertndcpos[1] = scene.viewport.viewportmtxInv * vertndspos[1];
    vertndcpos[2] = scene.viewport.viewportmtxInv * vertndspos[2];
    vertndcpos[3] = scene.viewport.viewportmtxInv * vertndspos[3];
    vertndcpos[4] = scene.viewport.viewportmtxInv * vertndspos[4];
    vertndcpos[5] = scene.viewport.viewportmtxInv * vertndspos[5];

    let dview = normalize(scene.camera.eye - splatworldpos.xyz);
    let color = vec4f(sh_color(dview, splat.shcolor), splat.opacity.r);

    var output: SplatOutputData;

    output.ndspos = splatndspos;
    output.sigma2d = sigma2d;
    output.color = color;
    output.vertndspos = vertndspos;
    output.vertndcpos = vertndcpos;

    splatOutputData[gid.x] = output;

}