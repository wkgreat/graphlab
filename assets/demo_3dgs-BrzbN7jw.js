import"./modulepreload-polyfill-B5Qt9EMX.js";import{c as w,m as j,a as F,b as R,f as I,t as z,d as k,r as $,C as W,e as E,P as q}from"./webgpu-utils.module-DYoVC6wh.js";import{c as Y,P as J,a as X,b as Q}from"./objects-DCNIAmTT.js";import{g as N}from"./cactus_splat3_30kSteps_142k_splats-B6q0-v_z.js";import{f as K,a as Z,n as ee,b as te,c as b,t as D,m as g,l as re,S as ne,A as se}from"./axis-DPoguJ6D.js";import{P as ae}from"./plyformat-B5bX0Ewg.js";import"./color-DsrcJaFb.js";var C=`override MAX_LIGHTS: u32 = 10u;

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
    @align(16) center: vec4f,\r
    @align(16) opacity: vec4f, 
    @align(16) sigma3d: mat4x4f, 
    @align(16) shcolor: array<vec4f, 16>\r
}

struct SplatUniform {\r
    modelmtx: mat4x4f\r
}

@group(1) @binding(0) var<storage, read> splatData: array<SplatData>;\r
@group(1) @binding(1) var<storage, read> splatIndex: array<u32>;\r
@group(1) @binding(2) var<uniform> splatUniform: SplatUniform;

@vertex fn vs(input: VSInput) -> VSOutput {

    let index = splatIndex[input.instidx];\r
    let splat = splatData[index];

    let modelmtx4 = splatUniform.modelmtx;\r
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

    let J = computeJacobian(splatviewpos.xyz);

    var M3D = mat3x3f(\r
        splat.sigma3d[0].xyz,\r
        splat.sigma3d[1].xyz,\r
        splat.sigma3d[2].xyz\r
    );

    M3D = modelmtx3 * M3D * transpose(modelmtx3);

    let W = mat3x3f(\r
        scene.camera.viewmtx[0].xyz,\r
        scene.camera.viewmtx[1].xyz,\r
        scene.camera.viewmtx[2].xyz\r
    ); 

    M3D = W * M3D * transpose(W);

    var M2D: mat2x2f = J * (M3D * transpose(J));

    let b = 0.5 * (M2D[0][1] + M2D[1][0]);\r
    M2D[0][1] = b;\r
    M2D[1][0] = b;\r
    M2D[0][0] = max(0.3, M2D[0][0]);\r
    M2D[1][1] = max(0.3, M2D[1][1]);

    let aabb = computeAABB(splatndspos.xy, M2D);

    let corners: array<vec4f, 6> = array(\r
        vec4f(aabb[0],aabb[1],splatndspos.z,1),\r
        vec4f(aabb[2],aabb[3],splatndspos.z,1),\r
        vec4f(aabb[0],aabb[3],splatndspos.z,1),\r
        vec4f(aabb[0],aabb[1],splatndspos.z,1),\r
        vec4f(aabb[2],aabb[1],splatndspos.z,1),\r
        vec4f(aabb[2],aabb[3],splatndspos.z,1)\r
    );

    let cornernds = corners[input.vertidx];\r
    var cornerndc = scene.viewport.viewportmtxInv * cornernds;\r
    cornerndc = cornerndc / cornerndc.w;

    let dview = normalize(scene.camera.eye - splatworldpos.xyz);\r
    let color = vec4f(sh_color(dview, splat.shcolor), splat.opacity.r);

    var output: VSOutput;\r
    output.position = cornerndc;\r
    output.ndspos = cornernds;\r
    output.centerndspos = splatndspos;\r
    output.m2dr0 = M2D[0];\r
    output.m2dr1 = M2D[1];\r
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
}`;class i{name="GaussianSplat";splatCount=0;vertpos;splatpos;splatbuffer;bufferLength=0;static bufferStride=352;static centerOffset=0;static opacityOffset=16;static sigma3dOffset=32;static shcolorOffset=96;modelmtx=w();webgpu={vertexBuffers:{},uniformBuffers:{},storageBuffers:{},bindGroupLayouts:{},bindGroups:{}};constructor(){this.vertpos=new Float32Array([0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1])}static makeSplatStructuredView(e,t){const n=new Float32Array(e,t*i.bufferStride+i.centerOffset,4),o=new Float32Array(e,t*i.bufferStride+i.opacityOffset,4),s=new Float32Array(e,t*i.bufferStride+i.sigma3dOffset,16),u=new Float32Array(e,t*i.bufferStride+i.shcolorOffset,64);return{center:n,opacity:o,sigma3d:s,shcolor:u}}static fromPLY(e,t=w()){const n=e.elements.vertex.count,o=i.bufferStride*n,s=new ArrayBuffer(o),u=e.elements.vertex.properties.x.data,l=e.elements.vertex.properties.y.data,d=e.elements.vertex.properties.z.data,x=e.elements.vertex.properties.opacity.data,P=e.elements.vertex.properties.scale_0.data,M=e.elements.vertex.properties.scale_1.data,_=e.elements.vertex.properties.scale_2.data,L=e.elements.vertex.properties.rot_0.data,U=e.elements.vertex.properties.rot_1.data,G=e.elements.vertex.properties.rot_2.data,T=e.elements.vertex.properties.rot_3.data,m=new Float32Array(n*4);for(let r=0;r<n;r++){const v=i.makeSplatStructuredView(s,r);m[r*4]=u[r],m[r*4+1]=l[r],m[r*4+2]=d[r],m[r*4+3]=1,v.center.set([u[r],l[r],d[r],1]);const O=1/(1+Math.exp(-x[r]));v.opacity.set([O]);const S=K(Math.exp(P[r]),0,0,0,Math.exp(M[r]),0,0,0,Math.exp(_[r])),y=Z(U[r],G[r],T[r],L[r]);ee(y,y);const B=te(b(),y),V=D(b(),S),A=D(b(),B),a=b();g(a,a,B),g(a,a,S),g(a,a,V),g(a,a,A);const H=[a[0],a[1],a[2],0,a[3],a[4],a[5],0,a[6],a[7],a[8],0,0,0,0,1];v.sigma3d.set(H);const f=v.shcolor;f[0]=e.elements.vertex.properties.f_dc_0.data[r],f[1]=e.elements.vertex.properties.f_dc_1.data[r],f[2]=e.elements.vertex.properties.f_dc_2.data[r];for(let c=0;c<15;c++)f[4+c*4]=e.elements.vertex.properties[`f_rest_${c}`].data[r],f[4+c*4+1]=e.elements.vertex.properties[`f_rest_${c+15}`].data[r],f[4+c*4+2]=e.elements.vertex.properties[`f_rest_${c+30}`].data[r]}const p=new i;return p.splatCount=n,p.splatpos=m,p.splatbuffer=s,p.bufferLength=o,p.modelmtx=t,p}initWebGPU(e,t){this.webgpu.context=e,this.webgpu.scene=t}getDefinition(){return this.webgpu.definition==null&&(this.webgpu.definition=j(C)),this.webgpu.definition}getVertexBuffers(){const e=this.webgpu.context.device;return e==null?null:(this.webgpu.vertexBuffers.vertex==null&&(this.webgpu.vertexBuffers.vertex=F(e,{vertpos:{data:this.vertpos,numComponents:4}},{stepMode:"vertex",shaderLocation:0})),this.webgpu.vertexBuffers)}getUniformBuffers(){const e=this.webgpu.context.device;if(e==null)return null;const t=R(this.getDefinition().uniforms.splatUniform);return this.webgpu.uniformBuffers.default==null&&(this.webgpu.uniformBuffers.default=e.createBuffer({label:`${this.name} uniform`,size:t.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST})),t.set({modelmtx:this.modelmtx}),e.queue.writeBuffer(this.webgpu.uniformBuffers.default,0,t.arrayBuffer),this.webgpu.uniformBuffers}getStorageBuffers(){const e=this.webgpu.context.device;if(e==null)return null;this.webgpu.storageBuffers.default==null&&(this.webgpu.storageBuffers.default=e.createBuffer({label:`${this.name} splatcolor storage buffer`,size:this.bufferLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),e.queue.writeBuffer(this.webgpu.storageBuffers.default,0,this.splatbuffer));const t=this.sortSplat();return this.webgpu.storageBuffers.index==null&&(this.webgpu.storageBuffers.index=e.createBuffer({label:`${this.name} index storage buffer`,size:t.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST})),e.queue.writeBuffer(this.webgpu.storageBuffers.index,0,t.buffer),this.webgpu.storageBuffers}getPipeline(){const e=this.webgpu.context.device;if(e==null)return null;const t=this.getVertexBuffers();this.webgpu.module==null&&(this.webgpu.module=e.createShaderModule({label:`${this.name} module`,code:C}));const n=e.createPipelineLayout({bindGroupLayouts:[this.webgpu.scene.bindGroupLayout,this.getBindGroupLayouts().default]});return this.webgpu.pipeline==null&&(this.webgpu.pipeline=e.createRenderPipeline({label:`${this.name} pipeline`,layout:n,vertex:{module:this.webgpu.module,buffers:[...t.vertex.bufferLayouts]},fragment:{module:this.webgpu.module,targets:[{format:this.webgpu.context.canvas.context.getConfiguration().format,blend:{color:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}}}]},primitive:{topology:"triangle-list",cullMode:"none"},depthStencil:{depthWriteEnabled:!1,format:"depth32float",depthCompare:"less-equal"}})),this.webgpu.pipeline}getBindGroupLayouts(){const e=this.webgpu.context.device;return e==null?null:(this.webgpu.bindGroupLayouts.default==null&&(this.webgpu.bindGroupLayouts.default=e.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.VERTEX,buffer:{type:"read-only-storage"}},{binding:2,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]})),this.webgpu.bindGroupLayouts)}getBindGroups(){const e=this.webgpu.context.device;if(e==null)return null;const t=this.getBindGroupLayouts(),n=this.getStorageBuffers(),o=this.getUniformBuffers();return this.webgpu.bindGroups.default==null&&(this.webgpu.bindGroups.default=e.createBindGroup({label:`${this.name} bindgroup`,layout:t.default,entries:[{binding:0,resource:{buffer:n.default}},{binding:1,resource:{buffer:n.index}},{binding:2,resource:{buffer:o.default}}]})),this.webgpu.bindGroups}sortSplat(){const e=[];for(let s=0;s<this.splatCount;++s)e.push(I(this.splatpos[s*4],this.splatpos[s*4+1],this.splatpos[s*4+2],1));const t=this.webgpu.scene.camera.matrices.viewMtx,o=e.map((s,u)=>{const l=z(k(),s,this.modelmtx);return z(l,l,t),[u,l[2]]}).sort((s,u)=>s[1]-u[1]).map(s=>s[0]);return new Uint32Array(o)}draw(e){if(this.webgpu.context.device==null)return null;const n=this.getVertexBuffers(),o=this.getPipeline(),s=this.getBindGroups().default;e.setPipeline(o),e.setBindGroup(0,this.webgpu.scene.bindGroup),e.setBindGroup(1,s),e.setVertexBuffer(0,n.vertex.buffers[0]),e.draw(6,this.splatCount)}destroy(){}}class oe{context;colorTexture=null;depthTexture=null;camera=null;projection=null;scene=null;cameraMouseCtrl=null;gaussianSplat=null;axis=null;firstpass=!0;ready=!1;resizeObserver=null;readyCallbacks=[];pane;paneParams={};constructor(){const e=document.getElementById("webgpu-canvas");e!=null&&Y(e).then(t=>{if(this.context=t,t==null)return null;const n=this.context.canvas.element.width,o=this.context.canvas.element.height;for(this.refreshDepthTexture(),this.camera=new W([-2,2,2,1],[0,0,0,1],[0,1,0,0]),this.projection=new J(Math.PI/2,n/o,.1,1e3),this.scene=new ne(this.camera,this.projection),this.scene.initWebGPU(this.context),this.scene.refreshViewport(n,o),this.cameraMouseCtrl=new E(this.camera,this.context.canvas.element),this.cameraMouseCtrl.enable(),this.resizeObserver=new ResizeObserver(s=>{for(const u of s){const l=u.target,d=u.contentBoxSize[0].inlineSize,x=u.contentBoxSize[0].blockSize;l.width=Math.max(1,Math.min(d,this.context.device.limits.maxTextureDimension2D)),l.height=Math.max(1,Math.min(x,this.context.device.limits.maxTextureDimension2D)),this.projection.aspect=l.width/l.height,this.scene.refreshViewport(d,x),this.refreshDepthTexture()}}),this.resizeObserver.observe(this.context.canvas.element),this.axis=new se({xlim:[0,50],ylim:[0,50],zlim:[0,50]}),this.axis.initWebGPU(this.context,this.scene),this.pane=new q({title:"参数控制",expanded:!0}),this.setPane(),this.ready=!0;this.readyCallbacks.length>0;)this.readyCallbacks.pop()(this)}).catch(t=>{this.ready=!1,console.error(t)})}onReady(e){this.ready?e(this):this.readyCallbacks.push(e)}setGaussianSplat(e){e.initWebGPU(this.context,this.scene),this.gaussianSplat=e}refreshDepthTexture(){const e=X(this.context);return this.depthTexture&&this.depthTexture.destroy(),this.depthTexture=e,this.depthTexture}getRenderPassDescriptor(){let e=null;if(this.ready){if(!this.depthTexture)return null;e=Q({label:"demo",first:this.firstpass,colorTexture:this.context.canvas.context.getCurrentTexture().createView(),depthTexture:this.depthTexture,clearColor:[0,0,0,1],clearDepth:1})}return e}render(){if(this.ready){const e=this.context.device.createCommandEncoder();this.firstpass=!0;const t=e.beginRenderPass(this.getRenderPassDescriptor());this.firstpass=!1,this.axis&&this.axis.draw(t),this.gaussianSplat&&this.gaussianSplat.draw(t),t.end();const n=e.finish();this.context.device.queue.submit([n])}requestAnimationFrame(this.render.bind(this))}draw(){requestAnimationFrame(this.render.bind(this))}setPane(){}}function ie(){const h=new oe;h.onReady(e=>{re.info("GaussianSplatDemo ready");const t=$(w(),w(),Math.PI);ae.loadByWorker(N,n=>{const o=i.fromPLY(n,t);h.setGaussianSplat(o)}),h.draw()})}ie();
