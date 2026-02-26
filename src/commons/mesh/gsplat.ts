import { mat3, mat4, quat, vec4 } from "gl-matrix";
import type PLYMeshData from "../format/ply/plyformat";
import type Scene from "../scene";
import type { WebGPUContext } from "../webgpuUtils";
import { createBuffersAndAttributesFromArrays, makeShaderDataDefinitions, makeStructuredView, type BuffersAndAttributes, type ShaderDataDefinitions } from "webgpu-utils";
import shaderCode from "../shader/3dgs.wgsl";

export default class GaussianSplat {

    name: string = "GaussianSplat";

    splatCount: number = 0;

    // 外包矩形顶点位置 //vertex
    vertpos: Float32Array
    // 椭球位置 // instance
    splatpos?: Float32Array

    splatbuffer?: ArrayBuffer
    bufferLength = 0

    static bufferStride = 4 * (4 + 4 + 16 + 4 * 16);
    static centerOffset = 0
    static opacityOffset = 4 * 4
    static sigma3dOffset = 4 * (4 + 4)
    static shcolorOffset = 4 * (4 + 4 + 16)

    modelmtx: mat4 = mat4.create();

    webgpu: {
        scene?: Scene
        context?: WebGPUContext
        definition?: ShaderDataDefinitions
        vertexBuffers?: Record<string, BuffersAndAttributes>
        uniformBuffers?: Record<string, GPUBuffer>
        storageBuffers?: Record<string, GPUBuffer>
        module?: GPUShaderModule
        pipeline?: GPURenderPipeline
        bindGroupLayouts?: Record<string, GPUBindGroupLayout>
        bindGroups?: Record<string, GPUBindGroup>
    } = {
            vertexBuffers: {},
            uniformBuffers: {},
            storageBuffers: {},
            bindGroupLayouts: {},
            bindGroups: {}
        }

    constructor() {
        this.vertpos = new Float32Array([
            0, 0, 0, 1,
            0, 0, 0, 1,
            0, 0, 0, 1,
            0, 0, 0, 1,
            0, 0, 0, 1,
            0, 0, 0, 1
        ]);
    }

    static makeSplatStructuredView(buffer: ArrayBuffer, i: number) {
        const center = new Float32Array(
            buffer,
            i * GaussianSplat.bufferStride + GaussianSplat.centerOffset,
            4
        );

        const opacity = new Float32Array(
            buffer,
            i * GaussianSplat.bufferStride + GaussianSplat.opacityOffset,
            4
        );

        const sigma3d = new Float32Array(
            buffer,
            i * GaussianSplat.bufferStride + GaussianSplat.sigma3dOffset,
            16
        );

        const shcolor = new Float32Array(
            buffer,
            i * GaussianSplat.bufferStride + GaussianSplat.shcolorOffset,
            64
        );

        return {
            center,
            opacity,
            sigma3d,
            shcolor
        };
    }

    static fromPLY(ply: PLYMeshData, modelmtx: mat4 = mat4.create()): GaussianSplat | null {

        const count = ply.elements["vertex"].count;
        const bufferLength = GaussianSplat.bufferStride * count;
        const splatBuffer = new ArrayBuffer(bufferLength);

        const xData = ply.elements["vertex"].properties["x"].data;
        const yData = ply.elements["vertex"].properties["y"].data;
        const zData = ply.elements["vertex"].properties["z"].data;
        const opacityData = ply.elements["vertex"].properties["opacity"].data;
        const scale0Data = ply.elements["vertex"].properties["scale_0"].data;
        const scale1Data = ply.elements["vertex"].properties["scale_1"].data;
        const scale2Data = ply.elements["vertex"].properties["scale_2"].data;
        const rot0Data = ply.elements["vertex"].properties["rot_0"].data;
        const rot1Data = ply.elements["vertex"].properties["rot_1"].data;
        const rot2Data = ply.elements["vertex"].properties["rot_2"].data;
        const rot3Data = ply.elements["vertex"].properties["rot_3"].data;

        const splatpos = new Float32Array(count * 4);

        for (let i = 0; i < count; i++) {

            const view = GaussianSplat.makeSplatStructuredView(splatBuffer, i);

            // center
            splatpos[i * 4] = xData[i];
            splatpos[i * 4 + 1] = yData[i];
            splatpos[i * 4 + 2] = zData[i];
            splatpos[i * 4 + 3] = 1;

            view.center.set([
                xData[i],
                yData[i],
                zData[i],
                1
            ]);

            //opacity
            const opacity = 1 / (1 + Math.exp(-opacityData[i]))
            view.opacity.set([opacity]);

            //sigma3d
            const S = mat3.fromValues(
                Math.exp(scale0Data[i]), 0, 0,
                0, Math.exp(scale1Data[i]), 0,
                0, 0, Math.exp(scale2Data[i])
            );

            const Q = quat.fromValues(rot1Data[i], rot2Data[i], rot3Data[i], rot0Data[i]);
            quat.normalize(Q, Q);
            const R = mat3.fromQuat(mat3.create(), Q);
            const ST = mat3.transpose(mat3.create(), S);
            const RT = mat3.transpose(mat3.create(), R);

            const M = mat3.create();
            mat3.mul(M, M, R);
            mat3.mul(M, M, S);
            mat3.mul(M, M, ST);
            mat3.mul(M, M, RT);

            const M4 = [
                M[0], M[1], M[2], 0,
                M[3], M[4], M[5], 0,
                M[6], M[7], M[8], 0,
                0, 0, 0, 1
            ]
            view.sigma3d.set(M4);

            const shcolorView = view.shcolor;
            shcolorView[0] = ply.elements["vertex"].properties["f_dc_0"].data[i];
            shcolorView[1] = ply.elements["vertex"].properties["f_dc_1"].data[i];
            shcolorView[2] = ply.elements["vertex"].properties["f_dc_2"].data[i];
            for (let c = 0; c < 15; c++) {
                shcolorView[4 + c * 4] = ply.elements["vertex"].properties[`f_rest_${c}`].data[i];
                shcolorView[4 + c * 4 + 1] = ply.elements["vertex"].properties[`f_rest_${c + 15}`].data[i];
                shcolorView[4 + c * 4 + 2] = ply.elements["vertex"].properties[`f_rest_${c + 30}`].data[i];
            }
        }

        const splat = new GaussianSplat();
        splat.splatCount = count;
        splat.splatpos = splatpos;

        splat.splatbuffer = splatBuffer;
        splat.bufferLength = bufferLength;

        splat.modelmtx = modelmtx;

        return splat;
    }

    initWebGPU(context: WebGPUContext, scene: Scene) {
        this.webgpu.context = context;
        this.webgpu.scene = scene;
    }

    getDefinition() {
        if (this.webgpu.definition == null) {
            this.webgpu.definition = makeShaderDataDefinitions(shaderCode);
        }
        return this.webgpu.definition;
    }

    getVertexBuffers() {
        const device = this.webgpu.context.device;
        if (device == null) {
            return null;
        }
        if (this.webgpu.vertexBuffers.vertex == null) {
            this.webgpu.vertexBuffers.vertex = createBuffersAndAttributesFromArrays(
                device,
                { vertpos: { data: this.vertpos, numComponents: 4 } },
                { stepMode: 'vertex', shaderLocation: 0 }
            );
        }
        return this.webgpu.vertexBuffers;
    }

    getUniformBuffers() {
        const device = this.webgpu.context.device;
        if (device == null) {
            return null;
        }
        const view = makeStructuredView(this.getDefinition().uniforms.splatUniform);
        if (this.webgpu.uniformBuffers.default == null) {
            this.webgpu.uniformBuffers.default = device.createBuffer({
                label: `${this.name} uniform`,
                size: view.arrayBuffer.byteLength,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
            });
        }
        view.set({
            modelmtx: this.modelmtx
        })
        device.queue.writeBuffer(this.webgpu.uniformBuffers.default, 0, view.arrayBuffer);
        return this.webgpu.uniformBuffers;
    }

    getStorageBuffers() {
        const device = this.webgpu.context.device;
        if (device == null) {
            return null;
        }
        if (this.webgpu.storageBuffers.default == null) {
            this.webgpu.storageBuffers.default = device.createBuffer({
                label: `${this.name} splatcolor storage buffer`,
                size: this.bufferLength,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
            });
            device.queue.writeBuffer(this.webgpu.storageBuffers.default, 0, this.splatbuffer);
        }

        const indexData = this.sortSplat();

        if (this.webgpu.storageBuffers.index == null) {
            this.webgpu.storageBuffers.index = device.createBuffer({
                label: `${this.name} index storage buffer`,
                size: indexData.byteLength,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
            });
        }
        //dynamic
        device.queue.writeBuffer(this.webgpu.storageBuffers.index, 0, indexData.buffer);

        return this.webgpu.storageBuffers;
    }

    getPipeline() {
        const device = this.webgpu.context.device;
        if (device == null) {
            return null;
        }

        const buffer = this.getVertexBuffers();

        if (this.webgpu.module == null) {
            this.webgpu.module = device.createShaderModule({
                label: `${this.name} module`,
                code: shaderCode
            });
        }

        const pipelineLayout = device.createPipelineLayout({
            bindGroupLayouts: [
                this.webgpu.scene.bindGroupLayout,
                this.getBindGroupLayouts().default
            ]
        });

        if (this.webgpu.pipeline == null) {
            this.webgpu.pipeline = device.createRenderPipeline({
                label: `${this.name} pipeline`,
                layout: pipelineLayout,
                vertex: {
                    module: this.webgpu.module,
                    buffers: [
                        ...buffer.vertex.bufferLayouts
                    ]
                },
                fragment: {
                    module: this.webgpu.module,
                    targets: [
                        {
                            format: this.webgpu.context.canvas.context.getConfiguration().format,
                            blend: {
                                color: {
                                    srcFactor: 'one', // 注意这里变成了 one
                                    dstFactor: 'one-minus-src-alpha',
                                    operation: 'add',
                                },
                                alpha: {
                                    srcFactor: 'one',
                                    dstFactor: 'one-minus-src-alpha',
                                    operation: 'add',
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
                    depthWriteEnabled: false,
                    format: 'depth32float',
                    depthCompare: 'less-equal'
                }
            });
        }

        return this.webgpu.pipeline;
    }

    getBindGroupLayouts() {
        const device = this.webgpu.context.device;
        if (device == null) {
            return null;
        }
        if (this.webgpu.bindGroupLayouts.default == null) {
            this.webgpu.bindGroupLayouts.default = device.createBindGroupLayout({
                entries: [
                    {
                        binding: 0,
                        visibility: GPUShaderStage.VERTEX,
                        buffer: {
                            type: 'read-only-storage'
                        }
                    },
                    {
                        binding: 1,
                        visibility: GPUShaderStage.VERTEX,
                        buffer: {
                            type: 'read-only-storage'
                        }
                    },
                    {
                        binding: 2,
                        visibility: GPUShaderStage.VERTEX,
                        buffer: {
                            type: 'uniform'
                        }
                    },
                ]
            });
        }
        return this.webgpu.bindGroupLayouts;
    }

    getBindGroups() {
        const device = this.webgpu.context.device;
        if (device == null) {
            return null;
        }
        const bindgroupLayouts = this.getBindGroupLayouts();
        const storageBuffers = this.getStorageBuffers();
        const uniforms = this.getUniformBuffers();
        if (this.webgpu.bindGroups.default == null) {

            this.webgpu.bindGroups.default = device.createBindGroup({
                label: `${this.name} bindgroup`,
                layout: bindgroupLayouts.default,
                entries: [
                    { binding: 0, resource: { buffer: storageBuffers.default } },
                    { binding: 1, resource: { buffer: storageBuffers.index } },
                    { binding: 2, resource: { buffer: uniforms.default } }
                ]
            });
        }

        return this.webgpu.bindGroups;
    }

    sortSplat() {
        //TODO compute shader 排序

        const splats = [];

        for (let i = 0; i < this.splatCount; ++i) {
            splats.push(vec4.fromValues(
                this.splatpos[i * 4],
                this.splatpos[i * 4 + 1],
                this.splatpos[i * 4 + 2],
                1
            ));
        }

        const viewmtx = this.webgpu.scene.camera.matrices.viewMtx;

        const viewdist = splats.map((p, i) => {
            const vp = vec4.transformMat4(vec4.create(), p, this.modelmtx);
            vec4.transformMat4(vp, vp, viewmtx);
            return [i, vp[2]];
        })

        const index = viewdist.sort((a, b) => a[1] - b[1]).map(t => t[0]);

        return new Uint32Array(index);

    }

    draw(pass: GPURenderPassEncoder) {

        const device = this.webgpu.context.device;
        if (device == null) {
            return null;
        }

        const vertexBuffers = this.getVertexBuffers();

        const pipeline = this.getPipeline();
        const bindGroup = this.getBindGroups().default;

        pass.setPipeline(pipeline);
        pass.setBindGroup(0, this.webgpu.scene.bindGroup);
        pass.setBindGroup(1, bindGroup);
        pass.setVertexBuffer(0, vertexBuffers.vertex.buffers[0]);
        pass.draw(6, this.splatCount);

    }

    destroy() {}

}