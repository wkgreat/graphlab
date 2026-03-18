import { mat3, mat4, quat, vec4 } from "gl-matrix";
import { createBuffersAndAttributesFromArrays, makeShaderDataDefinitions, makeStructuredView, type BuffersAndAttributes, type ShaderDataDefinitions } from "webgpu-utils";
import type PLYMeshData from "../format/ply/plyformat";
import type Scene from "../scene";
import indexInitShaderCode from "../shader/3dgsinitindex.wgsl";
import sortShaderCode from "../shader/3dgssort.wgsl";
import computeShaderCode from "../shader/3dgscompute.wgsl";
import shaderCode from "../shader/3dgs.wgsl";
import type { WebGPUContext } from "../webgpuUtils";

interface SplatComputeInfo {
    dispatchSizeX: number,
    workgroupSizeX: number,
    numBatches: number
}

interface SplatSortComputeInfo extends SplatComputeInfo {
    length: number
    byteLength: number
    statgeCount: number,
    stageBuffer: ArrayBuffer,
    stageBufferByteStride: number,
    stageBufferByteLength: number
}

export default class GaussianSplat {

    name: string = "GaussianSplat";

    splatCount: number = 0;

    vertpos: Float32Array // 外包矩形顶点

    splatpos?: Float32Array // 椭球中心位置

    splatbuffer?: ArrayBuffer
    bufferLength = 0

    index?: Uint32Array

    needCompute: boolean = true;

    needSort: boolean = true;

    indexInited: boolean = false;

    modelmtx: mat4 = mat4.create();

    computeInfo?: SplatComputeInfo;
    sortInfo?: SplatSortComputeInfo;

    static bufferInfo = {

        computeInput: {
            stride: 4 * (4 + 4 + 16 + 4 * 16),
            offset: { // bytes
                center: 0,
                opacity: 4 * 4,
                sigma3d: 4 * (4 + 4),
                shcolor: 4 * (4 + 4 + 16)
            },
            length: { // number of elements
                center: 4,
                opacity: 4,
                sigma3d: 16,
                shcolor: 64
            }
        },

        computeOutput: {
            stride: 4 * (4 + 4 + 4 + 4 * 6 + 4 * 6),
            offset: {
                ndspos: 0,
                sigma2d: 4 * 4,
                color: 4 * (4 + 4),
                vertndspos: 4 * (4 + 4 + 4),
                vertndcpos: 4 * (4 + 4 + 4 + 4 * 6),
            },
            length: {
                ndspos: 4,
                sigma2d: 4,
                color: 4,
                vertndspos: 24,
                vertndcpos: 24,
            }
        }
    }

    webgpu: {
        scene?: Scene
        context?: WebGPUContext
        definitions?: Record<string, ShaderDataDefinitions>
        vertexBuffers?: Record<string, BuffersAndAttributes>
        uniformBuffers?: Record<string, GPUBuffer>
        storageBuffers?: Record<string, GPUBuffer>
        modules?: Record<string, GPUShaderModule>
        pipelines?: Record<string, GPURenderPipeline | GPUComputePipeline>
        bindGroupLayouts?: Record<string, GPUBindGroupLayout>
        bindGroups?: Record<string, GPUBindGroup>
    } = {
            definitions: {},
            vertexBuffers: {},
            uniformBuffers: {},
            storageBuffers: {},
            modules: {},
            pipelines: {},
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
            i * GaussianSplat.bufferInfo.computeInput.stride + GaussianSplat.bufferInfo.computeInput.offset.center,
            GaussianSplat.bufferInfo.computeInput.length.center
        );

        const opacity = new Float32Array(
            buffer,
            i * GaussianSplat.bufferInfo.computeInput.stride + GaussianSplat.bufferInfo.computeInput.offset.opacity,
            GaussianSplat.bufferInfo.computeInput.length.opacity
        );

        const sigma3d = new Float32Array(
            buffer,
            i * GaussianSplat.bufferInfo.computeInput.stride + GaussianSplat.bufferInfo.computeInput.offset.sigma3d,
            GaussianSplat.bufferInfo.computeInput.length.sigma3d
        );

        const shcolor = new Float32Array(
            buffer,
            i * GaussianSplat.bufferInfo.computeInput.stride + GaussianSplat.bufferInfo.computeInput.offset.shcolor,
            GaussianSplat.bufferInfo.computeInput.length.shcolor
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
        const bufferLength = GaussianSplat.bufferInfo.computeInput.stride * count;
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
                shcolorView[4 + c * 4] = ply.elements["vertex"].properties[`f_rest_${c}`]?.data[i] ?? 0;
                shcolorView[4 + c * 4 + 1] = ply.elements["vertex"].properties[`f_rest_${c + 15}`]?.data[i] ?? 0;
                shcolorView[4 + c * 4 + 2] = ply.elements["vertex"].properties[`f_rest_${c + 30}`]?.data[i] ?? 0;
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

        this.webgpu.scene.on("change", () => {
            this.needCompute = true;
            this.needSort = true;
        })
    }

    getDefinition() {
        if (this.webgpu.definitions.default == null) {
            this.webgpu.definitions.default = makeShaderDataDefinitions(shaderCode);
        }
        if (this.webgpu.definitions.sort == null) {
            this.webgpu.definitions.sort = makeShaderDataDefinitions(sortShaderCode);
        }
        return this.webgpu.definitions;
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
        if (this.webgpu.uniformBuffers.default == null) {
            const view = makeStructuredView(this.getDefinition().default.uniforms.splatUniform);
            this.webgpu.uniformBuffers.default = device.createBuffer({
                label: `${this.name} uniform`,
                size: view.arrayBuffer.byteLength,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
            });
            view.set({
                modelmtx: this.modelmtx
            })
            device.queue.writeBuffer(this.webgpu.uniformBuffers.default, 0, view.arrayBuffer);
        }

        if (this.webgpu.uniformBuffers.sort == null) {
            const sortInfo = this.getSortComputeInfo();
            this.webgpu.uniformBuffers.sort = device.createBuffer({
                label: `${this.name} uniform`,
                size: sortInfo.stageBufferByteLength,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
            });
            device.queue.writeBuffer(this.webgpu.uniformBuffers.sort, 0, sortInfo.stageBuffer, 0, sortInfo.stageBufferByteLength);
        }

        return this.webgpu.uniformBuffers;
    }

    getStorageBuffers() {
        const device = this.webgpu.context.device;
        if (device == null) {
            return null;
        }

        if (this.webgpu.storageBuffers.computeInput == null) {
            this.webgpu.storageBuffers.computeInput = device.createBuffer({
                label: `${this.name} splatcolor storage computeInput buffer`,
                size: this.bufferLength,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
            });
            device.queue.writeBuffer(this.webgpu.storageBuffers.computeInput, 0, this.splatbuffer);
        }

        if (this.webgpu.storageBuffers.computeOutput == null) {
            this.webgpu.storageBuffers.computeOutput = device.createBuffer({
                label: `${this.name} splatcolor storage computeOuttput buffer`,
                size: GaussianSplat.bufferInfo.computeOutput.stride * this.splatCount,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
            });
            // 不需填入数据，由computeShader计算
        }

        if (this.webgpu.storageBuffers.default == null) {
            this.webgpu.storageBuffers.default = device.createBuffer({
                label: `${this.name} splatcolor storage buffer`,
                size: this.bufferLength,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
            });
            device.queue.writeBuffer(this.webgpu.storageBuffers.default, 0, this.splatbuffer);
        }

        const sortInfo = this.getSortComputeInfo();

        if (this.webgpu.storageBuffers.index == null) {
            this.webgpu.storageBuffers.index = device.createBuffer({
                label: `${this.name} index storage buffer`,
                size: sortInfo.byteLength,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
            });
        }

        return this.webgpu.storageBuffers;
    }

    #getDeviceComputeInfo1D(nTask: number, maxWorkgroupSizeX: number = 128): SplatComputeInfo {
        const maxDispacthSizeX = this.webgpu.context.adapter.limits.maxComputeWorkgroupsPerDimension;
        const workgroupSizeX = Math.min(maxWorkgroupSizeX, this.webgpu.context.adapter.limits.maxComputeWorkgroupSizeX);
        const numWorkgroups = Math.ceil(nTask / workgroupSizeX);
        let numBatches = 1;
        let dispatchSizeX = 0;
        if (numWorkgroups <= maxDispacthSizeX) {
            dispatchSizeX = numWorkgroups;
            numBatches = 1;
        } else {
            dispatchSizeX = numWorkgroups;
            numBatches = Math.ceil(numWorkgroups / maxDispacthSizeX);
        }
        return {
            dispatchSizeX,
            workgroupSizeX,
            numBatches
        }
    }

    #getDeviceComputeInfo(): SplatComputeInfo {

        if (this.computeInfo == null) {

            this.computeInfo = this.#getDeviceComputeInfo1D(this.splatCount);
        }

        return this.computeInfo;

    }

    #createIndexInitPipeline() {
        const device = this.webgpu.context.device;
        if (device == null) {
            return null;
        }

        if (this.webgpu.modules.indexInit == null) {
            this.webgpu.modules.indexInit = device.createShaderModule({
                label: `${this.name} compute index init module`,
                code: indexInitShaderCode
            });
        }

        const pipelineLayout = device.createPipelineLayout({
            bindGroupLayouts: [
                this.getBindGroupLayouts().indexInit
            ]
        });

        if (this.webgpu.pipelines.indexInit == null) {
            const sortInfo = this.getSortComputeInfo();
            this.webgpu.pipelines.indexInit = device.createComputePipeline({
                label: `${this.name} compute index init pipeline`,
                layout: pipelineLayout,
                compute: {
                    module: this.webgpu.modules.indexInit,
                    constants: {
                        workGroupSizeX: sortInfo.workgroupSizeX
                    }
                }
            })
        }
    }

    #createSortPipeline() {
        const device = this.webgpu.context.device;
        if (device == null) {
            return null;
        }

        if (this.webgpu.modules.sort == null) {
            this.webgpu.modules.sort = device.createShaderModule({
                label: `${this.name} compute sort module`,
                code: sortShaderCode
            });
        }

        const pipelineLayout = device.createPipelineLayout({
            bindGroupLayouts: [
                this.getBindGroupLayouts().sort
            ]
        });

        if (this.webgpu.pipelines.sort == null) {
            const sortInfo = this.getSortComputeInfo();
            this.webgpu.pipelines.sort = device.createComputePipeline({
                label: `${this.name} compute sort pipeline`,
                layout: pipelineLayout,
                compute: {
                    module: this.webgpu.modules.sort,
                    constants: {
                        workGroupSizeX: sortInfo.workgroupSizeX
                    }
                }
            })
        }
    }

    #createComputePipeline() {

        const device = this.webgpu.context.device;
        if (device == null) {
            return null;
        }

        if (this.webgpu.modules.compute == null) {
            this.webgpu.modules.compute = device.createShaderModule({
                label: `${this.name} compute module`,
                code: computeShaderCode
            });
        }

        const pipelineLayout = device.createPipelineLayout({
            bindGroupLayouts: [
                this.webgpu.scene.bindGroupLayout,
                this.getBindGroupLayouts().compute
            ]
        });

        if (this.webgpu.pipelines.compute == null) {
            const computeInfo = this.#getDeviceComputeInfo();
            this.webgpu.pipelines.compute = device.createComputePipeline({
                label: `${this.name} compute pipeline`,
                layout: pipelineLayout,
                compute: {
                    module: this.webgpu.modules.compute,
                    constants: {
                        workGroupSizeX: computeInfo.workgroupSizeX
                    }
                }
            })
        }
    }

    #createRenderPipeline() {

        const device = this.webgpu.context.device;
        if (device == null) {
            return null;
        }

        const buffer = this.getVertexBuffers();

        if (this.webgpu.modules.default == null) {
            this.webgpu.modules.default = device.createShaderModule({
                label: `${this.name} render module`,
                code: shaderCode
            });
        }

        const pipelineLayout = device.createPipelineLayout({
            bindGroupLayouts: [
                this.webgpu.scene.bindGroupLayout,
                this.getBindGroupLayouts().default
            ]
        });

        if (this.webgpu.pipelines.default == null) {
            this.webgpu.pipelines.default = device.createRenderPipeline({
                label: `${this.name} pipeline`,
                layout: pipelineLayout,
                vertex: {
                    module: this.webgpu.modules.default,
                    buffers: [
                        ...buffer.vertex.bufferLayouts
                    ]
                },
                fragment: {
                    module: this.webgpu.modules.default,
                    targets: [
                        {
                            format: this.webgpu.context.canvas.context.getConfiguration().format,
                            blend: {
                                color: {
                                    srcFactor: 'one',
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
    }

    getPipelines() {

        this.#createIndexInitPipeline();

        this.#createComputePipeline();

        this.#createSortPipeline();

        this.#createRenderPipeline();

        return this.webgpu.pipelines;
    }

    getBindGroupLayouts() {
        const device = this.webgpu.context.device;
        if (device == null) {
            return null;
        }

        if (this.webgpu.bindGroupLayouts.indexInit == null) {
            this.webgpu.bindGroupLayouts.indexInit = device.createBindGroupLayout({
                entries: [
                    {
                        binding: 0,
                        visibility: GPUShaderStage.COMPUTE,
                        buffer: {
                            type: 'storage'
                        }
                    },
                ]
            });
        }

        if (this.webgpu.bindGroupLayouts.sort == null) {
            this.webgpu.bindGroupLayouts.sort = device.createBindGroupLayout({
                entries: [
                    {
                        binding: 0,
                        visibility: GPUShaderStage.COMPUTE,
                        buffer: {
                            type: 'uniform',
                            hasDynamicOffset: true
                        },
                    },
                    {
                        binding: 1,
                        visibility: GPUShaderStage.COMPUTE,
                        buffer: {
                            type: 'read-only-storage'
                        }
                    },
                    {
                        binding: 2,
                        visibility: GPUShaderStage.COMPUTE,
                        buffer: {
                            type: 'storage'
                        }
                    },
                ]
            });
        }

        if (this.webgpu.bindGroupLayouts.compute == null) {
            this.webgpu.bindGroupLayouts.compute = device.createBindGroupLayout({
                entries: [
                    {
                        binding: 0,
                        visibility: GPUShaderStage.COMPUTE,
                        buffer: {
                            type: 'read-only-storage'
                        }
                    },
                    {
                        binding: 1,
                        visibility: GPUShaderStage.COMPUTE,
                        buffer: {
                            type: 'storage'
                        }
                    },
                    {
                        binding: 2,
                        visibility: GPUShaderStage.COMPUTE,
                        buffer: {
                            type: 'uniform'
                        }
                    }
                ]
            });
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
                    }

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

        //indexInit
        if (this.webgpu.bindGroups.indexInit == null) {
            this.webgpu.bindGroups.indexInit = device.createBindGroup({
                label: `${this.name} compute indexInit bindgroup`,
                layout: bindgroupLayouts.indexInit,
                entries: [
                    { binding: 0, resource: { buffer: storageBuffers.index } }
                ]
            });
        }

        //sort
        if (this.webgpu.bindGroups.sort == null) {

            const sortInfo = this.getSortComputeInfo();

            this.webgpu.bindGroups.sort = device.createBindGroup({
                label: `${this.name} compute sort bindgroup`,
                layout: bindgroupLayouts.sort,
                entries: [
                    { binding: 0, resource: { buffer: uniforms.sort, size: sortInfo.stageBufferByteStride } },
                    { binding: 1, resource: { buffer: storageBuffers.computeOutput } },
                    { binding: 2, resource: { buffer: storageBuffers.index } }
                ]
            });
        }

        //compute
        if (this.webgpu.bindGroups.compute == null) {
            this.webgpu.bindGroups.compute = device.createBindGroup({
                label: `${this.name} compute bindgroup`,
                layout: bindgroupLayouts.compute,
                entries: [
                    { binding: 0, resource: { buffer: storageBuffers.computeInput } },
                    { binding: 1, resource: { buffer: storageBuffers.computeOutput } },
                    { binding: 2, resource: { buffer: uniforms.default } }
                ]
            });
        }

        //render
        if (this.webgpu.bindGroups.default == null) {

            this.webgpu.bindGroups.default = device.createBindGroup({
                label: `${this.name} bindgroup`,
                layout: bindgroupLayouts.default,
                entries: [
                    { binding: 0, resource: { buffer: storageBuffers.computeOutput } },
                    { binding: 1, resource: { buffer: storageBuffers.index } },
                    { binding: 2, resource: { buffer: uniforms.default } }
                ]
            });
        }

        return this.webgpu.bindGroups;
    }

    initIndexGPU(pass: GPUComputePassEncoder) {

        if (!this.indexInited) {
            const device = this.webgpu.context.device;
            if (device == null) {
                return null;
            }
            const pipeline = this.getPipelines().indexInit;
            const bindgroup = this.getBindGroups().indexInit;
            const computeInfo = this.getSortComputeInfo();

            pass.setPipeline(pipeline as GPUComputePipeline);
            pass.setBindGroup(0, bindgroup);
            pass.dispatchWorkgroups(computeInfo.dispatchSizeX);
            this.indexInited = true;
        }

    }

    sortSplatCPU() {
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

        return new Uint32Array(viewdist.sort((a, b) => a[1] - b[1]).map(t => t[0]));
    }

    getSortComputeInfo(): SplatSortComputeInfo {
        if (this.sortInfo == null) {
            const n = Math.pow(2, Math.ceil(Math.log2(this.splatCount)));
            const byteStride = 256; // 256对齐
            const byteLength = byteStride * n
            const computeInfo = this.#getDeviceComputeInfo1D(n);

            let nStages = 0;
            let cursor = 0;

            const buffer = new ArrayBuffer(byteLength);
            const u32view = new Uint32Array(buffer);
            for (let k = 2; k <= n; k <<= 1) {
                for (let j = k >> 1; j > 0; j >>= 1) {
                    u32view[cursor++] = k;
                    u32view[cursor++] = j;
                    u32view[cursor++] = n;
                    cursor += (byteStride / 4 - 3); // 256对齐
                    nStages++;
                }
            }

            this.sortInfo = {
                ...computeInfo,
                length: n,
                byteLength: 4 * n,
                statgeCount: nStages,
                stageBuffer: buffer,
                stageBufferByteStride: 256,
                stageBufferByteLength: 256 * nStages
            }
        }
        return this.sortInfo;
    }

    sortSplatGPU(pass: GPUComputePassEncoder) {
        const device = this.webgpu.context.device;
        if (device == null) {
            return null;
        }

        if (this.needSort) {

            const pipeline = this.getPipelines().sort;
            const bindgroup = this.getBindGroups().sort;
            const sortInfo = this.getSortComputeInfo();

            pass.setPipeline(pipeline as GPUComputePipeline);

            for (let i = 0; i < sortInfo.statgeCount; ++i) {
                pass.setBindGroup(0, bindgroup, [i * sortInfo.stageBufferByteStride]);
                pass.dispatchWorkgroups(sortInfo.dispatchSizeX);
            }

            this.needSort = false;
        }
    }

    sortSplat() {
        const device = this.webgpu.context.device;
        if (device == null) {
            return null;
        }
        if (this.index == null || this.needSort) {
            this.index = this.sortSplatCPU();
            const buffer = this.getStorageBuffers().index;
            device.queue.writeBuffer(buffer, 0, this.index.buffer);
            this.needSort = false;
        }

        return this.index;

    }

    compute(pass: GPUComputePassEncoder) {
        const device = this.webgpu.context.device;
        if (device == null) {
            return null;
        }

        if (this.needCompute) {
            const pipeline = this.getPipelines().compute;
            const bindgroup = this.getBindGroups().compute;
            const computeInfo = this.#getDeviceComputeInfo();

            pass.setPipeline(pipeline as GPUComputePipeline);
            pass.setBindGroup(0, this.webgpu.scene.bindGroup);
            pass.setBindGroup(1, bindgroup);
            pass.dispatchWorkgroups(computeInfo.dispatchSizeX);

            this.needCompute = false;
        }

        this.initIndexGPU(pass);
        this.sortSplatGPU(pass);

    }

    draw(pass: GPURenderPassEncoder) {

        const device = this.webgpu.context.device;
        if (device == null) {
            return null;
        }

        const vertexBuffers = this.getVertexBuffers();

        const pipelines = this.getPipelines();
        const bindGroup = this.getBindGroups().default;

        pass.setPipeline(pipelines.default as GPURenderPipeline);
        pass.setBindGroup(0, this.webgpu.scene.bindGroup);
        pass.setBindGroup(1, bindGroup);
        pass.setVertexBuffer(0, vertexBuffers.vertex.buffers[0]);
        pass.draw(6, this.splatCount);

    }

    destroy() {
        for (const verterBuffer of Object.values(this.webgpu.vertexBuffers)) {
            for (const buffer of verterBuffer.buffers) {
                buffer.destroy();
            }
            if (verterBuffer.indexBuffer) {
                verterBuffer.indexBuffer.destroy();
            }
        }
        this.webgpu.vertexBuffers = {};

        for (const storageBuffer of Object.values(this.webgpu.storageBuffers)) {
            storageBuffer.destroy();
        }
        this.webgpu.storageBuffers = {};

        for (const uniformBuffer of Object.values(this.webgpu.uniformBuffers)) {
            uniformBuffer.destroy();
        }

        this.webgpu.uniformBuffers = {};

    }

}