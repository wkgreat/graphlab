import"./modulepreload-polyfill-B5Qt9EMX.js";import{c as w,m as V,a as A,b as H,f as R,t as P,d as F,r as $,C as E,e as X,P as W}from"./webgpu-utils.module-Cj-QWmJB.js";import{c as q,P as Y,a as J,b as Q}from"./objects-BMBEF8J0.js";import{g as N}from"./cactus_splat3_30kSteps_142k_splats-B6q0-v_z.js";import{f as K,a as Z,n as ee,b as te,c as x,t as z,m as b,l as re,S as ne,A as se}from"./axis-sWHJfhu1.js";import{P as oe}from"./plyformat-JtMasdzv.js";import"./color-DsrcJaFb.js";var ie=`override MAX_LIGHTS: u32 = 10u;

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

}`,I=`override MAX_LIGHTS: u32 = 10u;

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
}`;class i{name="GaussianSplat";splatCount=0;vertpos;splatpos;splatbuffer;bufferLength=0;index;needCompute=!0;needSort=!0;modelmtx=w();computeInfo=null;static bufferInfo={computeInput:{stride:352,offset:{center:0,opacity:16,sigma3d:32,shcolor:96},length:{center:4,opacity:4,sigma3d:16,shcolor:64}},computeOutput:{stride:240,offset:{ndspos:0,sigma2d:16,color:32,vertndspos:48,vertndcpos:144},length:{ndspos:4,sigma2d:4,color:4,vertndspos:24,vertndcpos:24}}};webgpu={definitions:{},vertexBuffers:{},uniformBuffers:{},storageBuffers:{},modules:{},pipelines:{},bindGroupLayouts:{},bindGroups:{}};constructor(){this.vertpos=new Float32Array([0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1])}static makeSplatStructuredView(e,t){const r=new Float32Array(e,t*i.bufferInfo.computeInput.stride+i.bufferInfo.computeInput.offset.center,i.bufferInfo.computeInput.length.center),o=new Float32Array(e,t*i.bufferInfo.computeInput.stride+i.bufferInfo.computeInput.offset.opacity,i.bufferInfo.computeInput.length.opacity),n=new Float32Array(e,t*i.bufferInfo.computeInput.stride+i.bufferInfo.computeInput.offset.sigma3d,i.bufferInfo.computeInput.length.sigma3d),u=new Float32Array(e,t*i.bufferInfo.computeInput.stride+i.bufferInfo.computeInput.offset.shcolor,i.bufferInfo.computeInput.length.shcolor);return{center:r,opacity:o,sigma3d:n,shcolor:u}}static fromPLY(e,t=w()){const r=e.elements.vertex.count,o=i.bufferInfo.computeInput.stride*r,n=new ArrayBuffer(o),u=e.elements.vertex.properties.x.data,p=e.elements.vertex.properties.y.data,m=e.elements.vertex.properties.z.data,g=e.elements.vertex.properties.opacity.data,C=e.elements.vertex.properties.scale_0.data,U=e.elements.vertex.properties.scale_1.data,G=e.elements.vertex.properties.scale_2.data,D=e.elements.vertex.properties.rot_0.data,L=e.elements.vertex.properties.rot_1.data,_=e.elements.vertex.properties.rot_2.data,T=e.elements.vertex.properties.rot_3.data,h=new Float32Array(r*4);for(let s=0;s<r;s++){const v=i.makeSplatStructuredView(n,s);h[s*4]=u[s],h[s*4+1]=p[s],h[s*4+2]=m[s],h[s*4+3]=1,v.center.set([u[s],p[s],m[s],1]);const O=1/(1+Math.exp(-g[s]));v.opacity.set([O]);const S=K(Math.exp(C[s]),0,0,0,Math.exp(U[s]),0,0,0,Math.exp(G[s])),y=Z(L[s],_[s],T[s],D[s]);ee(y,y);const B=te(x(),y),j=z(x(),S),k=z(x(),B),a=x();b(a,a,B),b(a,a,S),b(a,a,j),b(a,a,k);const M=[a[0],a[1],a[2],0,a[3],a[4],a[5],0,a[6],a[7],a[8],0,0,0,0,1];v.sigma3d.set(M);const f=v.shcolor;f[0]=e.elements.vertex.properties.f_dc_0.data[s],f[1]=e.elements.vertex.properties.f_dc_1.data[s],f[2]=e.elements.vertex.properties.f_dc_2.data[s];for(let c=0;c<15;c++)f[4+c*4]=e.elements.vertex.properties[`f_rest_${c}`].data[s],f[4+c*4+1]=e.elements.vertex.properties[`f_rest_${c+15}`].data[s],f[4+c*4+2]=e.elements.vertex.properties[`f_rest_${c+30}`].data[s]}const l=new i;return l.splatCount=r,l.splatpos=h,l.splatbuffer=n,l.bufferLength=o,l.modelmtx=t,l}initWebGPU(e,t){this.webgpu.context=e,this.webgpu.scene=t,this.webgpu.scene.on("change",()=>{this.needCompute=!0,this.needSort=!0})}getDefinition(){return this.webgpu.definitions.default==null&&(this.webgpu.definitions.default=V(I)),this.webgpu.definitions}getVertexBuffers(){const e=this.webgpu.context.device;return e==null?null:(this.webgpu.vertexBuffers.vertex==null&&(this.webgpu.vertexBuffers.vertex=A(e,{vertpos:{data:this.vertpos,numComponents:4}},{stepMode:"vertex",shaderLocation:0})),this.webgpu.vertexBuffers)}getUniformBuffers(){const e=this.webgpu.context.device;if(e==null)return null;const t=H(this.getDefinition().default.uniforms.splatUniform);return this.webgpu.uniformBuffers.default==null&&(this.webgpu.uniformBuffers.default=e.createBuffer({label:`${this.name} uniform`,size:t.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST})),t.set({modelmtx:this.modelmtx}),e.queue.writeBuffer(this.webgpu.uniformBuffers.default,0,t.arrayBuffer),this.webgpu.uniformBuffers}getStorageBuffers(){const e=this.webgpu.context.device;if(e==null)return null;this.webgpu.storageBuffers.computeInput==null&&(this.webgpu.storageBuffers.computeInput=e.createBuffer({label:`${this.name} splatcolor storage computeInput buffer`,size:this.bufferLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),e.queue.writeBuffer(this.webgpu.storageBuffers.computeInput,0,this.splatbuffer)),this.webgpu.storageBuffers.computeOutput==null&&(this.webgpu.storageBuffers.computeOutput=e.createBuffer({label:`${this.name} splatcolor storage computeOuttput buffer`,size:i.bufferInfo.computeOutput.stride*this.splatCount,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST})),this.webgpu.storageBuffers.default==null&&(this.webgpu.storageBuffers.default=e.createBuffer({label:`${this.name} splatcolor storage buffer`,size:this.bufferLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),e.queue.writeBuffer(this.webgpu.storageBuffers.default,0,this.splatbuffer));const t=this.sortSplat();return this.webgpu.storageBuffers.index==null&&(this.webgpu.storageBuffers.index=e.createBuffer({label:`${this.name} index storage buffer`,size:t.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST})),e.queue.writeBuffer(this.webgpu.storageBuffers.index,0,t.buffer),this.webgpu.storageBuffers}#e(){if(this.computeInfo==null){const e=this.webgpu.context.adapter.limits.maxComputeWorkgroupsPerDimension,t=this.webgpu.context.adapter.limits.maxComputeWorkgroupSizeX,r=Math.min(128,t),o=Math.ceil(this.splatCount/r);let n=1,u=0;o<=e?(u=o,n=1):(u=o,n=Math.ceil(o/e)),this.computeInfo={dispatchSizeX:u,workgroupSizeX:r,numBatches:n},console.log(this.computeInfo)}return this.computeInfo}#t(){const e=this.webgpu.context.device;if(e==null)return null;this.webgpu.modules.compute==null&&(this.webgpu.modules.compute=e.createShaderModule({label:`${this.name} compute module`,code:ie}));const t=e.createPipelineLayout({bindGroupLayouts:[this.webgpu.scene.bindGroupLayout,this.getBindGroupLayouts().compute]});if(this.webgpu.pipelines.compute==null){const r=this.#e();this.webgpu.pipelines.compute=e.createComputePipeline({label:`${this.name} compute pipeline`,layout:t,compute:{module:this.webgpu.modules.compute,constants:{workGroupSizeX:r.workgroupSizeX}}})}}#r(){const e=this.webgpu.context.device;if(e==null)return null;const t=this.getVertexBuffers();this.webgpu.modules.default==null&&(this.webgpu.modules.default=e.createShaderModule({label:`${this.name} render module`,code:I}));const r=e.createPipelineLayout({bindGroupLayouts:[this.webgpu.scene.bindGroupLayout,this.getBindGroupLayouts().default]});this.webgpu.pipelines.default==null&&(this.webgpu.pipelines.default=e.createRenderPipeline({label:`${this.name} pipeline`,layout:r,vertex:{module:this.webgpu.modules.default,buffers:[...t.vertex.bufferLayouts]},fragment:{module:this.webgpu.modules.default,targets:[{format:this.webgpu.context.canvas.context.getConfiguration().format,blend:{color:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}}}]},primitive:{topology:"triangle-list",cullMode:"none"},depthStencil:{depthWriteEnabled:!1,format:"depth32float",depthCompare:"less-equal"}}))}getPipelines(){return this.#t(),this.#r(),this.webgpu.pipelines}getBindGroupLayouts(){const e=this.webgpu.context.device;return e==null?null:(this.webgpu.bindGroupLayouts.compute==null&&(this.webgpu.bindGroupLayouts.compute=e.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}}]})),this.webgpu.bindGroupLayouts.default==null&&(this.webgpu.bindGroupLayouts.default=e.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.VERTEX,buffer:{type:"read-only-storage"}},{binding:2,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]})),this.webgpu.bindGroupLayouts)}getBindGroups(){const e=this.webgpu.context.device;if(e==null)return null;const t=this.getBindGroupLayouts(),r=this.getStorageBuffers(),o=this.getUniformBuffers();return this.webgpu.bindGroups.compute==null&&(this.webgpu.bindGroups.compute=e.createBindGroup({label:`${this.name} compute bindgroup`,layout:t.compute,entries:[{binding:0,resource:{buffer:r.computeInput}},{binding:1,resource:{buffer:r.computeOutput}},{binding:2,resource:{buffer:o.default}}]})),this.webgpu.bindGroups.default==null&&(this.webgpu.bindGroups.default=e.createBindGroup({label:`${this.name} bindgroup`,layout:t.default,entries:[{binding:0,resource:{buffer:r.computeOutput}},{binding:1,resource:{buffer:r.index}},{binding:2,resource:{buffer:o.default}}]})),this.webgpu.bindGroups}sortSplat(){if(this.index==null||this.needSort){const e=[];for(let n=0;n<this.splatCount;++n)e.push(R(this.splatpos[n*4],this.splatpos[n*4+1],this.splatpos[n*4+2],1));const t=this.webgpu.scene.camera.matrices.viewMtx,o=e.map((n,u)=>{const p=P(F(),n,this.modelmtx);return P(p,p,t),[u,p[2]]}).sort((n,u)=>n[1]-u[1]).map(n=>n[0]);this.index=new Uint32Array(o),this.needSort=!1}return this.index}compute(e){if(this.webgpu.context.device==null)return null;if(this.needCompute){const r=this.getPipelines().compute,o=this.getBindGroups().compute,n=this.#e();e.setPipeline(r),e.setBindGroup(0,this.webgpu.scene.bindGroup),e.setBindGroup(1,o),e.dispatchWorkgroups(n.dispatchSizeX),this.needCompute=!1}}draw(e){if(this.webgpu.context.device==null)return null;const r=this.getVertexBuffers(),o=this.getPipelines(),n=this.getBindGroups().default;e.setPipeline(o.default),e.setBindGroup(0,this.webgpu.scene.bindGroup),e.setBindGroup(1,n),e.setVertexBuffer(0,r.vertex.buffers[0]),e.draw(6,this.splatCount)}destroy(){for(const e of Object.values(this.webgpu.vertexBuffers)){for(const t of e.buffers)t.destroy();e.indexBuffer&&e.indexBuffer.destroy()}this.webgpu.vertexBuffers={};for(const e of Object.values(this.webgpu.storageBuffers))e.destroy();this.webgpu.storageBuffers={};for(const e of Object.values(this.webgpu.uniformBuffers))e.destroy()}}class ae{lastTime;fps=0;delta=1e3;frameCount=0;callbacks=[];constructor(){this.lastTime=performance.now()}addCallback(e){this.callbacks.push(e)}refresh(){this.frameCount++;const e=performance.now();if(e-this.lastTime>=this.delta){this.fps=this.frameCount,this.frameCount=0,this.lastTime=e;for(const t of this.callbacks)t(this.fps)}}}class ue{context;colorTexture=null;depthTexture=null;camera=null;projection=null;scene=null;cameraMouseCtrl=null;gaussianSplat=null;axis=null;firstpass=!0;ready=!1;resizeObserver=null;readyCallbacks=[];pane;paneParams={fps:0};fps=new ae;constructor(){const e=document.getElementById("webgpu-canvas");e!=null&&q(e).then(t=>{if(this.context=t,t==null)return null;const r=this.context.canvas.element.width,o=this.context.canvas.element.height;for(this.refreshDepthTexture(),this.camera=new E([-2,2,2,1],[0,0,0,1],[0,1,0,0]),this.projection=new Y(Math.PI/2,r/o,.1,1e3),this.scene=new ne(this.camera,this.projection),this.scene.initWebGPU(this.context),this.scene.refreshViewport(r,o),this.cameraMouseCtrl=new X(this.camera,this.context.canvas.element),this.cameraMouseCtrl.enable(),this.resizeObserver=new ResizeObserver(n=>{for(const u of n){const p=u.target,m=u.contentBoxSize[0].inlineSize,g=u.contentBoxSize[0].blockSize;p.width=Math.max(1,Math.min(m,this.context.device.limits.maxTextureDimension2D)),p.height=Math.max(1,Math.min(g,this.context.device.limits.maxTextureDimension2D)),this.projection.aspect=p.width/p.height,this.scene.refreshViewport(m,g),this.refreshDepthTexture()}}),this.resizeObserver.observe(this.context.canvas.element),this.axis=new se({xlim:[0,50],ylim:[0,50],zlim:[0,50]}),this.axis.initWebGPU(this.context,this.scene),this.pane=new W({title:"参数控制",expanded:!0}),this.setPane(),this.ready=!0;this.readyCallbacks.length>0;)this.readyCallbacks.pop()(this)}).catch(t=>{this.ready=!1,console.error(t)})}onReady(e){this.ready?e(this):this.readyCallbacks.push(e)}setGaussianSplat(e){e.initWebGPU(this.context,this.scene),this.gaussianSplat=e}refreshDepthTexture(){const e=J(this.context);return this.depthTexture&&this.depthTexture.destroy(),this.depthTexture=e,this.depthTexture}getRenderPassDescriptor(){let e=null;if(this.ready){if(!this.depthTexture)return null;e=Q({label:"demo",first:this.firstpass,colorTexture:this.context.canvas.context.getCurrentTexture().createView(),depthTexture:this.depthTexture,clearColor:[0,0,0,1],clearDepth:1})}return e}render(){if(this.ready){const e=this.context.device.createCommandEncoder(),t=e.beginComputePass();this.gaussianSplat&&this.gaussianSplat.compute(t),t.end(),this.firstpass=!0;const r=e.beginRenderPass(this.getRenderPassDescriptor());this.firstpass=!1,this.axis&&this.axis.draw(r),this.gaussianSplat&&this.gaussianSplat.draw(r),r.end();const o=e.finish();this.context.device.queue.submit([o])}this.fps.refresh(),requestAnimationFrame(this.render.bind(this))}draw(){requestAnimationFrame(this.render.bind(this))}setPane(){this.fps.addCallback(e=>{this.paneParams.fps=e}),this.pane.addBinding(this.paneParams,"fps",{view:"graph",readonly:!0,min:0,max:120})}}function pe(){const d=new ue;d.onReady(e=>{re.info("GaussianSplatDemo ready");const t=$(w(),w(),Math.PI);oe.loadByWorker(N,r=>{const o=i.fromPLY(r,t);d.setGaussianSplat(o)}),d.draw()})}pe();
