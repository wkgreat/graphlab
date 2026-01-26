import { createBuffersAndAttributesFromArrays, makeShaderDataDefinitions, makeStructuredView, type ShaderDataDefinitions } from 'webgpu-utils';
import type { CanvasGPUInfo, GPUInfo } from '../webgpuUtils';
import code from './simpleline.wgsl?raw'
import type Camera from '../camera';
import type Projection from '../projection';

export interface SimpleLineProgramOptions {
    gpuinfo: GPUInfo,
    canvasinfo: CanvasGPUInfo,
    mode: 'line-list' | 'line-strip'
}

export interface SimpleLineProgramData {
    positions: Float32Array
    colors: Float32Array
}

export default class SimpleLineProgram {

    label = "SimpleLineProgram";
    gpuinfo: GPUInfo;
    canvasinfo: CanvasGPUInfo;
    mode: 'line-list' | 'line-strip'
    definition: ShaderDataDefinitions;
    module: GPUShaderModule | null = null;
    pipeline: GPURenderPipeline | null = null;
    vertexBuffer: GPUBuffer | null = null;
    sceneUniform: GPUBuffer | null = null;
    sceneBindGroupLayout: GPUBindGroupLayout | null = null;
    vertexCount: number = 0;

    constructor(options: SimpleLineProgramOptions) {
        this.gpuinfo = options.gpuinfo
        this.canvasinfo = options.canvasinfo;
        this.mode = options.mode;
        this.definition = makeShaderDataDefinitions(code);
        this.initWebGPU();
    }

    setData(data: SimpleLineProgramData) {

        const { positions, colors } = data;

        this.vertexCount = positions.length / 3;

        const vertexBuffer = createBuffersAndAttributesFromArrays(this.gpuinfo.device, {
            position: { data: positions, numComponents: 3 },
            colors: { data: colors, numComponents: 4 }
        }, { interleave: true }).buffers[0];

        if (this.vertexBuffer) {
            const oldVertexBuffer = this.vertexBuffer;
            this.vertexBuffer = vertexBuffer;
            oldVertexBuffer.destroy();
        } else {
            this.vertexBuffer = vertexBuffer;
        }
    }

    refreshUniform(camera: Camera, projection: Projection) {
        const device = this.gpuinfo.device;
        const sceneView = makeStructuredView(this.definition.uniforms.scene);
        if (!this.sceneUniform) {
            this.sceneUniform = device.createBuffer({
                label: this.label,
                size: sceneView.arrayBuffer.byteLength,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
            });
        }
        sceneView.set({
            viewmtx: camera.viewMtx,
            projmtx: projection.perspectiveMatrixZO
        });
        device.queue.writeBuffer(this.sceneUniform, 0, sceneView.arrayBuffer);
    }

    initWebGPU() {
        this.module = this.gpuinfo.device.createShaderModule({
            label: this.label,
            code
        });

        this.sceneBindGroupLayout = this.gpuinfo.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX | GPUShaderStage.VERTEX,
                    buffer: { type: 'uniform' }
                }
            ]
        });

        const pipelineLayout = this.gpuinfo.device.createPipelineLayout({
            bindGroupLayouts: [this.sceneBindGroupLayout]
        });

        this.pipeline = this.gpuinfo.device.createRenderPipeline({
            label: this.label,
            layout: pipelineLayout,
            vertex: {
                module: this.module,
                buffers: [
                    {
                        arrayStride: (3 + 4) * 4, attributes: [
                            { shaderLocation: 0, offset: 0, format: 'float32x3' },
                            { shaderLocation: 1, offset: 3 * 4, format: 'float32x4' }
                        ],
                        stepMode: 'vertex'
                    }
                ]
            },
            fragment: {
                module: this.module,
                targets: [
                    {
                        format: this.canvasinfo.context.getConfiguration()!.format,
                    }
                ]
            },
            primitive: {
                topology: this.mode,
                cullMode: 'none'
            },
            depthStencil: {
                format: 'depth32float',
                depthWriteEnabled: true,
                depthCompare: 'less'
            }
        });
    }


    draw(camera: Camera, projection: Projection, pass: GPURenderPassEncoder) {

        this.refreshUniform(camera, projection);

        const sceneBindGroup = this.gpuinfo.device.createBindGroup({
            layout: this.sceneBindGroupLayout,
            entries: [
                { binding: 0, resource: { buffer: this.sceneUniform } }
            ]
        });

        pass.setPipeline(this.pipeline);
        pass.setBindGroup(0, sceneBindGroup);
        pass.setVertexBuffer(0, this.vertexBuffer);
        pass.draw(this.vertexCount);

    }

}