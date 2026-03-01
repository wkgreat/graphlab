import"./modulepreload-polyfill-B5Qt9EMX.js";import{m as S,a as P}from"./webgpu-utils.module--9rjYVl9.js";import{r as G}from"./utils-DruZQoW3.js";import{c as w}from"./webgpuUtils-sdOmYmry.js";var b=`const INF_F32:f32 = 1e30;\r
const INF_U32:u32 = 0xffffffffu;

struct SortStage {\r
    k: u32,\r
    j: u32\r
}

@group(0) @binding(0) var<uniform> stage: SortStage;\r
@group(0) @binding(1) var<storage, read_write> numbers: array<u32>;

override workGroupSizeX : u32 = 128u;

@compute \r
@workgroup_size(workGroupSizeX)\r
fn bitonicSort(\r
    @builtin(global_invocation_id) gid : vec3<u32>\r
) {

    let k = stage.k;\r
    let j = stage.j;

    let a = gid.x;\r
    let b = a ^ j;\r
    let va = numbers[a];\r
    let vb = numbers[b];\r
    let asc: bool = (a & k) == 0u;\r
    if(a<b) {\r
        if(asc) {\r
            if(va > vb) {\r
                let t = numbers[a];\r
                numbers[a] = numbers[b];\r
                numbers[b] = t;\r
            }\r
        } else {\r
            if(va < vb) {\r
                let t = numbers[a];\r
                numbers[a] = numbers[b];\r
                numbers[b] = t;\r
            }\r
        }\r
    }

}`;class k{context;ready=!1;readyFuncs=[];constructor(){w().then(t=>{this.context=t,this.ready=!0;for(const i of this.readyFuncs)i()})}onReady(t){this.ready?t():this.readyFuncs.push(t)}}class M{context;device;module;pipeline;stageBuffers=[];numbersBuffer;outputBuffer;bindgroup;constructor(t){this.context=t,this.device=this.context.device}async sort(t){this.module=this.device.createShaderModule({code:b}),this.pipeline=this.device.createComputePipeline({layout:this.device.createPipelineLayout({bindGroupLayouts:[this.device.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform",hasDynamicOffset:!0}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]})]}),compute:{module:this.module,constants:{workGroupSizeX:128}}});const i=t.length,n=Math.pow(2,Math.ceil(Math.log2(i))),s=new Uint32Array(n);for(let e=0;e<n;++e)e<i?s[e]=Math.ceil(t[e]):s[e]=4294967295;const y=S(b),l=P(y.uniforms.stage);this.numbersBuffer=this.device.createBuffer({size:s.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),this.device.queue.writeBuffer(this.numbersBuffer,0,s),this.outputBuffer=this.device.createBuffer({size:s.byteLength,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});const c=this.device.createCommandEncoder(),a=c.beginComputePass(),f=256;let g=0;for(let e=2;e<=n;e<<=1)for(let r=e>>1;r>0;r>>=1)g++;const m=f*g,o=this.device.createBuffer({size:m,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),d=new Uint32Array(m/4);let h=0;for(let e=2;e<=n;e<<=1)for(let r=e>>1;r>0;r>>=1)d[h++]=e,d[h++]=r,h+=f/4-2;this.device.queue.writeBuffer(o,0,d),this.stageBuffers.push(o);let p=0;for(let e=2;e<=n;e<<=1)for(let r=e>>1;r>0;r>>=1){l.set({k:e,j:r}),this.device.queue.writeBuffer(o,0,l.arrayBuffer),this.stageBuffers.push(o);const U=this.device.createBindGroup({layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:o,size:f}},{binding:1,resource:{buffer:this.numbersBuffer}}]});a.setPipeline(this.pipeline),a.setBindGroup(0,U,[p*f]),a.dispatchWorkgroups(Math.ceil(n/128)),p++}a.end(),c.copyBufferToBuffer(this.numbersBuffer,0,this.outputBuffer,0,s.byteLength),this.device.queue.submit([c.finish()]),await this.outputBuffer.mapAsync(GPUMapMode.READ);const B=new Uint32Array(this.outputBuffer.getMappedRange()),v=Array.from(B);return this.outputBuffer.unmap(),v}destroy(){for(const t of this.stageBuffers)t.destroy();this.numbersBuffer.destroy(),this.outputBuffer.destroy()}}function C(){const u=new k;u.onReady(()=>{const i=Array(8).fill(0).map(s=>Math.ceil(G(0,100)));console.log(i);const n=new M(u.context);n.sort(i).then(s=>{console.log(s),n.destroy()})})}C();
