import"./modulepreload-polyfill-B5Qt9EMX.js";import{m as S,a as g,b as z,g as b,n as C,s as x,h as u,i as v,j as M,k as w,l as A,c as U,r as G,o as T,C as _,e as D,P as F}from"./webgpu-utils.module-DYoVC6wh.js";import{v as y,S as V,A as E,r as a}from"./axis-DPoguJ6D.js";import{P as I,M as j}from"./plyformat-B5bX0Ewg.js";import{c as O,P as R,G as k,a as W,b as N}from"./objects-DCNIAmTT.js";import{g as q}from"./cactus_splat3_30kSteps_142k_splats-B6q0-v_z.js";import"./color-DsrcJaFb.js";var P=`override MAX_LIGHTS: u32 = 10u;

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
    @location(0) vexposition: vec3f,    
    @location(1) vexnormal: vec3f,      
    @location(2) vextexcoord: vec2f,    
    @location(3) vexcolor: vec4f,       
    @location(4) insposition: vec3f,    
    @location(5) inscolor: vec4f,       
    @location(6) pixelsize: f32,      

}

struct AABB {\r
    low: vec3f,\r
    high: vec3f\r
}

struct PointUniform {\r
    aabb: AABB,\r
    modelmtx: mat4x4f\r
}

@group(1) @binding(0) var<uniform> pointUniform: PointUniform;\r

struct VSOutput {\r
    @builtin(position) position: vec4f,\r
    @location(0) color: vec4f\r
}

fn aabbCorners(aabb: AABB) -> array<vec3f,8u> {\r
    var arr: array<vec3f,8>;\r
    arr[0] = vec3f(aabb.low[0],aabb.low[1],aabb.low[2]);\r
    arr[1] = vec3f(aabb.low[0],aabb.low[1],aabb.high[2]);\r
    arr[2] = vec3f(aabb.low[0],aabb.high[1],aabb.low[2]);\r
    arr[3] = vec3f(aabb.low[0],aabb.high[1],aabb.high[2]);\r
    arr[4] = vec3f(aabb.high[0],aabb.low[1],aabb.low[2]);\r
    arr[5] = vec3f(aabb.high[0],aabb.low[1],aabb.high[2]);\r
    arr[6] = vec3f(aabb.high[0],aabb.high[1],aabb.low[2]);\r
    arr[7] = vec3f(aabb.high[0],aabb.high[1],aabb.high[2]);\r
    return arr;\r
}

@vertex fn vs(input:VSInput) -> VSOutput {\r
    let modelpos = pointUniform.modelmtx * vec4f(input.vexposition, 1.0f);\r
    var worldpos = scene.worldmtx * modelpos;\r
    let pointpos = scene.worldmtx * vec4f(input.insposition,1.0);

    let world_aabb_low = scene.worldmtx * pointUniform.modelmtx * vec4f(pointUniform.aabb.low,1.0);\r
    let world_aabb_high = scene.worldmtx* pointUniform.modelmtx * vec4f(pointUniform.aabb.high,1.0);\r
    let world_aabb_center = (world_aabb_high + world_aabb_low)/2.0f;\r
    let offset = pointpos - world_aabb_center;

    var worldAABB = AABB(world_aabb_low.xyz,world_aabb_high.xyz);

    let corners = aabbCorners(worldAABB);\r
    var smin = vec2f(f32(1E10));\r
    var smax = vec2f(f32(-1E10));\r
    for(var i=0u; i<8u; i+=1) {\r
        let c = spv(vec4f(corners[i]+offset.xyz,1.0f));\r
        smin = min(c.xy, smin);\r
        smax = max(c.xy, smax);\r
    }\r
    var pixlen = distance(smin, smax);\r
    let scale = pixlen / input.pixelsize;

    worldpos = ((worldpos - world_aabb_center) * (1.0/scale)) + world_aabb_center;\r
    worldpos = worldpos + offset;\r
    worldpos.w = 1.0;\r
    let ndcpos = pv(worldpos);

    var output: VSOutput;\r
    output.position = ndcpos;\r
    output.color = input.inscolor;\r
    \r
    return output;\r
}

struct FSOutput {\r
    @location(0) color: vec4f\r
}

@fragment fn fs(input: VSOutput) -> FSOutput {\r
    var output: FSOutput;\r
    output.color = input.color;\r
    return output;\r
}`;class X{name="PointLayer";points;pointSizes;pointColors;pointMesh;scene;webgpu={definitions:{},modules:{},pipelines:{},buffers:{},uniforms:{},textures:{},sampler:{},bindgroups:{}};constructor(e){this.name=e.name??"PointLayer",this.points=e.points,this.pointSizes=e.pointSizes,this.pointColors=e.pointColors,this.pointMesh=e.pointMesh}setPointMesh(e){this.pointMesh=e}initWebGPU(e,t){this.webgpu.context=e,this.scene=t}getNumPoints(){return this.points.length/3}setPointSizes(e){this.pointSizes=e,this.refreshVertexBuffers()}getPointSizes(){return this.pointSizes==null&&(this.pointSizes=Array(this.getNumPoints()).fill(1)),this.pointSizes}getPointColors(){return this.pointColors==null&&(this.pointColors=Array(this.getNumPoints()).fill([1,0,0,1]).flat()),this.pointColors}getDefinition(){return this.webgpu.definitions.default==null&&(this.webgpu.definitions.default=S(P)),this.webgpu.definitions.default}refreshVertexBuffers(){const e=this.webgpu.context?.device;if(e==null)return null;const t={vexposition:{data:this.pointMesh.positions,numComponents:3,shaderLocation:0},vexnormal:{data:this.pointMesh.normals,numComponents:3,shaderLocation:1},vextexcoord:{data:this.pointMesh.texcoords,numComponents:3,shaderLocation:2},vexcolor:{data:this.pointMesh.colors,numComponents:4,shaderLocation:3}};this.pointMesh.vertexIndices!=null&&(t.indices={data:this.pointMesh.vertexIndices,numComponents:1}),this.webgpu.buffers.vertex=g(e,t,{stepMode:"vertex",shaderLocation:0});const n={insposition:{data:this.points,numComponents:3,shaderLocation:4},inscolor:{data:this.getPointColors(),numComponents:4,shaderLocation:5},pixelsize:{data:this.getPointSizes(),numComponents:1,shaderLocation:6}};this.webgpu.buffers.instance=g(e,n,{stepMode:"instance",shaderLocation:4})}getVertexBuffers(){return this.webgpu.context?.device==null?null:((this.webgpu.buffers.vertex==null||this.webgpu.buffers.instance==null)&&this.refreshVertexBuffers(),this.webgpu.buffers)}getUniform(){const e=this.webgpu.context?.device;if(e==null)return null;const t=z(this.getDefinition().uniforms.pointUniform);if(this.webgpu.uniforms.default==null){this.webgpu.uniforms.default=e.createBuffer({label:this.name,size:t.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});const n=this.pointMesh.getAABB(),r=this.pointMesh.modelmtx;t.set({aabb:{low:n.low,high:n.high},modelmtx:r}),e.queue.writeBuffer(this.webgpu.uniforms.default,0,t.arrayBuffer)}return this.webgpu.uniforms.default}getPipeline(){const e=this.webgpu.context?.device;if(e==null)return null;if(this.webgpu.pipelines.default!=null)return this.webgpu.pipelines.default;const t=e.createShaderModule({label:this.name,code:P}),n=e.createBindGroupLayout({label:this.name,entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),r=e.createPipelineLayout({label:this.name,bindGroupLayouts:[this.scene.bindGroupLayout,n]}),i=this.getVertexBuffers(),o=e.createRenderPipeline({label:this.name,layout:r,vertex:{module:t,buffers:[...i.vertex.bufferLayouts,...i.instance.bufferLayouts]},fragment:{module:t,targets:[{format:this.webgpu.context.canvas.context.getConfiguration().format,blend:{color:{operation:"add",srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha"},alpha:{operation:"add",srcFactor:"one",dstFactor:"one-minus-src-alpha"}}}]},primitive:{topology:"triangle-list",cullMode:"none"},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less-equal"}});return this.webgpu.modules.default=t,this.webgpu.pipelines.default=o,this.webgpu.pipelines.default}getBindGroup(){const e=this.webgpu.context?.device;if(e==null)return null;const t=this.getPipeline();return this.webgpu.bindgroups.default==null&&(this.webgpu.bindgroups.default=e.createBindGroup({label:this.name,layout:t.getBindGroupLayout(1),entries:[{binding:0,resource:{buffer:this.getUniform()}}]})),this.webgpu.bindgroups.default}draw(e){if(this.webgpu.context==null)return;e.setPipeline(this.getPipeline()),e.setBindGroup(0,this.scene.bindGroup),e.setBindGroup(1,this.getBindGroup());const t=this.getVertexBuffers();e.setVertexBuffer(0,t.vertex.buffers[0]),e.setVertexBuffer(1,t.instance.buffers[0]),this.pointMesh.vertexIndices!=null?(e.setIndexBuffer(t.vertex.indexBuffer,t.vertex.indexFormat),e.drawIndexed(t.vertex.numElements,t.instance.numElements)):e.draw(t.vertex.numElements,t.instance.numElements)}destroy(){Object.values(this.webgpu.buffers).forEach(e=>{e.buffers.forEach(t=>t.destroy()),e.indexBuffer?.destroy()}),Object.values(this.webgpu.uniforms).forEach(e=>e.destroy()),Object.values(this.webgpu.textures).forEach(e=>e.destroy())}}class ${name="Rectangle";low;high;vlr;constructor(e="Rectangle",t=[-1,-1,0],n=[1,1,0],r=[1,0,0]){this.name=e,this.low=b(...t),this.high=b(...n),this.vlr=b(...r),C(this.vlr,this.vlr)}toTriagles(){const e=x(u(),this.high,this.low);if(v(y(e),this.vlr)<=1e-6)return console.warn("Rectangle, vlr is paralleled with diagonal!"),{positions:new Float32Array([]),normals:new Float32Array([]),texcoords:new Float32Array([])};const n=v(e,this.vlr),r=M(u(),this.vlr,n),i=w(u(),this.low,r),o=x(u(),e,r),l=w(u(),this.low,o),s=y(A(u(),this.vlr,e)),p=[...this.low,...i,...this.high,...this.low,...this.high,...l],d=[...s,...s,...s,...s,...s,...s],h=[0,0,1,0,1,1,0,0,1,1,0,1];return{positions:new Float32Array(p),normals:new Float32Array(d),texcoords:new Float32Array(h)}}getMeshData(){return this.toTriagles()}}class Y{context;ready=!1;scene;cameraMouseCtrl;ground;axis;resizeObserver;readyCallbacks=[];mesh;pointLayer;pane;paneParameters={pointLayer:{minSize:1,maxSize:50}};webgpu={firstPass:!0,depthFormat:"depth32float"};constructor(){const e=document.getElementById("webgpu-canvas");O(e).then(t=>{if(this.context=t,this.context==null)return;const n=this.context.canvas.element.width,r=this.context.canvas.element.height,i=U();G(i,i,-Math.PI/2),T(i,i,-Math.PI/2);const o=[500,500,500,1],l=[0,0,0,1],s=[0,1,0,0],p=new _(o,l,s),d=new R(Math.PI/2,n/r,.1,1e4);this.scene=new V(p,d),this.scene.setWorldMatrix(i),this.scene.initWebGPU(this.context),this.scene.refreshViewport(n,r),this.cameraMouseCtrl=new D(p,this.context.canvas.element),this.cameraMouseCtrl.enable(),this.refreshDepthTexture(),this.ground=new k({xsize:1e3,ysize:1e3,density:2,worldmtx:i}),this.ground.initWebGPU(this.context),this.axis=new E({xlim:[0,500],ylim:[0,500],zlim:[0,500]}),this.axis.initWebGPU(this.context,this.scene),this.resizeObserver=new ResizeObserver(h=>{for(const m of h){const c=m.target,B=m.contentBoxSize[0].inlineSize,L=m.contentBoxSize[0].blockSize;c.width=Math.max(1,Math.min(B,this.context.device.limits.maxTextureDimension2D)),c.height=Math.max(1,Math.min(L,this.context.device.limits.maxTextureDimension2D)),this.scene.projection.aspect=c.width/c.height,this.scene.refreshViewport(c.width,c.height),this.refreshDepthTexture()}}),this.resizeObserver.observe(this.context.canvas.element),this.ready=!0,this.readyCallbacks.forEach(h=>h(this))})}getPointLayer(){if(this.pointLayer==null){const e=new $("rectangle",[-10,-10,0],[10,10,0]),t=new j,n=e.getMeshData();t.positions=n.positions,t.normals=n.normals,t.texcoords=n.texcoords,t.setColor([1,0,0,1]),t.initWebGPU(this.context,this.scene);const r=Array(100).fill(0).map(s=>[a(-100,100),a(-100,100),a(0,200)]).flat(),i=Array(100).fill(0).map(s=>[a(0,1),a(0,1),a(0,1),1]).flat(),o=Array(100).fill(0).map(s=>a(this.paneParameters.pointLayer.minSize,this.paneParameters.pointLayer.maxSize)).flat(),l=new X({name:"pointLayer",points:r,pointMesh:t,pointColors:i,pointSizes:o});l.initWebGPU(this.context,this.scene),this.pointLayer=l}return this.pointLayer}onReady(e){this.ready?e(this):this.readyCallbacks.push(e)}refreshDepthTexture(){const e=W(this.context,this.webgpu.depthFormat);return this.webgpu.depthTexture&&this.webgpu.depthTexture.destroy(),this.webgpu.depthTexture=e,this.webgpu.depthTexture}getRenderPassDescriptor(){let e=null;if(this.ready){if(!this.webgpu.depthTexture)return null;e=N({label:"demo",first:this.webgpu.firstPass,colorTexture:this.context.canvas.context.getCurrentTexture().createView(),depthTexture:this.webgpu.depthTexture,clearColor:[0,0,0,1],clearDepth:1})}return e}render(){if(this.ready){const e=this.context.device.createCommandEncoder();this.webgpu.firstPass=!0;const t=e.beginRenderPass(this.getRenderPassDescriptor());this.webgpu.firstPass=!1,this.scene.canEnv()&&this.scene.getEnv().draw(t),this.ground&&this.ground.draw(this.context,this.scene.camera,this.scene.projection,t),this.axis&&this.axis.draw(t),this.mesh&&this.mesh.draw(t);const n=this.getPointLayer();n&&n.draw(t),t.end();const r=e.finish();this.context.device.queue.submit([r])}requestAnimationFrame(this.render.bind(this))}draw(){requestAnimationFrame(this.render.bind(this))}destroy(){this.webgpu.depthTexture&&this.webgpu.depthTexture.destroy(),this.ground&&this.ground.destroy(),this.axis&&this.axis.destroy()}setPane(){this.pane==null&&(this.pane=new F({title:"几何对象绘制配置"}));const e=this.pane.addFolder({title:"点图层"});e.addBinding(this.paneParameters.pointLayer,"minSize",{label:"点最小尺寸(像素)",min:1,max:100}),e.addBinding(this.paneParameters.pointLayer,"maxSize",{label:"点最大尺寸(像素)",min:1,max:100}),e.addButton({title:"点大小随机"}).on("click",()=>{if(this.pointLayer){const t=this.pointLayer.getNumPoints(),n=this.paneParameters.pointLayer.minSize,r=this.paneParameters.pointLayer.maxSize,i=Array(t).fill(0).map(o=>a(n,r));this.pointLayer.setPointSizes(i)}})}}function H(){new Y().onReady(e=>{e.setPane(),e.draw()}),I.loadByWorker(q,e=>{console.log("ply load finish"),console.log(e)})}H();
