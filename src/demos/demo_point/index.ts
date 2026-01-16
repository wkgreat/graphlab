import { createCanvasGPUInfo, createGPUInfo } from "./webgpuUtils";
import './styles.css'
import { makeShaderDataDefinitions, makeStructuredView } from "webgpu-utils";

async function draw() {

    const code = /*WGSL*/`

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
    `

    const gpuinfo = await createGPUInfo();
    if (gpuinfo === null) {
        console.error("GPU INFO is NULL");
        return;
    }
    const canvasId = 'webgpu-canvas';
    const canvasInfo = createCanvasGPUInfo({
        canvasId: canvasId,
        config: {
            device: gpuinfo.device,
            format: gpuinfo.gpu.getPreferredCanvasFormat()
        }
    });
    if (canvasInfo === null) {
        console.error("canvasInfo is NULL");
        return;
    }

    const device = gpuinfo.device;

    const module = gpuinfo.device.createShaderModule({
        code
    });

    const pipeline = gpuinfo.device.createRenderPipeline({
        layout: 'auto',
        vertex: {
            module,
            buffers: [
                {
                    arrayStride: 2 * 4,
                    attributes: [{ shaderLocation: 0, offset: 0, format: 'float32x2' }],
                    stepMode: 'vertex'
                },
                {
                    arrayStride: 2 * 4,
                    attributes: [{ shaderLocation: 1, offset: 0, format: 'float32x2' }],
                    stepMode: 'instance'
                }
            ]
        },
        fragment: {
            module,
            targets: [
                {
                    format: canvasInfo.context.getConfiguration().format
                }
            ]
        },
        primitive: {
            topology: 'triangle-strip',
            cullMode: 'none'
        }
    })

    const quads = [
        -1, -1,
        1, -1,
        -1, 1,
        1, 1
    ]

    const quadData = new Float32Array(quads);

    const npoints = 100;

    const points = Array(npoints).fill(0).flatMap(p => {
        const x = Math.random() * 2 - 1;
        const y = Math.random() * 2 - 1;
        return [x, y];
    });

    const pointData = new Float32Array(points);

    const quadBuffer = gpuinfo.device.createBuffer({
        size: quadData.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    });
    device.queue.writeBuffer(quadBuffer, 0, quadData.buffer);

    const pointBuffer = gpuinfo.device.createBuffer({
        size: pointData.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    });
    device.queue.writeBuffer(pointBuffer, 0, pointData.buffer);


    const shaderDefs = makeShaderDataDefinitions(code);
    const uniformView = makeStructuredView(shaderDefs.uniforms.viewport);
    const uniform = device.createBuffer({
        size: uniformView.arrayBuffer.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    const bindGroup = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [
            { binding: 0, resource: { buffer: uniform } }
        ]
    });

    function render() {

        const encoder = device.createCommandEncoder();

        uniformView.set({
            width: canvasInfo.canvas.width,
            height: canvasInfo.canvas.height
        });

        device.queue.writeBuffer(uniform, 0, uniformView.arrayBuffer);

        const pass = encoder.beginRenderPass({
            colorAttachments: [
                {
                    clearValue: [0.3, 0.3, 0.3, 1.0],
                    loadOp: 'clear',
                    storeOp: 'store',
                    view: canvasInfo.context.getCurrentTexture().createView()
                }
            ]
        });

        pass.setPipeline(pipeline);
        pass.setBindGroup(0, bindGroup);
        pass.setVertexBuffer(0, quadBuffer);
        pass.setVertexBuffer(1, pointBuffer);
        pass.draw(4, npoints);
        pass.end();

        const commandBuffer = encoder.finish();

        device.queue.submit([commandBuffer]);

        requestAnimationFrame(render);
    }

    const observer = new ResizeObserver(entries => {
        for (const entry of entries) {
            const canvas = entry.target as HTMLCanvasElement;
            const width = entry.contentBoxSize[0].inlineSize;
            const height = entry.contentBoxSize[0].blockSize;

            canvas.width = Math.max(1, Math.min(width, device.limits.maxTextureDimension2D));
            canvas.height = Math.max(1, Math.min(height, device.limits.maxTextureDimension2D));
        }
    });

    observer.observe(canvasInfo.canvas);

    requestAnimationFrame(render);

}


draw();