import { createBuffersAndAttributesFromArrays, type BuffersAndAttributes } from "webgpu-utils"
import type Scene from "../scene"
import code from "../shader/simpleline.wgsl"
import type { CanvasGPUInfo, GPUInfo } from "../webgpuUtils"

export type LineTopology = 'line-strip' | 'line-list'

export interface SimpleLineOptions {
    label?: string
    topology: LineTopology,
    positions: Float32Array,
    colors: Float32Array,
    indices: Uint32Array | null
}

export default class SimpleLine {

    #label: string
    #topology: LineTopology
    #positions: Float32Array
    #colors: Float32Array
    #indices: Uint32Array

    #webgpu: {
        gpuinfo?: GPUInfo
        canvasinfo?: CanvasGPUInfo
        scene?: Scene,
        buffer?: BuffersAndAttributes
        module?: GPUShaderModule
        pipeline?: GPURenderPipeline
    } = {}

    constructor(options: SimpleLineOptions) {
        this.#label = options.label ?? "SimpleLine";
        this.#topology = options.topology;
        this.#positions = options.positions;
        this.#colors = options.colors;
        this.#indices = options.indices;
    }

    get topology() {
        return this.#topology;
    }

    get positions() {
        return this.positions;
    }

    get colors() {
        return this.#colors;
    }

    initWebGPU(gpuinfo: GPUInfo, canvasinfo: CanvasGPUInfo, scene: Scene) {
        this.#webgpu.gpuinfo = gpuinfo;
        this.#webgpu.canvasinfo = canvasinfo;
        this.#webgpu.scene = scene;

        this.refreshUniforms();
        this.refreshVertexBuffers();
        this.createPileline();

    }

    createDefaultColors() {
        const vertexCount = this.positions.length / 3;
        const color = [0, 1, 0, 1];
        this.#colors = new Float32Array(Array(vertexCount).fill(color).flat());
    }

    refreshVertexBuffers(force: boolean = false) {

        if (!this.#webgpu.gpuinfo) {
            return;
        }

        const device = this.#webgpu.gpuinfo.device;

        if (force || !this.#webgpu.buffer) {
            if (!this.colors) {
                this.createDefaultColors();
            }
            const oldBuffer = this.#webgpu.buffer;

            if (this.#indices) {
                const newBuffer = createBuffersAndAttributesFromArrays(device, {
                    position: { data: this.#positions, numComponents: 3 },
                    colors: { data: this.#colors, numComponents: 4 },
                    indices: this.#indices
                });
                this.#webgpu.buffer = newBuffer;
            } else {
                const newBuffer = createBuffersAndAttributesFromArrays(device, {
                    position: { data: this.#positions, numComponents: 3 },
                    colors: { data: this.#colors, numComponents: 4 }
                });
                this.#webgpu.buffer = newBuffer;
            }

            if (oldBuffer) {
                oldBuffer.buffers.forEach(b => b.destroy());
                if (oldBuffer.indexBuffer) {
                    oldBuffer.indexBuffer.destroy();
                }
            }
        }

    }

    refreshUniforms() {
        this.#webgpu.scene.refreshUniform();
    }

    createPileline() {
        const device = this.#webgpu.gpuinfo.device;

        this.#webgpu.module = device.createShaderModule({
            label: this.#label,
            code
        });

        const layout = device.createPipelineLayout({
            bindGroupLayouts: [
                this.#webgpu.scene.bindGroupLayout,
            ]
        });

        const descriptor: GPURenderPipelineDescriptor = {
            label: this.#label,
            layout: layout,
            vertex: {
                module: this.#webgpu.module,
                buffers: this.#webgpu.buffer.bufferLayouts
            },
            fragment: {
                module: this.#webgpu.module,
                targets: [
                    {
                        format: this.#webgpu.canvasinfo.context.getConfiguration().format,
                    }
                ]
            },
            primitive: {
                topology: this.#topology
            },
            depthStencil: {
                format: 'depth32float',
                depthWriteEnabled: true,
                depthCompare: 'less-equal',
            }
        };

        this.#webgpu.pipeline = device.createRenderPipeline(descriptor);
    }

    draw(pass: GPURenderPassEncoder) {

        this.refreshUniforms();
        this.refreshVertexBuffers();

        const scene = this.#webgpu.scene;
        const bufferInfo = this.#webgpu.buffer;
        pass.setPipeline(this.#webgpu.pipeline);
        pass.setBindGroup(0, scene.bindGroup);
        pass.setVertexBuffer(0, bufferInfo.buffers[0]);
        if (this.#indices) {
            pass.setIndexBuffer(bufferInfo.indexBuffer, bufferInfo.indexFormat);
            pass.drawIndexed(bufferInfo.numElements);
        } else {
            pass.draw(this.#positions.length / 3);
        }

    }

    destroy() {
        for (const buffer of this.#webgpu.buffer.buffers) {
            buffer.destroy();
        }
    }

}