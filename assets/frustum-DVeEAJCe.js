import{m as D,c as M,a as G}from"./webgpu-utils.module--9rjYVl9.js";import{N as E}from"./objects-BlX18zms.js";import{C as l}from"./color-DsrcJaFb.js";import{D as N,c as g,F as W,w as F,d as w,n as S,s as A,e as t,j as O,h as n,i as s}from"./camera-DSiRDkIj.js";const I=`\r
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
}`;class _{label="SimpleLineProgram";context;mode;definition;module=null;pipeline=null;vertexBuffer=null;sceneUniform=null;sceneBindGroupLayout=null;vertexCount=0;constructor(e){this.context=e.context,this.mode=e.mode,this.definition=D(I),this.initWebGPU()}setData(e){const{positions:u,colors:i}=e;this.vertexCount=u.length/3;const r=M(this.context.device,{position:{data:u,numComponents:3},colors:{data:i,numComponents:4}},{interleave:!0}).buffers[0];if(this.vertexBuffer){const o=this.vertexBuffer;this.vertexBuffer=r,o.destroy()}else this.vertexBuffer=r}refreshUniform(e,u){const i=this.context.device,r=G(this.definition.uniforms.scene);this.sceneUniform||(this.sceneUniform=i.createBuffer({label:this.label,size:r.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST})),r.set({viewmtx:e.viewMtx,projmtx:u.perspectiveMatrixZO}),i.queue.writeBuffer(this.sceneUniform,0,r.arrayBuffer)}initWebGPU(){this.module=this.context.device.createShaderModule({label:this.label,code:I}),this.sceneBindGroupLayout=this.context.device.createBindGroupLayout({label:this.label,entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]});const e=this.context.device.createPipelineLayout({bindGroupLayouts:[this.sceneBindGroupLayout]});this.pipeline=this.context.device.createRenderPipeline({label:this.label,layout:e,vertex:{module:this.module,buffers:[{arrayStride:28,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32x4"}],stepMode:"vertex"}]},fragment:{module:this.module,targets:[{format:this.context.canvas.context.getConfiguration().format}]},primitive:{topology:this.mode,cullMode:"none"},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"}})}draw(e,u,i){this.refreshUniform(e,u);const r=this.context.device.createBindGroup({layout:this.sceneBindGroupLayout,entries:[{binding:0,resource:{buffer:this.sceneUniform}}]});i.setPipeline(this.pipeline),i.setBindGroup(0,r),i.setVertexBuffer(0,this.vertexBuffer),i.draw(this.vertexCount)}}class H{#s;#o;#u;#a;#r;#i;#n;#f;#h;#p;#c;#l;shaderDefinition=null;module=null;pipeline=null;vertexBuffer=null;indexBuffer=null;sceneUniform=null;frustumUniform=null;callbacks=[];constructor(e){this.#s=e.eye,this.#o=e.target,this.#u=e.near,this.#a=e.far,this.#r=e.aspect,this.#i=e.fovy,this.#n=e.up,this.#f=new E({colors:[l.cyan,l.magenta,l.neonGreen,l.electricBlue,l.hotPink,l.sand],colormode:"face"}),this.#e()}set eye(e){this.#s=e,this.#e(),this.#t()}get eye(){return this.#s}set target(e){this.#o=e,this.#e(),this.#t()}get target(){return this.#o}set up(e){this.#n=e,this.#e(),this.#t(),console.log(this.#n)}get up(){return this.#n}set near(e){this.#u=e,this.#e(),this.#t()}get near(){return this.#u}set far(e){this.#a=e,this.#e(),this.#t()}get far(){return this.#a}set aspect(e){this.#r=e,this.#e(),this.#t()}get aspect(){return this.#r}set fovy(e){this.#i=e,this.#e(),this.#t()}get fovy(){return this.#i}addChangeCallbacks(e){this.callbacks.push(e)}#t(){for(const e of this.callbacks)e(this)}#e(){const e=N(g(),this.#i,this.#r,this.#u,this.#a),u=this.#o,i=W(g(),this.#s,u,this.#n),r=F(g(),e),o=F(g(),i);this.#h=e,this.#p=i,this.#c=r,this.#l=o}computeSightLine(){const e=w(...this.eye),u=w(...this.target),i=w(...this.#n),r=this.near,o=this.far,a=S(t(),A(t(),u,e)),f=S(t(),O(t(),a,i)),c=S(t(),O(t(),a,f)),R=n(t(),a,r),d=s(t(),e,R),h=Math.tan(this.#i/2)*r,v=this.#r*h;let V=s(t(),d,n(t(),f,v));V=s(t(),V,n(t(),c,h));let C=s(t(),d,n(t(),f,-v));C=s(t(),C,n(t(),c,h));let L=s(t(),d,n(t(),f,v));L=s(t(),L,n(t(),c,-h));let P=s(t(),d,n(t(),f,-v));P=s(t(),P,n(t(),c,-h));const k=n(t(),a,o),p=s(t(),e,k),m=Math.tan(this.#i/2)*o,x=this.#r*m;let b=s(t(),p,n(t(),f,x));b=s(t(),b,n(t(),c,m));let U=s(t(),p,n(t(),f,-x));U=s(t(),U,n(t(),c,m));let B=s(t(),p,n(t(),f,x));B=s(t(),B,n(t(),c,-m));let y=s(t(),p,n(t(),f,-x));return y=s(t(),y,n(t(),c,-m)),new Float32Array([...e,...p,...e,...b,...e,...U,...e,...B,...e,...y])}refreshVertexBuffer(e){this.vertexBuffer||(this.vertexBuffer=M(e,{position:{data:this.#f.positions,numComponents:3},color:{data:this.#f.colors,numComponents:4}}))}refreshUniform(e,u,i){const r="Frustum",o=G(this.shaderDefinition.uniforms.frustum);this.frustumUniform||(this.frustumUniform=e.createBuffer({label:r,size:o.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST})),o.set({viewmtxInv:this.#l,projmtxInv:this.#c}),e.queue.writeBuffer(this.frustumUniform,0,o.arrayBuffer);const a=G(this.shaderDefinition.uniforms.scene);this.sceneUniform||(this.sceneUniform=e.createBuffer({label:r,size:a.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST})),a.set({viewmtx:u.viewMtx,projmtx:i.perspectiveMatrixZO}),e.queue.writeBuffer(this.sceneUniform,0,a.arrayBuffer)}initWebGPU(e,u,i){const r=e.device,o=`

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
        
        `,a="Frustum";this.shaderDefinition=D(o),this.refreshVertexBuffer(r),this.refreshUniform(r,u,i),this.module=r.createShaderModule({label:a,code:o}),this.pipeline=r.createRenderPipeline({label:a,layout:"auto",vertex:{module:this.module,buffers:this.vertexBuffer.bufferLayouts},fragment:{module:this.module,targets:[{format:e.canvas.context.getConfiguration().format,blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}},writeMask:GPUColorWrite.ALL}]},primitive:{topology:"triangle-list",cullMode:"none",frontFace:"ccw"},depthStencil:{format:"depth32float",depthWriteEnabled:!1,depthCompare:"less"}})}draw(e,u,i,r){const o=e.device;this.refreshVertexBuffer(o),this.refreshUniform(o,u,i);const a=o.createBindGroup({label:"Frustum",layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this.frustumUniform}},{binding:1,resource:{buffer:this.sceneUniform}}]});r.setPipeline(this.pipeline),r.setBindGroup(0,a),r.setVertexBuffer(0,this.vertexBuffer.buffers[0]),r.draw(this.#f.vertexCount)}}export{H as F,_ as S};
