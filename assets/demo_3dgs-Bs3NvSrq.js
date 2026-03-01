import"./modulepreload-polyfill-B5Qt9EMX.js";import{c as y,f as E,t as P,a as R,r as X,C as $,b as H,P as F}from"./camera-DSiRDkIj.js";import{P as Y}from"./objects-BlX18zms.js";import{c as J,a as Q,b as q}from"./webgpuUtils-sdOmYmry.js";import{g as N}from"./cactus_splat3_30kSteps_142k_splats-B6q0-v_z.js";import{m as _,c as K,a as Z}from"./webgpu-utils.module--9rjYVl9.js";import{f as ee,a as te,n as ne,b as re,c as v,t as z,m as w,l as se,S as ie,A as oe}from"./axis-CFbiPSBX.js";import{P as ae}from"./plyformat-Be7AvOWO.js";import"./utils-DruZQoW3.js";import"./color-DsrcJaFb.js";var ue=`override workGroupSizeX : u32 = 128u;

@group(0) @binding(0) var<storage, read_write> splatIndex: array<u32>;

@compute\r
@workgroup_size(workGroupSizeX)\r
fn splatIndexInit(\r
    @builtin(global_invocation_id) gid : vec3<u32>\r
) {\r
    splatIndex[gid.x] = gid.x;\r
}`,C=`const INF:f32 = 1e30;

struct Stage {\r
    k: u32,\r
    j: u32,\r
    n: u32\r
}

struct SplatData {\r
    @align(16) ndspos: vec4f,\r
    @align(16) sigma2d: mat2x2f,\r
    @align(16) color: vec4f,\r
    @align(16) vertndspos: array<vec4f, 6>,\r
    @align(16) vertndcpos: array<vec4f, 6>\r
}

@group(0) @binding(0) var<uniform> stage: Stage;\r
@group(0) @binding(1) var<storage, read> splatData: array<SplatData>;\r
@group(0) @binding(2) var<storage, read_write> splatIndex: array<u32>;

override workGroupSizeX : u32 = 128u;

fn swapIndex(a:u32, b:u32) {\r
    let t = splatIndex[a];\r
    splatIndex[a] = splatIndex[b];\r
    splatIndex[b] = t;\r
}

@compute \r
@workgroup_size(workGroupSizeX)\r
fn splatBitonicSort(\r
    @builtin(global_invocation_id) gid : vec3<u32>\r
) {\r
    let k = stage.k;\r
    let j = stage.j;\r
    let a = gid.x;\r
    let b = a ^ j;\r
    if(a<b) {\r
        
        let za = select(-splatData[splatIndex[a]].ndspos.z, INF, a>=stage.n);\r
        let zb = select(-splatData[splatIndex[b]].ndspos.z, INF, b>=stage.n);\r
        let asc: bool = (a & k) == 0u;\r
        if(asc) {\r
            if(za > zb) {\r
                swapIndex(a,b);\r
            }\r
        } else {\r
            if(za < zb) {\r
                swapIndex(a,b);\r
            }\r
        }\r
    }\r
}`,pe=`override MAX_LIGHTS: u32 = 10u;

struct PointLight {\r
    position: vec3f,\r
    color: vec4f\r
};

struct BlinnPhong {\r
    ka: f32,\r
    kd: f32,\r
    ks: f32,\r
    phong: f32,\r
    ambient: vec4f,\r
    diffuse: vec4f,\r
    specular: vec4f\r
};

struct Camera {\r
    eye: vec3f,\r
    center: vec3f,\r
    up: vec3f,\r
    viewmtx: mat4x4f,\r
    viewmtxInv: mat4x4f\r
};

struct Projection {\r
    near: f32,\r
    far: f32,\r
    fovy: f32,\r
    aspect: f32,\r
    projmtx: mat4x4f,\r
    projmtxInv: mat4x4f\r
};

struct Viewport {\r
    width: f32,\r
    height: f32,\r
    viewportmtx: mat4x4f,\r
    viewportmtxInv: mat4x4f\r
};

struct IBLUniform {\r
    canIBL: u32,\r
    prefilterLevels: u32,\r
    prescaled: u32,\r
    sh: array<vec3f, 9u>\r
};

struct SceneUniform {\r
    worldmtx: mat4x4f,\r
    camera: Camera,\r
    projection: Projection,\r
    viewport: Viewport,\r
    ibl: IBLUniform,\r
    numLights: u32,\r
    lights: array<PointLight, 32u>\r
};

@group(0) @binding(0) var<uniform> scene : SceneUniform;\r
@group(0) @binding(1) var prefilterTexture: texture_cube<f32>;\r
@group(0) @binding(2) var prefilterSampler: sampler;\r
@group(0) @binding(3) var lutTexture: texture_2d<f32>;\r
@group(0) @binding(4) var lutSampler: sampler;

fn pv(p: vec4f) -> vec4f {\r
    var v = scene.projection.projmtx * scene.camera.viewmtx * p;\r
    v = v / v.w;\r
    return v;\r
}

fn spv(p: vec4f) -> vec4f {\r
    var v = scene.viewport.viewportmtx * scene.projection.projmtx * scene.camera.viewmtx * p;\r
    v = v / v.w;\r
    return v;\r
}

fn computeJacobian(splatviewpos: vec3f) -> mat3x2f {\r
    let x = splatviewpos.x;\r
    let y = splatviewpos.y;\r
    let z = min(-0.05, splatviewpos.z);\r
    let z2 = z * z;\r
    let height = scene.viewport.height;\r
    let width = scene.viewport.width;\r
    let fovy = scene.projection.fovy;\r
    let aspect = scene.projection.aspect;\r
    let fy = height / (2.0 * tan(fovy * 0.5));\r
    let fx = fy; 
    return mat3x2f(\r
        vec2f(fx / z, 0.0),            \r
        vec2f(0.0, fy / z),            \r
        vec2f(-fx * x / z2, -fy * y / z2)\r
    );\r
}

fn computeAABB(splatndspos: vec2f, m2d: mat2x2f) -> vec4f {\r
    let u = splatndspos.x;\r
    let v = splatndspos.y;\r
    let sxx = max(m2d[0][0], 0.3);\r
    let syy = max(m2d[1][1], 0.3);\r
    let sxy = m2d[0][1];\r
    let trace = sxx + syy;\r
    let det = max(sxx * syy - sxy * sxy, 1e-6);\r
    let lambda_max = 0.5 * (trace + sqrt(max(0.0, trace*trace - 4.0*det)));\r
    let r = clamp(3.0 * sqrt(lambda_max), 1.0, 1024.0);\r
    let xmin = u - r;\r
    let xmax = u + r;\r
    let ymin = v - r;\r
    let ymax = v + r;\r
    return vec4f(xmin,ymin,xmax,ymax);\r
}

fn sh_color(dview: vec3f, sh: array<vec4f,16>) -> vec3f {\r
    let x = dview.x;\r
    let y = dview.y;\r
    let z = dview.z;

    let x2 = x * x;\r
    let y2 = y * y;\r
    let z2 = z * z;\r
    let xy = x * y;\r
    let yz = y * z;\r
    let xz = x * z;

    
    const SH_C0: f32 = 0.28209479177387814;\r
    const SH_C1: f32 = 0.4886025119029199;\r
    const SH_C2: array<f32, 5> = array<f32, 5>(\r
        1.0925484305920792,\r
        -1.0925484305920792,\r
        0.31539156525252005,\r
        -1.0925484305920792,\r
        0.5462742152960396\r
    );\r
    const SH_C3: array<f32, 7> = array<f32, 7>(\r
        -0.5900435899266435,\r
        2.890611442640554,\r
        -0.4570457994644658,\r
        0.3731763325901154,\r
        -0.4570457994644658,\r
        1.445305721320277,\r
        -0.5900435899266435\r
    );

    
    var result = SH_C0 * sh[0].rgb;

    
    result += SH_C1 * (-y * sh[1].rgb + z * sh[2].rgb - x * sh[3].rgb);

    
    result += SH_C2[0] * xy * sh[4].rgb;\r
    result += SH_C2[1] * yz * sh[5].rgb;\r
    result += SH_C2[2] * (2.0 * z2 - x2 - y2) * sh[6].rgb;\r
    result += SH_C2[3] * xz * sh[7].rgb;\r
    result += SH_C2[4] * (x2 - y2) * sh[8].rgb;

    
    result += SH_C3[0] * y * (3.0 * x2 - y2) * sh[9].rgb;\r
    result += SH_C3[1] * xy * z * sh[10].rgb;\r
    result += SH_C3[2] * y * (4.0 * z2 - x2 - y2) * sh[11].rgb;\r
    result += SH_C3[3] * z * (2.0 * z2 - 3.0 * x2 - 3.0 * y2) * sh[12].rgb;\r
    result += SH_C3[4] * x * (4.0 * z2 - x2 - y2) * sh[13].rgb;\r
    result += SH_C3[5] * z * (x2 - y2) * sh[14].rgb;\r
    result += SH_C3[6] * x * (x2 - 3.0 * y2) * sh[15].rgb;

    return max(result + 0.5, vec3<f32>(0.0)); \r
}

override workGroupSizeX : u32 = 128u;

struct SplatUniform {\r
    modelmtx: mat4x4f\r
}

struct SplatInputData { \r
    @align(16) center: vec4f,\r
    @align(16) opacity: vec4f, 
    @align(16) sigma3d: mat4x4f, 
    @align(16) shcolor: array<vec4f, 16>\r
}

struct SplatOutputData {\r
    @align(16) ndspos: vec4f,\r
    @align(16) sigma2d: mat2x2f,\r
    @align(16) color: vec4f,\r
    @align(16) vertndspos: array<vec4f, 6>,\r
    @align(16) vertndcpos: array<vec4f, 6>\r
}

@group(1) @binding(0) var<storage, read> splatInputData: array<SplatInputData>;\r
@group(1) @binding(1) var<storage, read_write> splatOutputData: array<SplatOutputData>;\r
@group(1) @binding(2) var<uniform> splatUniform: SplatUniform;

@compute \r
@workgroup_size(workGroupSizeX)\r
fn splatCompute(\r
    @builtin(workgroup_id) wid : vec3<u32>,\r
    @builtin(global_invocation_id) gid : vec3<u32>,\r
    @builtin(local_invocation_id) lid : vec3<u32>\r
) {\r
    let splat = splatInputData[gid.x];

    let modelmtx4 = splatUniform.modelmtx;

    let modelmtx3 = mat3x3f(\r
        modelmtx4[0].xyz,\r
        modelmtx4[1].xyz,\r
        modelmtx4[2].xyz,\r
    );

    var splatworldpos = modelmtx4 * splat.center;\r
    let splatviewpos = scene.camera.viewmtx * splatworldpos;\r
    var splatndcpos = scene.projection.projmtx * splatviewpos;\r
    splatndcpos = splatndcpos / splatndcpos.w;\r
    var splatndspos = scene.viewport.viewportmtx * splatndcpos;\r
    splatndspos = splatndspos / splatndspos.w;

    let j = computeJacobian(splatviewpos.xyz);

    var sigma3d = mat3x3f(\r
        splat.sigma3d[0].xyz,\r
        splat.sigma3d[1].xyz,\r
        splat.sigma3d[2].xyz\r
    );

    sigma3d = modelmtx3 * sigma3d * transpose(modelmtx3);

    let viewmtx3 = mat3x3f(\r
        scene.camera.viewmtx[0].xyz,\r
        scene.camera.viewmtx[1].xyz,\r
        scene.camera.viewmtx[2].xyz\r
    ); 

    sigma3d = viewmtx3 * sigma3d * transpose(viewmtx3);

    var sigma2d: mat2x2f = j * (sigma3d * transpose(j));

    let b = 0.5 * (sigma2d[0][1] + sigma2d[1][0]);\r
    sigma2d[0][1] = b;\r
    sigma2d[1][0] = b;\r
    sigma2d[0][0] = max(0.3, sigma2d[0][0]);\r
    sigma2d[1][1] = max(0.3, sigma2d[1][1]);

    let aabb = computeAABB(splatndspos.xy, sigma2d);

    let vertndspos: array<vec4f, 6> = array(\r
        vec4f(aabb[0],aabb[1],splatndspos.z,1),\r
        vec4f(aabb[2],aabb[3],splatndspos.z,1),\r
        vec4f(aabb[0],aabb[3],splatndspos.z,1),\r
        vec4f(aabb[0],aabb[1],splatndspos.z,1),\r
        vec4f(aabb[2],aabb[1],splatndspos.z,1),\r
        vec4f(aabb[2],aabb[3],splatndspos.z,1)\r
    );

    var vertndcpos: array<vec4f, 6>;\r
    vertndcpos[0] = scene.viewport.viewportmtxInv * vertndspos[0];\r
    vertndcpos[1] = scene.viewport.viewportmtxInv * vertndspos[1];\r
    vertndcpos[2] = scene.viewport.viewportmtxInv * vertndspos[2];\r
    vertndcpos[3] = scene.viewport.viewportmtxInv * vertndspos[3];\r
    vertndcpos[4] = scene.viewport.viewportmtxInv * vertndspos[4];\r
    vertndcpos[5] = scene.viewport.viewportmtxInv * vertndspos[5];

    let dview = normalize(scene.camera.eye - splatworldpos.xyz);\r
    let color = vec4f(sh_color(dview, splat.shcolor), splat.opacity.r);

    var output: SplatOutputData;

    output.ndspos = splatndspos;\r
    output.sigma2d = sigma2d;\r
    output.color = color;\r
    output.vertndspos = vertndspos;\r
    output.vertndcpos = vertndcpos;

    splatOutputData[gid.x] = output;

}`,G=`override MAX_LIGHTS: u32 = 10u;

struct PointLight {\r
    position: vec3f,\r
    color: vec4f\r
};

struct BlinnPhong {\r
    ka: f32,\r
    kd: f32,\r
    ks: f32,\r
    phong: f32,\r
    ambient: vec4f,\r
    diffuse: vec4f,\r
    specular: vec4f\r
};

struct Camera {\r
    eye: vec3f,\r
    center: vec3f,\r
    up: vec3f,\r
    viewmtx: mat4x4f,\r
    viewmtxInv: mat4x4f\r
};

struct Projection {\r
    near: f32,\r
    far: f32,\r
    fovy: f32,\r
    aspect: f32,\r
    projmtx: mat4x4f,\r
    projmtxInv: mat4x4f\r
};

struct Viewport {\r
    width: f32,\r
    height: f32,\r
    viewportmtx: mat4x4f,\r
    viewportmtxInv: mat4x4f\r
};

struct IBLUniform {\r
    canIBL: u32,\r
    prefilterLevels: u32,\r
    prescaled: u32,\r
    sh: array<vec3f, 9u>\r
};

struct SceneUniform {\r
    worldmtx: mat4x4f,\r
    camera: Camera,\r
    projection: Projection,\r
    viewport: Viewport,\r
    ibl: IBLUniform,\r
    numLights: u32,\r
    lights: array<PointLight, 32u>\r
};

@group(0) @binding(0) var<uniform> scene : SceneUniform;\r
@group(0) @binding(1) var prefilterTexture: texture_cube<f32>;\r
@group(0) @binding(2) var prefilterSampler: sampler;\r
@group(0) @binding(3) var lutTexture: texture_2d<f32>;\r
@group(0) @binding(4) var lutSampler: sampler;

fn pv(p: vec4f) -> vec4f {\r
    var v = scene.projection.projmtx * scene.camera.viewmtx * p;\r
    v = v / v.w;\r
    return v;\r
}

fn spv(p: vec4f) -> vec4f {\r
    var v = scene.viewport.viewportmtx * scene.projection.projmtx * scene.camera.viewmtx * p;\r
    v = v / v.w;\r
    return v;\r
}

struct VSInput {\r
    @builtin(vertex_index) vertidx: u32,\r
    @builtin(instance_index) instidx: u32\r
}

struct VSOutput {\r
    @builtin(position) position : vec4f,\r
    @location(0) ndspos: vec4f,\r
    @location(1) centerndspos: vec4f,\r
    @location(2) m2dr0: vec2f,\r
    @location(3) m2dr1: vec2f,\r
    @location(4) color: vec4f\r
}

struct FSOutput {\r
    @location(0) color: vec4f\r
};

struct SplatData {\r
    @align(16) ndspos: vec4f,\r
    @align(16) sigma2d: mat2x2f,\r
    @align(16) color: vec4f,\r
    @align(16) vertndspos: array<vec4f, 6>,\r
    @align(16) vertndcpos: array<vec4f, 6>\r
}

struct SplatUniform {\r
    modelmtx: mat4x4f\r
}

@group(1) @binding(0) var<storage, read> splatData: array<SplatData>;\r
@group(1) @binding(1) var<storage, read> splatIndex: array<u32>;\r
@group(1) @binding(2) var<uniform> splatUniform: SplatUniform;

@vertex fn vs(input: VSInput) -> VSOutput {

    let index = splatIndex[input.instidx];\r
    let splat = splatData[index];\r
    let splatndspos = splat.ndspos;\r
    let sigma2d = splat.sigma2d;\r
    let cornernds = splat.vertndspos[input.vertidx];\r
    let cornerndc = splat.vertndcpos[input.vertidx];\r
    let color = splat.color;

    var output: VSOutput;\r
    output.position = cornerndc;\r
    output.ndspos = cornernds;\r
    output.centerndspos = splatndspos;\r
    output.m2dr0 = sigma2d[0];\r
    output.m2dr1 = sigma2d[1];\r
    output.color = color;

    return output;\r
}

fn computeWeight(d: vec2f, m2d: mat2x2f) -> f32 {\r
    let a = m2d[0][0];\r
    let b = m2d[1][0];\r
    let c = m2d[1][1];\r
    let denom = max(a*c - b*b, 1e-6);\r
    let r2 = (c*d.x*d.x - 2.0*b*d.x*d.y + a*d.y*d.y) / denom;\r
    let weight = exp(-0.5 * r2);\r
    return weight;\r
}

@fragment fn fs(input: VSOutput) -> FSOutput {  

    let p = input.ndspos.xy;\r
    let u = input.centerndspos.xy;\r
    let m2d = mat2x2f(input.m2dr0, input.m2dr1);\r
    let d = p - u;\r
    let w = computeWeight(d, m2d);\r
    if(w <0.001f) {\r
        discard;\r
    }\r
    var color = input.color;\r
    color.a = color.a * w;\r
    color.r = color.r * color.a;\r
    color.g = color.g * color.a;\r
    color.b = color.b * color.a;\r
    \r
    var output: FSOutput;\r
    output.color = color;\r
    return output;\r
}`;class a{name="GaussianSplat";splatCount=0;vertpos;splatpos;splatbuffer;bufferLength=0;index;needCompute=!0;needSort=!0;indexInited=!1;modelmtx=y();computeInfo;sortInfo;static bufferInfo={computeInput:{stride:352,offset:{center:0,opacity:16,sigma3d:32,shcolor:96},length:{center:4,opacity:4,sigma3d:16,shcolor:64}},computeOutput:{stride:240,offset:{ndspos:0,sigma2d:16,color:32,vertndspos:48,vertndcpos:144},length:{ndspos:4,sigma2d:4,color:4,vertndspos:24,vertndcpos:24}}};webgpu={definitions:{},vertexBuffers:{},uniformBuffers:{},storageBuffers:{},modules:{},pipelines:{},bindGroupLayouts:{},bindGroups:{}};constructor(){this.vertpos=new Float32Array([0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1])}static makeSplatStructuredView(e,t){const n=new Float32Array(e,t*a.bufferInfo.computeInput.stride+a.bufferInfo.computeInput.offset.center,a.bufferInfo.computeInput.length.center),r=new Float32Array(e,t*a.bufferInfo.computeInput.stride+a.bufferInfo.computeInput.offset.opacity,a.bufferInfo.computeInput.length.opacity),s=new Float32Array(e,t*a.bufferInfo.computeInput.stride+a.bufferInfo.computeInput.offset.sigma3d,a.bufferInfo.computeInput.length.sigma3d),o=new Float32Array(e,t*a.bufferInfo.computeInput.stride+a.bufferInfo.computeInput.offset.shcolor,a.bufferInfo.computeInput.length.shcolor);return{center:n,opacity:r,sigma3d:s,shcolor:o}}static fromPLY(e,t=y()){const n=e.elements.vertex.count,r=a.bufferInfo.computeInput.stride*n,s=new ArrayBuffer(r),o=e.elements.vertex.properties.x.data,p=e.elements.vertex.properties.y.data,l=e.elements.vertex.properties.z.data,c=e.elements.vertex.properties.opacity.data,h=e.elements.vertex.properties.scale_0.data,L=e.elements.vertex.properties.scale_1.data,D=e.elements.vertex.properties.scale_2.data,k=e.elements.vertex.properties.rot_0.data,T=e.elements.vertex.properties.rot_1.data,O=e.elements.vertex.properties.rot_2.data,j=e.elements.vertex.properties.rot_3.data,x=new Float32Array(n*4);for(let i=0;i<n;i++){const b=a.makeSplatStructuredView(s,i);x[i*4]=o[i],x[i*4+1]=p[i],x[i*4+2]=l[i],x[i*4+3]=1,b.center.set([o[i],p[i],l[i],1]);const M=1/(1+Math.exp(-c[i]));b.opacity.set([M]);const B=ee(Math.exp(h[i]),0,0,0,Math.exp(L[i]),0,0,0,Math.exp(D[i])),S=te(T[i],O[i],j[i],k[i]);ne(S,S);const I=re(v(),S),V=z(v(),B),W=z(v(),I),u=v();w(u,u,I),w(u,u,B),w(u,u,V),w(u,u,W);const A=[u[0],u[1],u[2],0,u[3],u[4],u[5],0,u[6],u[7],u[8],0,0,0,0,1];b.sigma3d.set(A);const g=b.shcolor;g[0]=e.elements.vertex.properties.f_dc_0.data[i],g[1]=e.elements.vertex.properties.f_dc_1.data[i],g[2]=e.elements.vertex.properties.f_dc_2.data[i];for(let d=0;d<15;d++)g[4+d*4]=e.elements.vertex.properties[`f_rest_${d}`].data[i],g[4+d*4+1]=e.elements.vertex.properties[`f_rest_${d+15}`].data[i],g[4+d*4+2]=e.elements.vertex.properties[`f_rest_${d+30}`].data[i]}const m=new a;return m.splatCount=n,m.splatpos=x,m.splatbuffer=s,m.bufferLength=r,m.modelmtx=t,m}initWebGPU(e,t){this.webgpu.context=e,this.webgpu.scene=t,this.webgpu.scene.on("change",()=>{this.needCompute=!0,this.needSort=!0})}getDefinition(){return this.webgpu.definitions.default==null&&(this.webgpu.definitions.default=_(G)),this.webgpu.definitions.sort==null&&(this.webgpu.definitions.sort=_(C)),this.webgpu.definitions}getVertexBuffers(){const e=this.webgpu.context.device;return e==null?null:(this.webgpu.vertexBuffers.vertex==null&&(this.webgpu.vertexBuffers.vertex=K(e,{vertpos:{data:this.vertpos,numComponents:4}},{stepMode:"vertex",shaderLocation:0})),this.webgpu.vertexBuffers)}getUniformBuffers(){const e=this.webgpu.context.device;if(e==null)return null;if(this.webgpu.uniformBuffers.default==null){const t=Z(this.getDefinition().default.uniforms.splatUniform);this.webgpu.uniformBuffers.default=e.createBuffer({label:`${this.name} uniform`,size:t.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),t.set({modelmtx:this.modelmtx}),e.queue.writeBuffer(this.webgpu.uniformBuffers.default,0,t.arrayBuffer)}if(this.webgpu.uniformBuffers.sort==null){const t=this.getSortComputeInfo();this.webgpu.uniformBuffers.sort=e.createBuffer({label:`${this.name} uniform`,size:t.stageBufferByteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),e.queue.writeBuffer(this.webgpu.uniformBuffers.sort,0,t.stageBuffer,0,t.stageBufferByteLength)}return this.webgpu.uniformBuffers}getStorageBuffers(){const e=this.webgpu.context.device;if(e==null)return null;this.webgpu.storageBuffers.computeInput==null&&(this.webgpu.storageBuffers.computeInput=e.createBuffer({label:`${this.name} splatcolor storage computeInput buffer`,size:this.bufferLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),e.queue.writeBuffer(this.webgpu.storageBuffers.computeInput,0,this.splatbuffer)),this.webgpu.storageBuffers.computeOutput==null&&(this.webgpu.storageBuffers.computeOutput=e.createBuffer({label:`${this.name} splatcolor storage computeOuttput buffer`,size:a.bufferInfo.computeOutput.stride*this.splatCount,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST})),this.webgpu.storageBuffers.default==null&&(this.webgpu.storageBuffers.default=e.createBuffer({label:`${this.name} splatcolor storage buffer`,size:this.bufferLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),e.queue.writeBuffer(this.webgpu.storageBuffers.default,0,this.splatbuffer));const t=this.getSortComputeInfo();return this.webgpu.storageBuffers.index==null&&(this.webgpu.storageBuffers.index=e.createBuffer({label:`${this.name} index storage buffer`,size:t.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST})),this.webgpu.storageBuffers}#e(e,t=128){const n=this.webgpu.context.adapter.limits.maxComputeWorkgroupsPerDimension,r=Math.min(t,this.webgpu.context.adapter.limits.maxComputeWorkgroupSizeX),s=Math.ceil(e/r);let o=1,p=0;return s<=n?(p=s,o=1):(p=s,o=Math.ceil(s/n)),{dispatchSizeX:p,workgroupSizeX:r,numBatches:o}}#t(){return this.computeInfo==null&&(this.computeInfo=this.#e(this.splatCount)),this.computeInfo}#n(){const e=this.webgpu.context.device;if(e==null)return null;this.webgpu.modules.indexInit==null&&(this.webgpu.modules.indexInit=e.createShaderModule({label:`${this.name} compute index init module`,code:ue}));const t=e.createPipelineLayout({bindGroupLayouts:[this.getBindGroupLayouts().indexInit]});if(this.webgpu.pipelines.indexInit==null){const n=this.getSortComputeInfo();this.webgpu.pipelines.indexInit=e.createComputePipeline({label:`${this.name} compute index init pipeline`,layout:t,compute:{module:this.webgpu.modules.indexInit,constants:{workGroupSizeX:n.workgroupSizeX}}})}}#r(){const e=this.webgpu.context.device;if(e==null)return null;this.webgpu.modules.sort==null&&(this.webgpu.modules.sort=e.createShaderModule({label:`${this.name} compute sort module`,code:C}));const t=e.createPipelineLayout({bindGroupLayouts:[this.getBindGroupLayouts().sort]});if(this.webgpu.pipelines.sort==null){const n=this.getSortComputeInfo();this.webgpu.pipelines.sort=e.createComputePipeline({label:`${this.name} compute sort pipeline`,layout:t,compute:{module:this.webgpu.modules.sort,constants:{workGroupSizeX:n.workgroupSizeX}}})}}#s(){const e=this.webgpu.context.device;if(e==null)return null;this.webgpu.modules.compute==null&&(this.webgpu.modules.compute=e.createShaderModule({label:`${this.name} compute module`,code:pe}));const t=e.createPipelineLayout({bindGroupLayouts:[this.webgpu.scene.bindGroupLayout,this.getBindGroupLayouts().compute]});if(this.webgpu.pipelines.compute==null){const n=this.#t();this.webgpu.pipelines.compute=e.createComputePipeline({label:`${this.name} compute pipeline`,layout:t,compute:{module:this.webgpu.modules.compute,constants:{workGroupSizeX:n.workgroupSizeX}}})}}#i(){const e=this.webgpu.context.device;if(e==null)return null;const t=this.getVertexBuffers();this.webgpu.modules.default==null&&(this.webgpu.modules.default=e.createShaderModule({label:`${this.name} render module`,code:G}));const n=e.createPipelineLayout({bindGroupLayouts:[this.webgpu.scene.bindGroupLayout,this.getBindGroupLayouts().default]});this.webgpu.pipelines.default==null&&(this.webgpu.pipelines.default=e.createRenderPipeline({label:`${this.name} pipeline`,layout:n,vertex:{module:this.webgpu.modules.default,buffers:[...t.vertex.bufferLayouts]},fragment:{module:this.webgpu.modules.default,targets:[{format:this.webgpu.context.canvas.context.getConfiguration().format,blend:{color:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}}}]},primitive:{topology:"triangle-list",cullMode:"none"},depthStencil:{depthWriteEnabled:!1,format:"depth32float",depthCompare:"less-equal"}}))}getPipelines(){return this.#n(),this.#s(),this.#r(),this.#i(),this.webgpu.pipelines}getBindGroupLayouts(){const e=this.webgpu.context.device;return e==null?null:(this.webgpu.bindGroupLayouts.indexInit==null&&(this.webgpu.bindGroupLayouts.indexInit=e.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]})),this.webgpu.bindGroupLayouts.sort==null&&(this.webgpu.bindGroupLayouts.sort=e.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform",hasDynamicOffset:!0}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]})),this.webgpu.bindGroupLayouts.compute==null&&(this.webgpu.bindGroupLayouts.compute=e.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}}]})),this.webgpu.bindGroupLayouts.default==null&&(this.webgpu.bindGroupLayouts.default=e.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.VERTEX,buffer:{type:"read-only-storage"}},{binding:2,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]})),this.webgpu.bindGroupLayouts)}getBindGroups(){const e=this.webgpu.context.device;if(e==null)return null;const t=this.getBindGroupLayouts(),n=this.getStorageBuffers(),r=this.getUniformBuffers();if(this.webgpu.bindGroups.indexInit==null&&(this.webgpu.bindGroups.indexInit=e.createBindGroup({label:`${this.name} compute indexInit bindgroup`,layout:t.indexInit,entries:[{binding:0,resource:{buffer:n.index}}]})),this.webgpu.bindGroups.sort==null){const s=this.getSortComputeInfo();this.webgpu.bindGroups.sort=e.createBindGroup({label:`${this.name} compute sort bindgroup`,layout:t.sort,entries:[{binding:0,resource:{buffer:r.sort,size:s.stageBufferByteStride}},{binding:1,resource:{buffer:n.computeOutput}},{binding:2,resource:{buffer:n.index}}]})}return this.webgpu.bindGroups.compute==null&&(this.webgpu.bindGroups.compute=e.createBindGroup({label:`${this.name} compute bindgroup`,layout:t.compute,entries:[{binding:0,resource:{buffer:n.computeInput}},{binding:1,resource:{buffer:n.computeOutput}},{binding:2,resource:{buffer:r.default}}]})),this.webgpu.bindGroups.default==null&&(this.webgpu.bindGroups.default=e.createBindGroup({label:`${this.name} bindgroup`,layout:t.default,entries:[{binding:0,resource:{buffer:n.computeOutput}},{binding:1,resource:{buffer:n.index}},{binding:2,resource:{buffer:r.default}}]})),this.webgpu.bindGroups}initIndexGPU(e){if(!this.indexInited){if(this.webgpu.context.device==null)return null;const n=this.getPipelines().indexInit,r=this.getBindGroups().indexInit,s=this.getSortComputeInfo();e.setPipeline(n),e.setBindGroup(0,r),e.dispatchWorkgroups(s.dispatchSizeX),this.indexInited=!0}}sortSplatCPU(){const e=[];for(let r=0;r<this.splatCount;++r)e.push(E(this.splatpos[r*4],this.splatpos[r*4+1],this.splatpos[r*4+2],1));const t=this.webgpu.scene.camera.matrices.viewMtx,n=e.map((r,s)=>{const o=P(R(),r,this.modelmtx);return P(o,o,t),[s,o[2]]});return new Uint32Array(n.sort((r,s)=>r[1]-s[1]).map(r=>r[0]))}getSortComputeInfo(){if(this.sortInfo==null){const e=Math.pow(2,Math.ceil(Math.log2(this.splatCount))),t=256,n=t*e,r=this.#e(e);let s=0,o=0;const p=new ArrayBuffer(n),l=new Uint32Array(p);for(let c=2;c<=e;c<<=1)for(let h=c>>1;h>0;h>>=1)l[o++]=c,l[o++]=h,l[o++]=e,o+=t/4-3,s++;this.sortInfo={...r,length:e,byteLength:4*e,statgeCount:s,stageBuffer:p,stageBufferByteStride:256,stageBufferByteLength:256*s}}return this.sortInfo}sortSplatGPU(e){if(this.webgpu.context.device==null)return null;if(this.needSort){const n=this.getPipelines().sort,r=this.getBindGroups().sort,s=this.getSortComputeInfo();e.setPipeline(n);for(let o=0;o<s.statgeCount;++o)e.setBindGroup(0,r,[o*s.stageBufferByteStride]),e.dispatchWorkgroups(s.dispatchSizeX);this.needSort=!1}}sortSplat(){const e=this.webgpu.context.device;if(e==null)return null;if(this.index==null||this.needSort){this.index=this.sortSplatCPU();const t=this.getStorageBuffers().index;e.queue.writeBuffer(t,0,this.index.buffer),this.needSort=!1}return this.index}compute(e){if(this.webgpu.context.device==null)return null;if(this.needCompute){const n=this.getPipelines().compute,r=this.getBindGroups().compute,s=this.#t();e.setPipeline(n),e.setBindGroup(0,this.webgpu.scene.bindGroup),e.setBindGroup(1,r),e.dispatchWorkgroups(s.dispatchSizeX),this.needCompute=!1}this.initIndexGPU(e),this.sortSplatGPU(e)}draw(e){if(this.webgpu.context.device==null)return null;const n=this.getVertexBuffers(),r=this.getPipelines(),s=this.getBindGroups().default;e.setPipeline(r.default),e.setBindGroup(0,this.webgpu.scene.bindGroup),e.setBindGroup(1,s),e.setVertexBuffer(0,n.vertex.buffers[0]),e.draw(6,this.splatCount)}destroy(){for(const e of Object.values(this.webgpu.vertexBuffers)){for(const t of e.buffers)t.destroy();e.indexBuffer&&e.indexBuffer.destroy()}this.webgpu.vertexBuffers={};for(const e of Object.values(this.webgpu.storageBuffers))e.destroy();this.webgpu.storageBuffers={};for(const e of Object.values(this.webgpu.uniformBuffers))e.destroy();this.webgpu.uniformBuffers={}}}class le{lastTime;fps=0;delta=1e3;frameCount=0;callbacks=[];constructor(){this.lastTime=performance.now()}addCallback(e){this.callbacks.push(e)}refresh(){this.frameCount++;const e=performance.now();if(e-this.lastTime>=this.delta){this.fps=this.frameCount,this.frameCount=0,this.lastTime=e;for(const t of this.callbacks)t(this.fps)}}}const ce='<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><style>.spinner_zWVm{animation:spinner_5QiW 1.2s linear infinite,spinner_PnZo 1.2s linear infinite}.spinner_gfyD{animation:spinner_5QiW 1.2s linear infinite,spinner_4j7o 1.2s linear infinite;animation-delay:.1s}.spinner_T5JJ{animation:spinner_5QiW 1.2s linear infinite,spinner_fLK4 1.2s linear infinite;animation-delay:.1s}.spinner_E3Wz{animation:spinner_5QiW 1.2s linear infinite,spinner_tDji 1.2s linear infinite;animation-delay:.2s}.spinner_g2vs{animation:spinner_5QiW 1.2s linear infinite,spinner_CMiT 1.2s linear infinite;animation-delay:.2s}.spinner_ctYB{animation:spinner_5QiW 1.2s linear infinite,spinner_cHKR 1.2s linear infinite;animation-delay:.2s}.spinner_BDNj{animation:spinner_5QiW 1.2s linear infinite,spinner_Re6e 1.2s linear infinite;animation-delay:.3s}.spinner_rCw3{animation:spinner_5QiW 1.2s linear infinite,spinner_EJmJ 1.2s linear infinite;animation-delay:.3s}.spinner_Rszm{animation:spinner_5QiW 1.2s linear infinite,spinner_YJOP 1.2s linear infinite;animation-delay:.4s}@keyframes spinner_5QiW{0%,50%{width:7.33px;height:7.33px}25%{width:1.33px;height:1.33px}}@keyframes spinner_PnZo{0%,50%{x:1px;y:1px}25%{x:4px;y:4px}}@keyframes spinner_4j7o{0%,50%{x:8.33px;y:1px}25%{x:11.33px;y:4px}}@keyframes spinner_fLK4{0%,50%{x:1px;y:8.33px}25%{x:4px;y:11.33px}}@keyframes spinner_tDji{0%,50%{x:15.66px;y:1px}25%{x:18.66px;y:4px}}@keyframes spinner_CMiT{0%,50%{x:8.33px;y:8.33px}25%{x:11.33px;y:11.33px}}@keyframes spinner_cHKR{0%,50%{x:1px;y:15.66px}25%{x:4px;y:18.66px}}@keyframes spinner_Re6e{0%,50%{x:15.66px;y:8.33px}25%{x:18.66px;y:11.33px}}@keyframes spinner_EJmJ{0%,50%{x:8.33px;y:15.66px}25%{x:11.33px;y:18.66px}}@keyframes spinner_YJOP{0%,50%{x:15.66px;y:15.66px}25%{x:18.66px;y:18.66px}}</style><rect class="spinner_zWVm" x="1" y="1" width="7.33" height="7.33"/><rect class="spinner_gfyD" x="8.33" y="1" width="7.33" height="7.33"/><rect class="spinner_T5JJ" x="1" y="8.33" width="7.33" height="7.33"/><rect class="spinner_E3Wz" x="15.66" y="1" width="7.33" height="7.33"/><rect class="spinner_g2vs" x="8.33" y="8.33" width="7.33" height="7.33"/><rect class="spinner_ctYB" x="1" y="15.66" width="7.33" height="7.33"/><rect class="spinner_BDNj" x="15.66" y="8.33" width="7.33" height="7.33"/><rect class="spinner_rCw3" x="8.33" y="15.66" width="7.33" height="7.33"/><rect class="spinner_Rszm" x="15.66" y="15.66" width="7.33" height="7.33"/></svg>';function U(f,e){const t=document.getElementById("progress-wrapper"),n=document.getElementById("progress-icon-div"),r=document.getElementById("progress-text-div");f===0&&(t.style.display="flex",n.innerHTML=ce),r.innerText=e,f===100&&(t.style.display="none")}class fe{context;colorTexture=null;depthTexture=null;camera=null;projection=null;scene=null;cameraMouseCtrl=null;gaussianSplat=null;axis=null;firstpass=!0;ready=!1;resizeObserver=null;readyCallbacks=[];pane;paneParams={fps:0};fps=new le;constructor(){const e=document.getElementById("webgpu-canvas");e!=null&&J(e).then(t=>{if(this.context=t,t==null)return null;const n=this.context.canvas.element.width,r=this.context.canvas.element.height;for(this.refreshDepthTexture(),this.camera=new $([-2,2,2,1],[0,0,0,1],[0,1,0,0]),this.projection=new Y(Math.PI/2,n/r,.1,1e3),this.scene=new ie(this.camera,this.projection),this.scene.initWebGPU(this.context),this.scene.refreshViewport(n,r),this.cameraMouseCtrl=new H(this.camera,this.context.canvas.element),this.cameraMouseCtrl.enable(),this.resizeObserver=new ResizeObserver(s=>{for(const o of s){const p=o.target,l=o.contentBoxSize[0].inlineSize,c=o.contentBoxSize[0].blockSize;p.width=Math.max(1,Math.min(l,this.context.device.limits.maxTextureDimension2D)),p.height=Math.max(1,Math.min(c,this.context.device.limits.maxTextureDimension2D)),this.projection.aspect=p.width/p.height,this.scene.refreshViewport(l,c),this.refreshDepthTexture()}}),this.resizeObserver.observe(this.context.canvas.element),this.axis=new oe({xlim:[0,50],ylim:[0,50],zlim:[0,50]}),this.axis.initWebGPU(this.context,this.scene),this.pane=new F({title:"参数控制",expanded:!0}),this.setPane(),this.ready=!0;this.readyCallbacks.length>0;)this.readyCallbacks.pop()(this)}).catch(t=>{this.ready=!1,console.error(t)})}onReady(e){this.ready?e(this):this.readyCallbacks.push(e)}setGaussianSplat(e){e.initWebGPU(this.context,this.scene),this.gaussianSplat=e}refreshDepthTexture(){const e=Q(this.context);return this.depthTexture&&this.depthTexture.destroy(),this.depthTexture=e,this.depthTexture}getRenderPassDescriptor(){let e=null;if(this.ready){if(!this.depthTexture)return null;e=q({label:"demo",first:this.firstpass,colorTexture:this.context.canvas.context.getCurrentTexture().createView(),depthTexture:this.depthTexture,clearColor:[0,0,0,1],clearDepth:1})}return e}render(){if(this.ready){const e=this.context.device.createCommandEncoder(),t=e.beginComputePass();this.gaussianSplat&&this.gaussianSplat.compute(t),t.end(),this.firstpass=!0;const n=e.beginRenderPass(this.getRenderPassDescriptor());this.firstpass=!1,this.axis&&this.axis.draw(n),this.gaussianSplat&&this.gaussianSplat.draw(n),n.end();const r=e.finish();this.context.device.queue.submit([r])}this.fps.refresh(),requestAnimationFrame(this.render.bind(this))}draw(){requestAnimationFrame(this.render.bind(this))}setPane(){this.fps.addCallback(e=>{this.paneParams.fps=e}),this.pane.addBinding(this.paneParams,"fps",{view:"graph",readonly:!0,min:0,max:120})}}function de(){const f=new fe;f.onReady(e=>{se.info("GaussianSplatDemo ready");const t=X(y(),y(),Math.PI);U(0,"loading 3dgs data..."),ae.loadByWorker(N,n=>{const r=a.fromPLY(n,t);f.setGaussianSplat(r),U(100,"3dgs data load finish")}),f.draw()})}de();
