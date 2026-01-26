import"./modulepreload-polyfill-B5Qt9EMX.js";import{N as k,G as R,P as N,c as A,a as W}from"./webgpuUtils-0ZPxhwwT.js";import{e as E,c as b,l as q,i as M,g as I,n as S,s as Y,h as r,j as O,k as o,m as u,b as Z,d as _,C as H,a as X,P as $}from"./camera-DXA52umf.js";import{m as j,c as T,a as C}from"./webgpu-utils.module-DPkR54bZ.js";const V=`\r
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
}`;class J{label="SimpleLineProgram";gpuinfo;canvasinfo;mode;definition;module=null;pipeline=null;vertexBuffer=null;sceneUniform=null;sceneBindGroupLayout=null;vertexCount=0;constructor(e){this.gpuinfo=e.gpuinfo,this.canvasinfo=e.canvasinfo,this.mode=e.mode,this.definition=j(V),this.initWebGPU()}setData(e){const{positions:a,colors:i}=e;this.vertexCount=a.length/3;const n=T(this.gpuinfo.device,{position:{data:a,numComponents:3},colors:{data:i,numComponents:4}},{interleave:!0}).buffers[0];if(this.vertexBuffer){const t=this.vertexBuffer;this.vertexBuffer=n,t.destroy()}else this.vertexBuffer=n}refreshUniform(e,a){const i=this.gpuinfo.device,n=C(this.definition.uniforms.scene);this.sceneUniform||(this.sceneUniform=i.createBuffer({label:this.label,size:n.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST})),n.set({viewmtx:e.viewMtx,projmtx:a.perspectiveMatrixZO}),i.queue.writeBuffer(this.sceneUniform,0,n.arrayBuffer)}initWebGPU(){this.module=this.gpuinfo.device.createShaderModule({label:this.label,code:V}),this.sceneBindGroupLayout=this.gpuinfo.device.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]});const e=this.gpuinfo.device.createPipelineLayout({bindGroupLayouts:[this.sceneBindGroupLayout]});this.pipeline=this.gpuinfo.device.createRenderPipeline({label:this.label,layout:e,vertex:{module:this.module,buffers:[{arrayStride:28,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32x4"}],stepMode:"vertex"}]},fragment:{module:this.module,targets:[{format:this.canvasinfo.context.getConfiguration().format}]},primitive:{topology:this.mode,cullMode:"none"},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"}})}draw(e,a,i){this.refreshUniform(e,a);const n=this.gpuinfo.device.createBindGroup({layout:this.sceneBindGroupLayout,entries:[{binding:0,resource:{buffer:this.sceneUniform}}]});i.setPipeline(this.pipeline),i.setBindGroup(0,n),i.setVertexBuffer(0,this.vertexBuffer),i.draw(this.vertexCount)}}class p{static white=[1,1,1,1];static black=[0,0,0,1];static red=[1,0,0,1];static green=[0,1,0,1];static blue=[0,0,1,1];static transparent=[0,0,0,0];static silver=[.9,.9,.9,1];static lightGray=[.75,.75,.75,1];static gray=[.5,.5,.5,1];static darkGray=[.25,.25,.25,1];static cyan=[0,1,1,1];static magenta=[1,0,1,1];static neonGreen=[.22,1,.08,1];static electricBlue=[0,.47,1,1];static hotPink=[1,.05,.6,1];static forestGreen=[.13,.55,.13,1];static seafoam=[.44,.9,.69,1];static sand=[.76,.7,.5,1];static deepSea=[0,.1,.2,1];static errorRed=[1,0,0,1];static warningYellow=[1,.9,0,1];static successGreen=[0,.8,0,1];static infoBlue=[.1,.6,1,1];static skyBlue=[.53,.81,.92,1];static orange=[1,.65,0,1];static lime=[.75,1,0,1];static purple=[.5,0,.5,1];static slate=[.27,.35,.39,1];static gold=[1,.84,0,1];static crimson=[.86,.08,.24,1]}class K{#n;#a;#o;#u;#s;#r;#i;#c;#l;#m;#f;#h;shaderDefinition=null;module=null;pipeline=null;vertexBuffer=null;indexBuffer=null;sceneUniform=null;frustumUniform=null;callbacks=[];constructor(e){this.#n=e.eye,this.#a=e.target,this.#o=e.near,this.#u=e.far,this.#s=e.aspect,this.#r=e.fovy,this.#i=e.up,this.#c=new k({colors:[p.cyan,p.magenta,p.neonGreen,p.electricBlue,p.hotPink,p.sand],colormode:"face"}),this.#e()}set eye(e){this.#n=e,this.#e(),this.#t()}get eye(){return this.#n}set target(e){this.#a=e,this.#e(),this.#t()}get target(){return this.#a}set up(e){this.#i=e,this.#e(),this.#t(),console.log(this.#i)}get up(){return this.#i}set near(e){this.#o=e,this.#e(),this.#t()}get near(){return this.#o}set far(e){this.#u=e,this.#e(),this.#t()}get far(){return this.#u}set aspect(e){this.#s=e,this.#e(),this.#t()}get aspect(){return this.#s}set fovy(e){this.#r=e,this.#e(),this.#t()}get fovy(){return this.#r}addChangeCallbacks(e){this.callbacks.push(e)}#t(){for(const e of this.callbacks)e(this)}#e(){const e=E(b(),this.#r,this.#s,this.#o,this.#u),a=this.#a,i=q(b(),this.#n,a,this.#i),n=M(b(),e),t=M(b(),i);this.#l=e,this.#m=i,this.#f=n,this.#h=t}computeSightLine(){const e=I(...this.eye),a=I(...this.target),i=I(...this.#i),n=this.near,t=this.far,s=S(r(),Y(r(),a,e)),c=S(r(),O(r(),s,i)),f=S(r(),O(r(),s,c)),h=o(r(),s,n),l=u(r(),e,h),m=Math.tan(this.#r/2)*n,x=this.#s*m;let G=u(r(),l,o(r(),c,x));G=u(r(),G,o(r(),f,m));let F=u(r(),l,o(r(),c,-x));F=u(r(),F,o(r(),f,m));let L=u(r(),l,o(r(),c,x));L=u(r(),L,o(r(),f,-m));let D=u(r(),l,o(r(),c,-x));D=u(r(),D,o(r(),f,-m));const z=o(r(),s,t),d=u(r(),e,z),g=Math.tan(this.#r/2)*t,y=this.#s*g;let B=u(r(),d,o(r(),c,y));B=u(r(),B,o(r(),f,g));let P=u(r(),d,o(r(),c,-y));P=u(r(),P,o(r(),f,g));let w=u(r(),d,o(r(),c,y));w=u(r(),w,o(r(),f,-g));let U=u(r(),d,o(r(),c,-y));return U=u(r(),U,o(r(),f,-g)),new Float32Array([...e,...d,...e,...B,...e,...P,...e,...w,...e,...U])}refreshVertexBuffer(e){this.vertexBuffer||(this.vertexBuffer=T(e,{position:{data:this.#c.positions,numComponents:3},color:{data:this.#c.colors,numComponents:4}}))}refreshUniform(e,a,i){const n="Frustum",t=C(this.shaderDefinition.uniforms.frustum);this.frustumUniform||(this.frustumUniform=e.createBuffer({label:n,size:t.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST})),t.set({viewmtxInv:this.#h,projmtxInv:this.#f}),e.queue.writeBuffer(this.frustumUniform,0,t.arrayBuffer);const s=C(this.shaderDefinition.uniforms.scene);this.sceneUniform||(this.sceneUniform=e.createBuffer({label:n,size:s.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST})),s.set({viewmtx:a.viewMtx,projmtx:i.perspectiveMatrixZO}),e.queue.writeBuffer(this.sceneUniform,0,s.arrayBuffer)}initWebGPU(e,a,i,n){const t=e.device,s=`

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
        
        `,c="Frustum";this.shaderDefinition=j(s),this.refreshVertexBuffer(t),this.refreshUniform(t,i,n),this.module=t.createShaderModule({label:c,code:s}),this.pipeline=t.createRenderPipeline({label:c,layout:"auto",vertex:{module:this.module,buffers:this.vertexBuffer.bufferLayouts},fragment:{module:this.module,targets:[{format:a.context.getConfiguration().format,blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}},writeMask:GPUColorWrite.ALL}]},primitive:{topology:"triangle-list",cullMode:"none",frontFace:"ccw"},depthStencil:{format:"depth32float",depthWriteEnabled:!1,depthCompare:"less"}})}draw(e,a,i,n){const t=e.device;this.refreshVertexBuffer(t),this.refreshUniform(t,a,i);const s=t.createBindGroup({label:"Frustum",layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this.frustumUniform}},{binding:1,resource:{buffer:this.sceneUniform}}]});n.setPipeline(this.pipeline),n.setBindGroup(0,s),n.setVertexBuffer(0,this.vertexBuffer.buffers[0]),n.draw(this.#c.vertexCount)}}class Q{gpuInfo=null;canvasInfo=null;colorTexture=null;depthTexture=null;camera=null;projection=null;cameraMouseCtrl=null;firstpass=!0;ready=!1;resizeObserver=null;ground=new R(1e3,1e3);frustum=null;simpleLineProgram=null;pane;paneParams={frustum:{eye:{x:-20,y:20,z:400},target:{x:-20,y:20,z:10},up:{x:0,y:1,z:0},near:100,far:300,aspect:1.5,fovy:Math.PI/4}};constructor(){Z().then(e=>{if(e===null){console.error("GPU INFO is NULL");return}this.gpuInfo=e;const i=_({canvasId:"webgpu-canvas",config:{device:e.device,format:e.gpu.getPreferredCanvasFormat()}});if(i===null){console.error("canvasInfo is NULL");return}this.canvasInfo=i;const n=this.canvasInfo.canvas.width,t=this.canvasInfo.canvas.height;this.canvasInfo=i,this.refreshDepthTexture(),this.camera=new H([-500,500,500,1],[0,0,0,1],[0,0,1,0]),this.projection=new N(Math.PI/2,n/t,1,1e4),this.cameraMouseCtrl=new X(this.camera,this.canvasInfo.canvas),this.cameraMouseCtrl.enable(),this.ground.initWebGPU(this.gpuInfo,this.canvasInfo),this.frustum=new K({eye:Object.values(this.paneParams.frustum.eye),target:Object.values(this.paneParams.frustum.target),up:Object.values(this.paneParams.frustum.up),near:this.paneParams.frustum.near,far:this.paneParams.frustum.far,aspect:this.paneParams.frustum.aspect,fovy:this.paneParams.frustum.fovy}),this.frustum.initWebGPU(this.gpuInfo,this.canvasInfo,this.camera,this.projection),this.simpleLineProgram=new J({gpuinfo:this.gpuInfo,canvasinfo:this.canvasInfo,mode:"line-list"});const s=c=>{const f=c.computeSightLine(),h=f.length/3,l=new Float32Array([...Array(h).fill(p.red).flat()]);this.simpleLineProgram.setData({positions:f,colors:l})};s(this.frustum),this.frustum.addChangeCallbacks(s),this.resizeObserver=new ResizeObserver(c=>{for(const f of c){const h=f.target,l=f.contentBoxSize[0].inlineSize,m=f.contentBoxSize[0].blockSize;h.width=Math.max(1,Math.min(l,this.gpuInfo.device.limits.maxTextureDimension2D)),h.height=Math.max(1,Math.min(m,this.gpuInfo.device.limits.maxTextureDimension2D)),this.projection.aspect=h.width/h.height,this.refreshDepthTexture()}}),this.resizeObserver.observe(i.canvas),this.pane=new $({title:"参数控制",expanded:!0}),this.setPane(),this.ready=!0}).catch(e=>{this.ready=!1,console.error(e)})}refreshDepthTexture(){const e=A(this.gpuInfo,this.canvasInfo.canvas.width,this.canvasInfo.canvas.height);return this.depthTexture&&this.depthTexture.destroy(),this.depthTexture=e,this.depthTexture}getRenderPassDescriptor(){let e=null;if(this.ready){if(!this.depthTexture)return null;e=W({label:"demo",first:this.firstpass,colorTexture:this.canvasInfo.context.getCurrentTexture().createView(),depthTexture:this.depthTexture,clearColor:[0,0,0,1],clearDepth:1})}return e}render(){if(this.ready){const e=this.gpuInfo.device.createCommandEncoder();this.firstpass=!0;const a=e.beginRenderPass(this.getRenderPassDescriptor());this.firstpass=!1,this.ground.draw(this.gpuInfo,this.camera,this.projection,a),this.frustum.draw(this.gpuInfo,this.camera,this.projection,a),this.simpleLineProgram.draw(this.camera,this.projection,a),a.end();const i=e.finish();this.gpuInfo.device.queue.submit([i])}requestAnimationFrame(this.render.bind(this))}draw(){requestAnimationFrame(this.render.bind(this))}setPane(){const e=this.pane.addFolder({title:"视锥体位置姿态",expanded:!0}),a=e.addFolder({title:"eye",expanded:!1});a.addBinding(this.paneParams.frustum.eye,"x",{min:-1e3,max:1e3,step:.1,label:"x"}).on("change",t=>{const s=this.frustum.eye;s[0]=t.value,this.frustum.eye=s}),a.addBinding(this.paneParams.frustum.eye,"y",{min:-1e3,max:1e3,step:.1,label:"y"}).on("change",t=>{const s=this.frustum.eye;s[1]=t.value,this.frustum.eye=s}),a.addBinding(this.paneParams.frustum.eye,"z",{min:-1e3,max:1e3,step:.1,label:"z"}).on("change",t=>{const s=this.frustum.eye;s[2]=t.value,this.frustum.eye=s});const i=e.addFolder({title:"target",expanded:!1});i.addBinding(this.paneParams.frustum.target,"x",{min:-1e3,max:1e3,step:.1,label:"x"}).on("change",t=>{const s=this.frustum.target;s[0]=t.value,this.frustum.target=s}),i.addBinding(this.paneParams.frustum.target,"y",{min:-1e3,max:1e3,step:.1,label:"y"}).on("change",t=>{const s=this.frustum.target;s[1]=t.value,this.frustum.target=s}),i.addBinding(this.paneParams.frustum.target,"z",{min:-1e3,max:1e3,step:.1,label:"z"}).on("change",t=>{const s=this.frustum.target;s[2]=t.value,this.frustum.target=s});const n=e.addFolder({title:"up",expanded:!1});n.addBinding(this.paneParams.frustum.up,"x",{min:-1,max:1,step:.01,label:"x"}).on("change",t=>{const s=this.frustum.up;s[0]=t.value,this.frustum.up=s}),n.addBinding(this.paneParams.frustum.up,"y",{min:-1,max:1,step:.01,label:"y"}).on("change",t=>{const s=this.frustum.up;s[1]=t.value,this.frustum.up=s}),n.addBinding(this.paneParams.frustum.up,"z",{min:-1,max:1,step:.01,label:"z"}).on("change",t=>{const s=this.frustum.up;s[2]=t.value,this.frustum.up=s}),e.addBinding(this.paneParams.frustum,"near",{min:1,max:1e3,step:.1,label:"near"}).on("change",t=>{t.value<this.frustum.far&&(this.frustum.near=t.value)}),e.addBinding(this.paneParams.frustum,"far",{min:1,max:1e3,step:.1,label:"far"}).on("change",t=>{t.value>this.frustum.near&&(this.frustum.far=t.value)}),e.addBinding(this.paneParams.frustum,"aspect",{min:.1,max:10,step:.1,label:"aspect"}).on("change",t=>{this.frustum.aspect=t.value}),e.addBinding(this.paneParams.frustum,"fovy",{min:.1,max:Math.PI,step:.1,label:"fovy"}).on("change",t=>{this.frustum.fovy=t.value})}}function ee(){new Q().draw()}ee();
