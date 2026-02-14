import { createBuffersAndAttributesFromArrays, makeShaderDataDefinitions, makeStructuredView, type Arrays, type BuffersAndAttributes, type ShaderDataDefinitions } from "webgpu-utils"
import type { WebGPUContext } from "../webgpuUtils"
import type Scene from "../scene";
import type Mesh from "../mesh/mesh";
import code from "../shader/point.wgsl";

export type NumArrayLike = number[] | Float32Array;

export interface PointLayerProps {
    name?: string;
    points: NumArrayLike;
    pointSizes?: NumArrayLike; // in pixel
    pointColors?: NumArrayLike;
    pointMesh?: Mesh;
}

export class PointLayer {

    name: string = "PointLayer";
    points: NumArrayLike;
    pointSizes?: NumArrayLike;
    pointColors?: NumArrayLike;
    pointMesh?: Mesh;
    scene?: Scene;

    webgpu: {
        context?: WebGPUContext
        definitions?: Record<string, ShaderDataDefinitions>
        modules?: Record<string, GPUShaderModule>
        pipelines?: Record<string, GPURenderPipeline>
        buffers?: Record<string, BuffersAndAttributes>
        uniforms?: Record<string, GPUBuffer>
        textures?: Record<string, GPUTexture>
        sampler?: Record<string, GPUSampler>
        bindgroups?: Record<string, GPUBindGroup>
    } = {
            definitions: {},
            modules: {},
            pipelines: {},
            buffers: {},
            uniforms: {},
            textures: {},
            sampler: {},
            bindgroups: {}
        };

    constructor(props: PointLayerProps) {
        this.name = props.name ?? "PointLayer";
        this.points = props.points;
        this.pointSizes = props.pointSizes;
        this.pointColors = props.pointColors;
        this.pointMesh = props.pointMesh;
    }

    setPointMesh(mesh: Mesh) {
        this.pointMesh = mesh;
        //TODO refresh Vertex Buffer
    }

    initWebGPU(context: WebGPUContext, scene: Scene) {
        this.webgpu.context = context
        this.scene = scene;
    }

    getNumPoints() {
        return this.points.length / 3;
    }

    setPointSizes(sizes: number[]) {
        this.pointSizes = sizes;
        this.refreshVertexBuffers();
    }

    getPointSizes() {
        if (this.pointSizes == null) {
            this.pointSizes = Array(this.getNumPoints()).fill(1);
        }
        return this.pointSizes;
    }

    getPointColors() {
        if (this.pointColors == null) {
            this.pointColors = Array(this.getNumPoints()).fill([1, 0, 0, 1]).flat();
        }
        return this.pointColors;
    }

    getDefinition() {
        if (this.webgpu.definitions.default == null) {
            this.webgpu.definitions.default = makeShaderDataDefinitions(code);
        }
        return this.webgpu.definitions.default;
    }

    refreshVertexBuffers() {

        const device = this.webgpu.context?.device;

        if (device == null) {
            return null;
        }

        const vertexBufferArrays: Arrays = {
            vexposition: { data: this.pointMesh.positions, numComponents: 3, shaderLocation: 0 },
            vexnormal: { data: this.pointMesh.normals, numComponents: 3, shaderLocation: 1 },
            vextexcoord: { data: this.pointMesh.texcoords, numComponents: 3, shaderLocation: 2 },
            vexcolor: { data: this.pointMesh.colors, numComponents: 4, shaderLocation: 3 },
        }

        if (this.pointMesh.vertexIndices != null) {
            vertexBufferArrays.indices = { data: this.pointMesh.vertexIndices, numComponents: 1 }
        }

        this.webgpu.buffers.vertex = createBuffersAndAttributesFromArrays(device, vertexBufferArrays, {
            stepMode: 'vertex',
            shaderLocation: 0,
        });

        const instanceBufferArray: Arrays = {
            insposition: { data: this.points, numComponents: 3, shaderLocation: 4 },
            inscolor: { data: this.getPointColors(), numComponents: 4, shaderLocation: 5 },
            pixelsize: { data: this.getPointSizes(), numComponents: 1, shaderLocation: 6 },
        }

        this.webgpu.buffers.instance = createBuffersAndAttributesFromArrays(device, instanceBufferArray, {
            stepMode: 'instance',
            shaderLocation: 4,
        });
    }

    getVertexBuffers() {
        const device = this.webgpu.context?.device;

        if (device == null) {
            return null;
        }

        if (this.webgpu.buffers.vertex == null || this.webgpu.buffers.instance == null) {
            this.refreshVertexBuffers();
        }

        return this.webgpu.buffers;

    }

    getUniform() {

        const device = this.webgpu.context?.device;
        if (device == null) {
            return null;
        }

        const view = makeStructuredView(this.getDefinition().uniforms.pointUniform);

        if (this.webgpu.uniforms.default == null) {
            this.webgpu.uniforms.default = device.createBuffer({
                label: this.name,
                size: view.arrayBuffer.byteLength,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
            });

            const aabb = this.pointMesh.getAABB();
            const modelmtx = this.pointMesh.modelmtx;

            view.set({
                aabb: {
                    low: aabb.low,
                    high: aabb.high
                },
                modelmtx
            });

            device.queue.writeBuffer(this.webgpu.uniforms.default, 0, view.arrayBuffer);
        }

        return this.webgpu.uniforms.default;

    }

    getPipeline(): GPURenderPipeline {

        const device = this.webgpu.context?.device;

        if (device == null) {
            return null;
        }

        if (this.webgpu.pipelines.default != null) {
            return this.webgpu.pipelines.default;
        }

        const module = device.createShaderModule({
            label: this.name,
            code
        });

        const bindgroupLayout = device.createBindGroupLayout({
            label: this.name,
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                    buffer: { type: 'uniform' }
                }
            ]
        });

        const pipelineLayout = device.createPipelineLayout({
            label: this.name,
            bindGroupLayouts: [
                this.scene.bindGroupLayout,
                bindgroupLayout
            ]
        });

        const buffers = this.getVertexBuffers();

        const pipeline = device.createRenderPipeline({
            label: this.name,
            layout: pipelineLayout,
            vertex: {
                module,
                buffers: [
                    ...buffers.vertex.bufferLayouts,
                    ...buffers.instance.bufferLayouts
                ]
            },
            fragment: {
                module,
                targets: [
                    {
                        format: this.webgpu.context.canvas.context.getConfiguration().format,
                        blend: {
                            color: {
                                operation: 'add',
                                srcFactor: 'src-alpha',
                                dstFactor: 'one-minus-src-alpha',
                            },
                            alpha: {
                                operation: 'add',
                                srcFactor: 'one',
                                dstFactor: 'one-minus-src-alpha',
                            }
                        }
                    }
                ]
            },
            primitive: {
                topology: 'triangle-list',
                cullMode: 'none'
            },
            depthStencil: {
                format: 'depth32float',
                depthWriteEnabled: true,
                depthCompare: 'less-equal'
            }
        });

        this.webgpu.modules.default = module;
        this.webgpu.pipelines.default = pipeline;

        return this.webgpu.pipelines.default;

    }

    getBindGroup() {
        const device = this.webgpu.context?.device;
        if (device == null) {
            return null;
        }
        const pipeline = this.getPipeline();
        if (this.webgpu.bindgroups.default == null) {
            this.webgpu.bindgroups.default = device.createBindGroup({
                label: this.name,
                layout: pipeline.getBindGroupLayout(1),
                entries: [
                    { binding: 0, resource: { buffer: this.getUniform() } }
                ]
            });
        }
        return this.webgpu.bindgroups.default;
    }

    draw(pass: GPURenderPassEncoder) {

        if (this.webgpu.context == null) {
            return;
        }

        pass.setPipeline(this.getPipeline());
        pass.setBindGroup(0, this.scene.bindGroup);
        pass.setBindGroup(1, this.getBindGroup());
        const buffers = this.getVertexBuffers();
        pass.setVertexBuffer(0, buffers.vertex.buffers[0]);
        pass.setVertexBuffer(1, buffers.instance.buffers[0]);
        if (this.pointMesh.vertexIndices != null) {
            pass.setIndexBuffer(buffers.vertex.indexBuffer, buffers.vertex.indexFormat);
            pass.drawIndexed(buffers.vertex.numElements, buffers.instance.numElements);
        } else {
            pass.draw(buffers.vertex.numElements, buffers.instance.numElements);
        }


    }

    destroy() {
        Object.values(this.webgpu.buffers).forEach(ba => {
            ba.buffers.forEach(b => b.destroy());
            ba.indexBuffer?.destroy();
        })
        Object.values(this.webgpu.uniforms).forEach(u => u.destroy());
        Object.values(this.webgpu.textures).forEach(t => t.destroy());
    }

}