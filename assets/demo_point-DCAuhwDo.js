import"./modulepreload-polyfill-B5Qt9EMX.js";import{m as U,a as P}from"./webgpu-utils.module-DPkR54bZ.js";async function V(a={}){const e=navigator.gpu,o=await e.requestAdapter();if(o===null)return null;const n=await o?.requestDevice();return n===null?null:{gpu:e,adaptor:o,device:n}}function q(a){const e=document.getElementById(a.canvasId);if(e===null)return null;const o=e.getContext("webgpu");return o===null?null:(o.configure(a.config),{canvas:e,context:o})}async function D(){const a=`

    struct Viewport {
        width: f32,
        height: f32
    };

    @group(0) @binding(0) var<uniform> viewport : Viewport;
    
    struct VSInput {
        @location(0) quadpos: vec2f,
        @location(1) pointpos: vec2f,
    };

    struct VSOutput {
        @builtin(position) quadpos: vec4f,
    };

    @vertex fn vs(input: VSInput) -> VSOutput {
        var output: VSOutput;

        let pos = input.pointpos + input.quadpos / vec2f(viewport.width, viewport.height) * 10;

        output.quadpos = vec4f(pos, 0.5, 1.0);

        return output;

    }
    @fragment fn fs(input: VSOutput) -> @location(0) vec4f {
        return vec4f(1.0,0.0,0.0,1.0);
    }
    `,e=await V();if(e===null){console.error("GPU INFO is NULL");return}const n=q({canvasId:"webgpu-canvas",config:{device:e.device,format:e.gpu.getPreferredCanvasFormat()}});if(n===null){console.error("canvasInfo is NULL");return}const r=e.device,c=e.device.createShaderModule({code:a}),f=e.device.createRenderPipeline({layout:"auto",vertex:{module:c,buffers:[{arrayStride:8,attributes:[{shaderLocation:0,offset:0,format:"float32x2"}],stepMode:"vertex"},{arrayStride:8,attributes:[{shaderLocation:1,offset:0,format:"float32x2"}],stepMode:"instance"}]},fragment:{module:c,targets:[{format:n.context.getConfiguration().format}]},primitive:{topology:"triangle-strip",cullMode:"none"}}),w=[-1,-1,1,-1,-1,1,1,1],d=new Float32Array(w),p=100,B=Array(p).fill(0).flatMap(u=>{const t=Math.random()*2-1,i=Math.random()*2-1;return[t,i]}),l=new Float32Array(B),v=e.device.createBuffer({size:d.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});r.queue.writeBuffer(v,0,d.buffer);const g=e.device.createBuffer({size:l.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});r.queue.writeBuffer(g,0,l.buffer);const b=U(a),s=P(b.uniforms.viewport),m=r.createBuffer({size:s.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),x=r.createBindGroup({layout:f.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:m}}]});function h(){const u=r.createCommandEncoder();s.set({width:n.canvas.width,height:n.canvas.height}),r.queue.writeBuffer(m,0,s.arrayBuffer);const t=u.beginRenderPass({colorAttachments:[{clearValue:[.3,.3,.3,1],loadOp:"clear",storeOp:"store",view:n.context.getCurrentTexture().createView()}]});t.setPipeline(f),t.setBindGroup(0,x),t.setVertexBuffer(0,v),t.setVertexBuffer(1,g),t.draw(4,p),t.end();const i=u.finish();r.queue.submit([i]),requestAnimationFrame(h)}new ResizeObserver(u=>{for(const t of u){const i=t.target,y=t.contentBoxSize[0].inlineSize,S=t.contentBoxSize[0].blockSize;i.width=Math.max(1,Math.min(y,r.limits.maxTextureDimension2D)),i.height=Math.max(1,Math.min(S,r.limits.maxTextureDimension2D))}}).observe(n.canvas),requestAnimationFrame(h)}D();
