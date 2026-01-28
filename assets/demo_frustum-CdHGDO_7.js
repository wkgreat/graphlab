import"./modulepreload-polyfill-B5Qt9EMX.js";import{N as R,C as p,G as k,P as N,c as A,a as W}from"./color-Bd6XzoaT.js";import{e as E,c as b,l as q,i as M,g as I,n as C,s as Z,h as r,j as O,k as o,m as u,b as Y,d as _,C as H,a as X,P as $}from"./camera-DXA52umf.js";import{m as j,c as T,a as S}from"./webgpu-utils.module-DPkR54bZ.js";const V=`\r
struct SceneUniform {\r
    viewmtx: mat4x4f,\r
    projmtx: mat4x4f\r
}\r
\r
@group(0) @binding(0) var<uniform> scene: SceneUniform;\r
\r
struct VSInput {\r
    @location(0) position: vec3f,\r
    @location(1) color: vec4f\r
} \r
\r
struct VSOutput {\r
    @builtin(position) position: vec4f,\r
    @location(0) color: vec4f\r
}\r
\r
@vertex\r
fn vs(input: VSInput) -> VSOutput {\r
    var output: VSOutput;\r
    let worldpos = vec4f(input.position, 1.0);\r
    let ndcpos = scene.projmtx * scene.viewmtx * worldpos;\r
    output.position = ndcpos;\r
    output.color = input.color;\r
    return output;\r
}\r
\r
@fragment\r
fn fs(input: VSOutput) -> @location(0) vec4f {\r
    return input.color;\r
}`;class J{label="SimpleLineProgram";gpuinfo;canvasinfo;mode;definition;module=null;pipeline=null;vertexBuffer=null;sceneUniform=null;sceneBindGroupLayout=null;vertexCount=0;constructor(e){this.gpuinfo=e.gpuinfo,this.canvasinfo=e.canvasinfo,this.mode=e.mode,this.definition=j(V),this.initWebGPU()}setData(e){const{positions:a,colors:n}=e;this.vertexCount=a.length/3;const i=T(this.gpuinfo.device,{position:{data:a,numComponents:3},colors:{data:n,numComponents:4}},{interleave:!0}).buffers[0];if(this.vertexBuffer){const t=this.vertexBuffer;this.vertexBuffer=i,t.destroy()}else this.vertexBuffer=i}refreshUniform(e,a){const n=this.gpuinfo.device,i=S(this.definition.uniforms.scene);this.sceneUniform||(this.sceneUniform=n.createBuffer({label:this.label,size:i.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST})),i.set({viewmtx:e.viewMtx,projmtx:a.perspectiveMatrixZO}),n.queue.writeBuffer(this.sceneUniform,0,i.arrayBuffer)}initWebGPU(){this.module=this.gpuinfo.device.createShaderModule({label:this.label,code:V}),this.sceneBindGroupLayout=this.gpuinfo.device.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]});const e=this.gpuinfo.device.createPipelineLayout({bindGroupLayouts:[this.sceneBindGroupLayout]});this.pipeline=this.gpuinfo.device.createRenderPipeline({label:this.label,layout:e,vertex:{module:this.module,buffers:[{arrayStride:28,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32x4"}],stepMode:"vertex"}]},fragment:{module:this.module,targets:[{format:this.canvasinfo.context.getConfiguration().format}]},primitive:{topology:this.mode,cullMode:"none"},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"}})}draw(e,a,n){this.refreshUniform(e,a);const i=this.gpuinfo.device.createBindGroup({layout:this.sceneBindGroupLayout,entries:[{binding:0,resource:{buffer:this.sceneUniform}}]});n.setPipeline(this.pipeline),n.setBindGroup(0,i),n.setVertexBuffer(0,this.vertexBuffer),n.draw(this.vertexCount)}}class K{#i;#a;#o;#u;#s;#r;#n;#f;#l;#m;#h;#c;shaderDefinition=null;module=null;pipeline=null;vertexBuffer=null;indexBuffer=null;sceneUniform=null;frustumUniform=null;callbacks=[];constructor(e){this.#i=e.eye,this.#a=e.target,this.#o=e.near,this.#u=e.far,this.#s=e.aspect,this.#r=e.fovy,this.#n=e.up,this.#f=new R({colors:[p.cyan,p.magenta,p.neonGreen,p.electricBlue,p.hotPink,p.sand],colormode:"face"}),this.#e()}set eye(e){this.#i=e,this.#e(),this.#t()}get eye(){return this.#i}set target(e){this.#a=e,this.#e(),this.#t()}get target(){return this.#a}set up(e){this.#n=e,this.#e(),this.#t(),console.log(this.#n)}get up(){return this.#n}set near(e){this.#o=e,this.#e(),this.#t()}get near(){return this.#o}set far(e){this.#u=e,this.#e(),this.#t()}get far(){return this.#u}set aspect(e){this.#s=e,this.#e(),this.#t()}get aspect(){return this.#s}set fovy(e){this.#r=e,this.#e(),this.#t()}get fovy(){return this.#r}addChangeCallbacks(e){this.callbacks.push(e)}#t(){for(const e of this.callbacks)e(this)}#e(){const e=E(b(),this.#r,this.#s,this.#o,this.#u),a=this.#a,n=q(b(),this.#i,a,this.#n),i=M(b(),e),t=M(b(),n);this.#l=e,this.#m=n,this.#h=i,this.#c=t}computeSightLine(){const e=I(...this.eye),a=I(...this.target),n=I(...this.#n),i=this.near,t=this.far,s=C(r(),Z(r(),a,e)),f=C(r(),O(r(),s,n)),h=C(r(),O(r(),s,f)),c=o(r(),s,i),l=u(r(),e,c),m=Math.tan(this.#r/2)*i,g=this.#s*m;let F=u(r(),l,o(r(),f,g));F=u(r(),F,o(r(),h,m));let G=u(r(),l,o(r(),f,-g));G=u(r(),G,o(r(),h,m));let L=u(r(),l,o(r(),f,g));L=u(r(),L,o(r(),h,-m));let D=u(r(),l,o(r(),f,-g));D=u(r(),D,o(r(),h,-m));const z=o(r(),s,t),d=u(r(),e,z),v=Math.tan(this.#r/2)*t,x=this.#s*v;let P=u(r(),d,o(r(),f,x));P=u(r(),P,o(r(),h,v));let B=u(r(),d,o(r(),f,-x));B=u(r(),B,o(r(),h,v));let w=u(r(),d,o(r(),f,x));w=u(r(),w,o(r(),h,-v));let U=u(r(),d,o(r(),f,-x));return U=u(r(),U,o(r(),h,-v)),new Float32Array([...e,...d,...e,...P,...e,...B,...e,...w,...e,...U])}refreshVertexBuffer(e){this.vertexBuffer||(this.vertexBuffer=T(e,{position:{data:this.#f.positions,numComponents:3},color:{data:this.#f.colors,numComponents:4}}))}refreshUniform(e,a,n){const i="Frustum",t=S(this.shaderDefinition.uniforms.frustum);this.frustumUniform||(this.frustumUniform=e.createBuffer({label:i,size:t.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST})),t.set({viewmtxInv:this.#c,projmtxInv:this.#h}),e.queue.writeBuffer(this.frustumUniform,0,t.arrayBuffer);const s=S(this.shaderDefinition.uniforms.scene);this.sceneUniform||(this.sceneUniform=e.createBuffer({label:i,size:s.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST})),s.set({viewmtx:a.viewMtx,projmtx:n.perspectiveMatrixZO}),e.queue.writeBuffer(this.sceneUniform,0,s.arrayBuffer)}initWebGPU(e,a,n,i){const t=e.device,s=`

        struct FrustumUniform {
            viewmtxInv: mat4x4f,
            projmtxInv: mat4x4f
        }
        
        struct SceneUniform {
            viewmtx: mat4x4f,
            projmtx: mat4x4f
        }

        @group(0) @binding(0) var<uniform> frustum : FrustumUniform;
        @group(0) @binding(1) var<uniform> scene : SceneUniform;

        struct VSInput {
            @location(0) position: vec3f,
            @location(1) color: vec4f
        }

        struct VSOutput {
            @builtin(position) position: vec4f,
            @location(0) color: vec4f
        }

        @vertex 
        fn vs(input: VSInput) -> VSOutput {

            let cubepos = vec4f(input.position, 1);

            let worldpos = frustum.viewmtxInv * frustum.projmtxInv * cubepos;

            let ndcpos = scene.projmtx * scene.viewmtx * worldpos;

            var output: VSOutput;

            output.position = ndcpos;

            output.color = input.color;

            return output;

        }
        
        @fragment 
        fn fs(input: VSOutput) -> @location(0) vec4f {
            var color = input.color;
            color.a = 0.5;
            return color;
        }
        
        `,f="Frustum";this.shaderDefinition=j(s),this.refreshVertexBuffer(t),this.refreshUniform(t,n,i),this.module=t.createShaderModule({label:f,code:s}),this.pipeline=t.createRenderPipeline({label:f,layout:"auto",vertex:{module:this.module,buffers:this.vertexBuffer.bufferLayouts},fragment:{module:this.module,targets:[{format:a.context.getConfiguration().format,blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}},writeMask:GPUColorWrite.ALL}]},primitive:{topology:"triangle-list",cullMode:"none",frontFace:"ccw"},depthStencil:{format:"depth32float",depthWriteEnabled:!1,depthCompare:"less"}})}draw(e,a,n,i){const t=e.device;this.refreshVertexBuffer(t),this.refreshUniform(t,a,n);const s=t.createBindGroup({label:"Frustum",layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this.frustumUniform}},{binding:1,resource:{buffer:this.sceneUniform}}]});i.setPipeline(this.pipeline),i.setBindGroup(0,s),i.setVertexBuffer(0,this.vertexBuffer.buffers[0]),i.draw(this.#f.vertexCount)}}class Q{gpuInfo=null;canvasInfo=null;colorTexture=null;depthTexture=null;camera=null;projection=null;cameraMouseCtrl=null;firstpass=!0;ready=!1;resizeObserver=null;ground=new k(1e3,1e3);frustum=null;simpleLineProgram=null;pane;paneParams={frustum:{eye:{x:-20,y:20,z:400},target:{x:-20,y:20,z:10},up:{x:0,y:1,z:0},near:100,far:300,aspect:1.5,fovy:Math.PI/4}};constructor(){Y().then(e=>{if(e===null){console.error("GPU INFO is NULL");return}this.gpuInfo=e;const n=_({canvasId:"webgpu-canvas",config:{device:e.device,format:e.gpu.getPreferredCanvasFormat()}});if(n===null){console.error("canvasInfo is NULL");return}this.canvasInfo=n;const i=this.canvasInfo.canvas.width,t=this.canvasInfo.canvas.height;this.canvasInfo=n,this.refreshDepthTexture(),this.camera=new H([-500,500,500,1],[0,0,0,1],[0,0,1,0]),this.projection=new N(Math.PI/2,i/t,1,1e4),this.cameraMouseCtrl=new X(this.camera,this.canvasInfo.canvas),this.cameraMouseCtrl.enable(),this.ground.initWebGPU(this.gpuInfo,this.canvasInfo),this.frustum=new K({eye:Object.values(this.paneParams.frustum.eye),target:Object.values(this.paneParams.frustum.target),up:Object.values(this.paneParams.frustum.up),near:this.paneParams.frustum.near,far:this.paneParams.frustum.far,aspect:this.paneParams.frustum.aspect,fovy:this.paneParams.frustum.fovy}),this.frustum.initWebGPU(this.gpuInfo,this.canvasInfo,this.camera,this.projection),this.simpleLineProgram=new J({gpuinfo:this.gpuInfo,canvasinfo:this.canvasInfo,mode:"line-list"});const s=f=>{const h=f.computeSightLine(),c=h.length/3,l=new Float32Array([...Array(c).fill(p.red).flat()]);this.simpleLineProgram.setData({positions:h,colors:l})};s(this.frustum),this.frustum.addChangeCallbacks(s),this.resizeObserver=new ResizeObserver(f=>{for(const h of f){const c=h.target,l=h.contentBoxSize[0].inlineSize,m=h.contentBoxSize[0].blockSize;c.width=Math.max(1,Math.min(l,this.gpuInfo.device.limits.maxTextureDimension2D)),c.height=Math.max(1,Math.min(m,this.gpuInfo.device.limits.maxTextureDimension2D)),this.projection.aspect=c.width/c.height,this.refreshDepthTexture()}}),this.resizeObserver.observe(n.canvas),this.pane=new $({title:"参数控制",expanded:!0}),this.setPane(),this.ready=!0}).catch(e=>{this.ready=!1,console.error(e)})}refreshDepthTexture(){const e=A(this.gpuInfo,this.canvasInfo.canvas.width,this.canvasInfo.canvas.height);return this.depthTexture&&this.depthTexture.destroy(),this.depthTexture=e,this.depthTexture}getRenderPassDescriptor(){let e=null;if(this.ready){if(!this.depthTexture)return null;e=W({label:"demo",first:this.firstpass,colorTexture:this.canvasInfo.context.getCurrentTexture().createView(),depthTexture:this.depthTexture,clearColor:[0,0,0,1],clearDepth:1})}return e}render(){if(this.ready){const e=this.gpuInfo.device.createCommandEncoder();this.firstpass=!0;const a=e.beginRenderPass(this.getRenderPassDescriptor());this.firstpass=!1,this.ground.draw(this.gpuInfo,this.camera,this.projection,a),this.frustum.draw(this.gpuInfo,this.camera,this.projection,a),this.simpleLineProgram.draw(this.camera,this.projection,a),a.end();const n=e.finish();this.gpuInfo.device.queue.submit([n])}requestAnimationFrame(this.render.bind(this))}draw(){requestAnimationFrame(this.render.bind(this))}setPane(){const e=this.pane.addFolder({title:"视锥体位置姿态",expanded:!0}),a=e.addFolder({title:"eye",expanded:!1});a.addBinding(this.paneParams.frustum.eye,"x",{min:-1e3,max:1e3,step:.1,label:"x"}).on("change",t=>{const s=this.frustum.eye;s[0]=t.value,this.frustum.eye=s}),a.addBinding(this.paneParams.frustum.eye,"y",{min:-1e3,max:1e3,step:.1,label:"y"}).on("change",t=>{const s=this.frustum.eye;s[1]=t.value,this.frustum.eye=s}),a.addBinding(this.paneParams.frustum.eye,"z",{min:-1e3,max:1e3,step:.1,label:"z"}).on("change",t=>{const s=this.frustum.eye;s[2]=t.value,this.frustum.eye=s});const n=e.addFolder({title:"target",expanded:!1});n.addBinding(this.paneParams.frustum.target,"x",{min:-1e3,max:1e3,step:.1,label:"x"}).on("change",t=>{const s=this.frustum.target;s[0]=t.value,this.frustum.target=s}),n.addBinding(this.paneParams.frustum.target,"y",{min:-1e3,max:1e3,step:.1,label:"y"}).on("change",t=>{const s=this.frustum.target;s[1]=t.value,this.frustum.target=s}),n.addBinding(this.paneParams.frustum.target,"z",{min:-1e3,max:1e3,step:.1,label:"z"}).on("change",t=>{const s=this.frustum.target;s[2]=t.value,this.frustum.target=s});const i=e.addFolder({title:"up",expanded:!1});i.addBinding(this.paneParams.frustum.up,"x",{min:-1,max:1,step:.01,label:"x"}).on("change",t=>{const s=this.frustum.up;s[0]=t.value,this.frustum.up=s}),i.addBinding(this.paneParams.frustum.up,"y",{min:-1,max:1,step:.01,label:"y"}).on("change",t=>{const s=this.frustum.up;s[1]=t.value,this.frustum.up=s}),i.addBinding(this.paneParams.frustum.up,"z",{min:-1,max:1,step:.01,label:"z"}).on("change",t=>{const s=this.frustum.up;s[2]=t.value,this.frustum.up=s}),e.addBinding(this.paneParams.frustum,"near",{min:1,max:1e3,step:.1,label:"near"}).on("change",t=>{t.value<this.frustum.far&&(this.frustum.near=t.value)}),e.addBinding(this.paneParams.frustum,"far",{min:1,max:1e3,step:.1,label:"far"}).on("change",t=>{t.value>this.frustum.near&&(this.frustum.far=t.value)}),e.addBinding(this.paneParams.frustum,"aspect",{min:.1,max:10,step:.1,label:"aspect"}).on("change",t=>{this.frustum.aspect=t.value}),e.addBinding(this.paneParams.frustum,"fovy",{min:.1,max:Math.PI,step:.1,label:"fovy"}).on("change",t=>{this.frustum.fovy=t.value})}}function ee(){new Q().draw()}ee();
