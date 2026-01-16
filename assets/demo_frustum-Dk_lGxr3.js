import"./modulepreload-polyfill-B5Qt9EMX.js";import{c as T,a as B,m as M}from"./webgpu-utils.module-DPkR54bZ.js";import{e as S,c as x,l as R,i as L,g as I,n as G,s as E,h as a,j as V,k as f,m as c,b as N,d as k,C as _,a as W,P as q}from"./camera-CKKJFnwh.js";function Y(o){const e=o.device;let i=o.color1,s=o.color2;const r=Math.max(o.density-o.density%2,2);i.every(l=>l<=1)&&(i=i.map(l=>l*255),i[3]=255),s.every(l=>l<=1)&&(s=s.map(l=>l*255),s[3]=255);const t=r,n=r,u=[];for(let l=0;l<t;++l)for(let d=0;d<n;++d)(l+d)%2===0?u.push(...i):u.push(...s);const h=new Uint8Array(u),p=e.createTexture({format:"rgba8unorm",size:[t,n,1],usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.COPY_DST});e.queue.writeTexture({texture:p,mipLevel:0,origin:{x:0,y:0,z:0}},h,{offset:0,bytesPerRow:t*4},{width:t,height:n,depthOrArrayLayers:1});const m=e.createSampler({minFilter:"nearest",magFilter:"nearest",addressModeU:"repeat",addressModeV:"repeat"});return{texture:p,sampler:m}}class g{static white=[1,1,1,1];static black=[0,0,0,1];static red=[1,0,0,1];static green=[0,1,0,1];static blue=[0,0,1,1];static transparent=[0,0,0,0];static silver=[.9,.9,.9,1];static lightGray=[.75,.75,.75,1];static gray=[.5,.5,.5,1];static darkGray=[.25,.25,.25,1];static cyan=[0,1,1,1];static magenta=[1,0,1,1];static neonGreen=[.22,1,.08,1];static electricBlue=[0,.47,1,1];static hotPink=[1,.05,.6,1];static forestGreen=[.13,.55,.13,1];static seafoam=[.44,.9,.69,1];static sand=[.76,.7,.5,1];static deepSea=[0,.1,.2,1];static errorRed=[1,0,0,1];static warningYellow=[1,.9,0,1];static successGreen=[0,.8,0,1];static infoBlue=[.1,.6,1,1];static skyBlue=[.53,.81,.92,1];static orange=[1,.65,0,1];static lime=[.75,1,0,1];static purple=[.5,0,.5,1];static slate=[.27,.35,.39,1];static gold=[1,.84,0,1];static crimson=[.86,.08,.24,1]}class Z{positions=[-1,-1,0,1,-1,0,1,1,0,-1,1,0];normals=[0,0,1,0,0,1,0,0,1,0,0,1];texcoords=[0,0,1,0,1,1,0,1];indices=[0,1,2,0,2,3];definition=null;sceneUniform=null;vertexBuffer=null;indexBuffer=null;module=null;pipeline=null;texture=null;sampler=null;constructor(e=100,i=100){const s=e/2,r=i/2;for(let t=0;t<this.positions.length;++t)t%3===0?this.positions[t]*=s:t%3===1&&(this.positions[t]*=r)}refreshVertexBuffer(e){const i=T(e,{position:{data:new Float32Array(this.positions),numComponents:3},texcoord:{data:new Float32Array(this.texcoords),numComponents:2},normal:{data:new Float32Array(this.normals),numComponents:3}}),s=new Uint32Array(this.indices),r=e.createBuffer({size:s.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST});e.queue.writeBuffer(r,0,s),this.vertexBuffer=i,this.indexBuffer=r}refreshTexture(e){if(!this.texture||!this.sampler){const i=Y({device:e,color1:[.7,.7,.7,1],color2:[.3,.3,.3,1],density:15});this.texture&&this.texture.destroy(),this.texture=i.texture,this.sampler=i.sampler}}refreshUniforms(e,i,s){if(!this.definition){console.error("definition is null");return}const r=B(this.definition.uniforms.scene);r.set({viewmtx:i.viewMtx,projmtx:s.perspectiveMatrixZO}),this.sceneUniform||(this.sceneUniform=e.createBuffer({size:r.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST})),e.queue.writeBuffer(this.sceneUniform,0,r.arrayBuffer)}initWebGPU(e,i){const s=e.device;this.refreshVertexBuffer(s);const r=`

        struct SceneUniform {
            viewmtx: mat4x4f,
            projmtx: mat4x4f
        }

        @group(0) @binding(0) var<uniform> scene: SceneUniform;

        @group(1) @binding(0) var theTexture: texture_2d<f32>;
        @group(1) @binding(1) var theSampler: sampler;
        
        struct VSInput {
            @location(0) position: vec3f,
            @location(1) texcoord: vec2f,
            @location(2) normal: vec3f
        }

        struct VSOutput {
            @builtin(position) position: vec4f,
            @location(0) texcoord: vec2f,
            @location(1) normal: vec3f
        }

        @vertex fn vs(input: VSInput) -> VSOutput {

            let worldpos = vec4f(input.position, 1.0);
            let ndcpos = scene.projmtx * scene.viewmtx * worldpos;
            var output: VSOutput;
            output.position = ndcpos;
            output.texcoord = input.texcoord;
            output.normal = input.normal;

            return output;

        }
        @fragment fn fs(input: VSOutput) -> @location(0) vec4f {

            var color = textureSample(theTexture, theSampler, input.texcoord);

            return color;
        }
        `;this.definition=M(r),this.module=s.createShaderModule({label:"Ground",code:r}),this.pipeline=s.createRenderPipeline({label:"Ground",layout:"auto",vertex:{module:this.module,buffers:this.vertexBuffer.bufferLayouts},fragment:{module:this.module,targets:[{format:i.context.getConfiguration().format}]},primitive:{topology:"triangle-list"},depthStencil:{format:"depth24plus",depthWriteEnabled:!1,depthCompare:"less-equal"}})}draw(e,i,s,r){const t=e.device;this.refreshTexture(t),this.refreshUniforms(t,i,s);const n=t.createBindGroup({label:"Ground",layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this.sceneUniform}}]}),u=t.createBindGroup({label:"Ground",layout:this.pipeline.getBindGroupLayout(1),entries:[{binding:0,resource:this.texture},{binding:1,resource:this.sampler}]});r.setPipeline(this.pipeline),r.setBindGroup(0,n),r.setBindGroup(1,u),r.setVertexBuffer(0,this.vertexBuffer.buffers[0]),r.setIndexBuffer(this.indexBuffer,"uint32"),r.drawIndexed(6)}}class X{positions=new Float32Array([-1,-1,1,1,-1,1,1,1,1,-1,-1,1,1,1,1,-1,1,1,-1,-1,-1,-1,1,-1,1,1,-1,-1,-1,-1,1,1,-1,1,-1,-1,-1,1,-1,-1,1,1,1,1,1,-1,1,-1,1,1,1,1,1,-1,-1,-1,-1,1,-1,-1,1,-1,1,-1,-1,-1,1,-1,1,-1,-1,1,1,-1,-1,1,1,-1,1,1,1,1,-1,-1,1,1,1,1,-1,1,-1,-1,-1,-1,-1,1,-1,1,1,-1,-1,-1,-1,1,1,-1,1,-1]);normals=new Float32Array([...Array(6).fill([0,0,1]).flat(),...Array(6).fill([0,0,-1]).flat(),...Array(6).fill([0,1,0]).flat(),...Array(6).fill([0,-1,0]).flat(),...Array(6).fill([1,0,0]).flat(),...Array(6).fill([-1,0,0]).flat()]);texcoords=new Float32Array([...Array(6).fill([0,1,1,1,1,0,0,1,1,0,0,0]).flat()]);colors=null;vertexCount=36;inputColors;colorMode;constructor(e){e.colors&&e.colors.length!==0?this.inputColors=e.colors:this.inputColors=[[1,1,1,1]],this.colorMode=e.colormode||"face",this.genCubeColors()}genCubeColors(){let e=0;this.colorMode==="vertex"?e=1:this.colorMode==="triangle"?e=3:this.colorMode==="face"&&(e=6);const i=[],s=this.inputColors.length;for(let r=0;r<this.vertexCount;++r){const t=Math.floor(r/e)%s,n=this.inputColors[t];i.push(n)}this.colors=new Float32Array(i.flat())}}class H extends X{positions=new Float32Array([-1,-1,1,1,-1,1,1,1,1,-1,-1,1,1,1,1,-1,1,1,-1,-1,0,-1,1,0,1,1,0,-1,-1,0,1,1,0,1,-1,0,-1,1,0,-1,1,1,1,1,1,-1,1,0,1,1,1,1,1,0,-1,-1,0,1,-1,0,1,-1,1,-1,-1,0,1,-1,1,-1,-1,1,1,-1,0,1,1,0,1,1,1,1,-1,0,1,1,1,1,-1,1,-1,-1,0,-1,-1,1,-1,1,1,-1,-1,0,-1,1,1,-1,1,0]);normals=new Float32Array([...Array(6).fill([0,0,1]).flat(),...Array(6).fill([0,0,-1]).flat(),...Array(6).fill([0,1,0]).flat(),...Array(6).fill([0,-1,0]).flat(),...Array(6).fill([1,0,0]).flat(),...Array(6).fill([-1,0,0]).flat()]);texcoords=new Float32Array([...Array(6).fill([0,1,1,1,1,0,0,1,1,0,0,0]).flat()]);constructor(e){super(e)}}class ${#t=Math.PI/3;#e=1;#r=.1;#s=1e10;constructor(e,i,s,r){this.#t=e,this.#e=i,this.#r=s,this.#s=r}get perspectiveMatrix(){return S(x(),this.#t,this.#e,this.#r,this.#s)}get perspectiveMatrixZO(){return S(x(),this.#t,this.#e,this.#r,this.#s)}get fovy(){return this.#t}get fovx(){const e=this.#t/2,i=Math.tan(e);return 2*Math.atan(i*this.aspect)}get near(){return this.#r}get far(){return this.#s}set aspect(e){this.#e!==e&&(this.#e=e)}get aspect(){return this.#e}}function J(o){let e="clear";return o.first?e="clear":e="load",{label:o.label,colorAttachments:[{clearValue:o.clearColor,loadOp:e,storeOp:"store",view:o.colorTexture}],depthStencilAttachment:{view:o.depthTexture,depthClearValue:o.clearDepth,depthLoadOp:e,depthStoreOp:"store"}}}function K(o,e,i){return o.device.createTexture({label:"depthTexture",size:[e,i],format:"depth24plus",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.COPY_DST})}const j=`\r
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
}`;class Q{label="SimpleLineProgram";gpuinfo;canvasinfo;mode;definition;module=null;pipeline=null;vertexBuffer=null;sceneUniform=null;sceneBindGroupLayout=null;vertexCount=0;constructor(e){this.gpuinfo=e.gpuinfo,this.canvasinfo=e.canvasinfo,this.mode=e.mode,this.definition=M(j),this.initWebGPU()}setData(e){const{positions:i,colors:s}=e;this.vertexCount=i.length/3;const r=T(this.gpuinfo.device,{position:{data:i,numComponents:3},colors:{data:s,numComponents:4}},{interleave:!0}).buffers[0];if(this.vertexBuffer){const t=this.vertexBuffer;this.vertexBuffer=r,t.destroy()}else this.vertexBuffer=r}refreshUniform(e,i){const s=this.gpuinfo.device,r=B(this.definition.uniforms.scene);this.sceneUniform||(this.sceneUniform=s.createBuffer({label:this.label,size:r.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST})),r.set({viewmtx:e.viewMtx,projmtx:i.perspectiveMatrixZO}),s.queue.writeBuffer(this.sceneUniform,0,r.arrayBuffer)}initWebGPU(){this.module=this.gpuinfo.device.createShaderModule({label:this.label,code:j}),this.sceneBindGroupLayout=this.gpuinfo.device.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]});const e=this.gpuinfo.device.createPipelineLayout({bindGroupLayouts:[this.sceneBindGroupLayout]});this.pipeline=this.gpuinfo.device.createRenderPipeline({label:this.label,layout:e,vertex:{module:this.module,buffers:[{arrayStride:28,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32x4"}],stepMode:"vertex"}]},fragment:{module:this.module,targets:[{format:this.canvasinfo.context.getConfiguration().format}]},primitive:{topology:this.mode,cullMode:"none"},depthStencil:{format:"depth24plus",depthWriteEnabled:!0,depthCompare:"less"}})}draw(e,i,s){this.refreshUniform(e,i);const r=this.gpuinfo.device.createBindGroup({layout:this.sceneBindGroupLayout,entries:[{binding:0,resource:{buffer:this.sceneUniform}}]});s.setPipeline(this.pipeline),s.setBindGroup(0,r),s.setVertexBuffer(0,this.vertexBuffer),s.draw(this.vertexCount)}}class ee{#t;#e;#r;#s;#a;#o;#u;#l;#h;#p;#f;#c;shaderDefinition=null;module=null;pipeline=null;vertexBuffer=null;indexBuffer=null;sceneUniform=null;frustumUniform=null;callbacks=[];constructor(e){this.#t=e.eye,this.#e=e.target,this.#r=e.near,this.#s=e.far,this.#a=e.aspect,this.#o=e.fovy,this.#u=e.up,this.#l=new H({colors:[g.cyan,g.magenta,g.neonGreen,g.electricBlue,g.hotPink,g.sand],colormode:"face"}),this.#i()}set eye(e){this.#t=e,this.#i(),this.#n()}get eye(){return this.#t}set target(e){this.#e=e,this.#i(),this.#n()}get target(){return this.#e}set up(e){this.#u=e,this.#i(),this.#n(),console.log(this.#u)}get up(){return this.#u}set near(e){this.#r=e,this.#i(),this.#n()}get near(){return this.#r}set far(e){this.#s=e,this.#i(),this.#n()}get far(){return this.#s}set aspect(e){this.#a=e,this.#i(),this.#n()}get aspect(){return this.#a}set fovy(e){this.#o=e,this.#i(),this.#n()}get fovy(){return this.#o}addChangeCallbacks(e){this.callbacks.push(e)}#n(){for(const e of this.callbacks)e(this)}#i(){const e=S(x(),this.#o,this.#a,this.#r,this.#s),i=this.#e,s=R(x(),this.#t,i,this.#u),r=L(x(),e),t=L(x(),s);this.#h=e,this.#p=s,this.#f=r,this.#c=t}computeSightLine(){const e=I(...this.eye),i=I(...this.target),s=I(...this.#u),r=this.near,t=this.far,n=G(a(),E(a(),i,e)),u=G(a(),V(a(),n,s)),h=G(a(),V(a(),n,u)),p=f(a(),n,r),m=c(a(),e,p),l=Math.tan(this.#o/2)*r,d=this.#a*l;let F=c(a(),m,f(a(),u,d));F=c(a(),F,f(a(),h,l));let D=c(a(),m,f(a(),u,-d));D=c(a(),D,f(a(),h,l));let A=c(a(),m,f(a(),u,d));A=c(a(),A,f(a(),h,-l));let O=c(a(),m,f(a(),u,-d));O=c(a(),O,f(a(),h,-l));const z=f(a(),n,t),v=c(a(),e,z),y=Math.tan(this.#o/2)*t,b=this.#a*y;let U=c(a(),v,f(a(),u,b));U=c(a(),U,f(a(),h,y));let w=c(a(),v,f(a(),u,-b));w=c(a(),w,f(a(),h,y));let P=c(a(),v,f(a(),u,b));P=c(a(),P,f(a(),h,-y));let C=c(a(),v,f(a(),u,-b));return C=c(a(),C,f(a(),h,-y)),new Float32Array([...e,...v,...e,...U,...e,...w,...e,...P,...e,...C])}refreshVertexBuffer(e){this.vertexBuffer||(this.vertexBuffer=T(e,{position:{data:this.#l.positions,numComponents:3},color:{data:this.#l.colors,numComponents:4}}))}refreshUniform(e,i,s){const r="Frustum",t=B(this.shaderDefinition.uniforms.frustum);this.frustumUniform||(this.frustumUniform=e.createBuffer({label:r,size:t.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST})),t.set({viewmtxInv:this.#c,projmtxInv:this.#f}),e.queue.writeBuffer(this.frustumUniform,0,t.arrayBuffer);const n=B(this.shaderDefinition.uniforms.scene);this.sceneUniform||(this.sceneUniform=e.createBuffer({label:r,size:n.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST})),n.set({viewmtx:i.viewMtx,projmtx:s.perspectiveMatrixZO}),e.queue.writeBuffer(this.sceneUniform,0,n.arrayBuffer)}initWebGPU(e,i,s,r){const t=e.device,n=`

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
        
        `,u="Frustum";this.shaderDefinition=M(n),this.refreshVertexBuffer(t),this.refreshUniform(t,s,r),this.module=t.createShaderModule({label:u,code:n}),this.pipeline=t.createRenderPipeline({label:u,layout:"auto",vertex:{module:this.module,buffers:this.vertexBuffer.bufferLayouts},fragment:{module:this.module,targets:[{format:i.context.getConfiguration().format,blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}},writeMask:GPUColorWrite.ALL}]},primitive:{topology:"triangle-list",cullMode:"none",frontFace:"ccw"},depthStencil:{format:"depth24plus",depthWriteEnabled:!1,depthCompare:"less"}})}draw(e,i,s,r){const t=e.device;this.refreshVertexBuffer(t),this.refreshUniform(t,i,s);const n=t.createBindGroup({label:"Frustum",layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this.frustumUniform}},{binding:1,resource:{buffer:this.sceneUniform}}]});r.setPipeline(this.pipeline),r.setBindGroup(0,n),r.setVertexBuffer(0,this.vertexBuffer.buffers[0]),r.draw(this.#l.vertexCount)}}class te{gpuInfo=null;canvasInfo=null;colorTexture=null;depthTexture=null;camera=null;projection=null;cameraMouseCtrl=null;firstpass=!0;ready=!1;resizeObserver=null;ground=new Z(1e3,1e3);frustum=null;simpleLineProgram=null;pane;paneParams={frustum:{eye:{x:-20,y:20,z:400},target:{x:-20,y:20,z:10},up:{x:0,y:1,z:0},near:100,far:300,aspect:1.5,fovy:Math.PI/4}};constructor(){N().then(e=>{if(e===null){console.error("GPU INFO is NULL");return}this.gpuInfo=e;const s=k({canvasId:"webgpu-canvas",config:{device:e.device,format:e.gpu.getPreferredCanvasFormat()}});if(s===null){console.error("canvasInfo is NULL");return}this.canvasInfo=s;const r=this.canvasInfo.canvas.width,t=this.canvasInfo.canvas.height;this.canvasInfo=s,this.refreshDepthTexture(),this.camera=new _([-500,500,500,1],[0,0,0,1],[0,0,1,0]),this.projection=new $(Math.PI/2,r/t,1,1e4),this.cameraMouseCtrl=new W(this.camera,this.canvasInfo.canvas),this.cameraMouseCtrl.enable(),this.ground.initWebGPU(this.gpuInfo,this.canvasInfo),this.frustum=new ee({eye:Object.values(this.paneParams.frustum.eye),target:Object.values(this.paneParams.frustum.target),up:Object.values(this.paneParams.frustum.up),near:this.paneParams.frustum.near,far:this.paneParams.frustum.far,aspect:this.paneParams.frustum.aspect,fovy:this.paneParams.frustum.fovy}),this.frustum.initWebGPU(this.gpuInfo,this.canvasInfo,this.camera,this.projection),this.simpleLineProgram=new Q({gpuinfo:this.gpuInfo,canvasinfo:this.canvasInfo,mode:"line-list"});const n=u=>{const h=u.computeSightLine(),p=h.length/3,m=new Float32Array([...Array(p).fill(g.red).flat()]);this.simpleLineProgram.setData({positions:h,colors:m})};n(this.frustum),this.frustum.addChangeCallbacks(n),this.resizeObserver=new ResizeObserver(u=>{for(const h of u){const p=h.target,m=h.contentBoxSize[0].inlineSize,l=h.contentBoxSize[0].blockSize;p.width=Math.max(1,Math.min(m,this.gpuInfo.device.limits.maxTextureDimension2D)),p.height=Math.max(1,Math.min(l,this.gpuInfo.device.limits.maxTextureDimension2D)),this.projection.aspect=p.width/p.height,this.refreshDepthTexture()}}),this.resizeObserver.observe(s.canvas),this.pane=new q({title:"参数控制",expanded:!0}),this.setPane(),this.ready=!0}).catch(e=>{this.ready=!1,console.error(e)})}refreshDepthTexture(){const e=K(this.gpuInfo,this.canvasInfo.canvas.width,this.canvasInfo.canvas.height);return this.depthTexture&&this.depthTexture.destroy(),this.depthTexture=e,this.depthTexture}getRenderPassDescriptor(){let e=null;if(this.ready){if(!this.depthTexture)return null;e=J({label:"demo",first:this.firstpass,colorTexture:this.canvasInfo.context.getCurrentTexture().createView(),depthTexture:this.depthTexture,clearColor:[0,0,0,1],clearDepth:1})}return e}render(){if(this.ready){const e=this.gpuInfo.device.createCommandEncoder();this.firstpass=!0;const i=e.beginRenderPass(this.getRenderPassDescriptor());this.firstpass=!1,this.ground.draw(this.gpuInfo,this.camera,this.projection,i),this.frustum.draw(this.gpuInfo,this.camera,this.projection,i),this.simpleLineProgram.draw(this.camera,this.projection,i),i.end();const s=e.finish();this.gpuInfo.device.queue.submit([s])}requestAnimationFrame(this.render.bind(this))}draw(){requestAnimationFrame(this.render.bind(this))}setPane(){const e=this.pane.addFolder({title:"视锥体位置姿态",expanded:!0}),i=e.addFolder({title:"eye",expanded:!1});i.addBinding(this.paneParams.frustum.eye,"x",{min:-1e3,max:1e3,step:.1,label:"x"}).on("change",t=>{const n=this.frustum.eye;n[0]=t.value,this.frustum.eye=n}),i.addBinding(this.paneParams.frustum.eye,"y",{min:-1e3,max:1e3,step:.1,label:"y"}).on("change",t=>{const n=this.frustum.eye;n[1]=t.value,this.frustum.eye=n}),i.addBinding(this.paneParams.frustum.eye,"z",{min:-1e3,max:1e3,step:.1,label:"z"}).on("change",t=>{const n=this.frustum.eye;n[2]=t.value,this.frustum.eye=n});const s=e.addFolder({title:"target",expanded:!1});s.addBinding(this.paneParams.frustum.target,"x",{min:-1e3,max:1e3,step:.1,label:"x"}).on("change",t=>{const n=this.frustum.target;n[0]=t.value,this.frustum.target=n}),s.addBinding(this.paneParams.frustum.target,"y",{min:-1e3,max:1e3,step:.1,label:"y"}).on("change",t=>{const n=this.frustum.target;n[1]=t.value,this.frustum.target=n}),s.addBinding(this.paneParams.frustum.target,"z",{min:-1e3,max:1e3,step:.1,label:"z"}).on("change",t=>{const n=this.frustum.target;n[2]=t.value,this.frustum.target=n});const r=e.addFolder({title:"up",expanded:!1});r.addBinding(this.paneParams.frustum.up,"x",{min:-1,max:1,step:.01,label:"x"}).on("change",t=>{const n=this.frustum.up;n[0]=t.value,this.frustum.up=n}),r.addBinding(this.paneParams.frustum.up,"y",{min:-1,max:1,step:.01,label:"y"}).on("change",t=>{const n=this.frustum.up;n[1]=t.value,this.frustum.up=n}),r.addBinding(this.paneParams.frustum.up,"z",{min:-1,max:1,step:.01,label:"z"}).on("change",t=>{const n=this.frustum.up;n[2]=t.value,this.frustum.up=n}),e.addBinding(this.paneParams.frustum,"near",{min:1,max:1e3,step:.1,label:"near"}).on("change",t=>{t.value<this.frustum.far&&(this.frustum.near=t.value)}),e.addBinding(this.paneParams.frustum,"far",{min:1,max:1e3,step:.1,label:"far"}).on("change",t=>{t.value>this.frustum.near&&(this.frustum.far=t.value)}),e.addBinding(this.paneParams.frustum,"aspect",{min:.1,max:10,step:.1,label:"aspect"}).on("change",t=>{this.frustum.aspect=t.value}),e.addBinding(this.paneParams.frustum,"fovy",{min:.1,max:Math.PI,step:.1,label:"fovy"}).on("change",t=>{this.frustum.fovy=t.value})}}function re(){new te().draw()}re();
