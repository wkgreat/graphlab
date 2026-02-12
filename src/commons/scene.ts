import { mat4, vec3, vec4 } from "gl-matrix";
import type Camera from "./camera";
import type Projection from "./projection";
import { Ray } from "./objects";
import type PointLight from "./light";
import { bool2num, type CanvasGPUInfo, type GPUInfo } from "./webgpuUtils";
import sceneCode from "./shader/scene.wgsl";
import { makeShaderDataDefinitions, makeStructuredView, type ShaderDataDefinitions } from "webgpu-utils";
import { vec4t3 } from "./matrix";
import type IBL from "./ibl";
import type EnvironmentMap from "./envmap";

export default class Scene {

    camera: Camera;
    projection: Projection;
    worldmtx: mat4 = mat4.create();
    #width: number = 0;
    #height: number = 0;
    lights: PointLight[] = [];
    readonly MAX_NUM_LIGHTS = 16;
    ibl?: IBL;

    #webgpu: {
        gpuinfo?: GPUInfo,
        canvasinfo?: CanvasGPUInfo,
        definition?: ShaderDataDefinitions,
        uniform?: GPUBuffer,
        layout?: GPUBindGroupLayout
        bindgroup?: GPUBindGroup
        defaultCubeTexture?: GPUTexture
        defaultCubeSampler?: GPUSampler
        default2DTexture?: GPUTexture
        default2DSampler?: GPUSampler
    } = {};

    constructor(camera: Camera, projection: Projection) {
        this.camera = camera;
        this.projection = projection;
    }

    setWorldMatrix(matrix: mat4) {
        this.worldmtx = matrix;
    }

    addLight(light: PointLight) {
        this.lights.push(light);
    }

    setIBL(ibl: IBL) {
        this.ibl = ibl;
        if (this.#webgpu.gpuinfo != null && ibl.webgpu.gpuinfo == null) {
            ibl.initWebGPU(this.#webgpu.gpuinfo, this.#webgpu.canvasinfo, this);
        }
    }

    canEnv() {
        return this.ibl != null && this.ibl.canEnv();
    }

    canIBL() {
        return this.ibl != null && this.ibl.canIBL();
    }

    getEnv(): EnvironmentMap | null {
        if (this.canEnv()) {
            return this.ibl.environment;
        } else {
            return null;
        }
    }

    refreshViewport(width: number, height: number) {
        this.#width = width;
        this.#height = height;
    }

    get viewportMatrix() {
        const x = 0;
        const y = 0;
        const w2 = this.#width / 2;
        const h2 = this.#height / 2;
        const m = mat4.fromValues(
            w2, 0, 0, 0,
            0, h2, 0, 0,
            0, 0, 1, 0,
            x + w2, y + h2, 0, 1
        );
        return m;
    }

    get viewportMatrixInv() {
        return mat4.invert(mat4.create(), this.viewportMatrix);
    }

    getRayOfPixel(x: number, y: number) {
        y = this.#height - y;
        const m_sreen = this.viewportMatrix;
        const m_proj = this.projection.perspectiveMatrixZO;
        const m_view = this.camera.viewMtx;
        const m_projview = mat4.mul(mat4.create(), m_proj, m_view);
        const im_projview: mat4 = mat4.invert(mat4.create(), m_projview);
        const im_sceen: mat4 = mat4.invert(mat4.create(), m_sreen);

        const sp = vec4.fromValues(x, y, 0, 1);
        const cp = vec4.transformMat4(vec4.create(), sp, im_sceen);
        const wp = vec4.transformMat4(vec4.create(), cp, im_projview);
        const wp3 = vec3.fromValues(wp[0], wp[1], wp[2]);

        const vf3 = vec3.fromValues(this.camera.from[0], this.camera.from[1], this.camera.from[2]);
        const d = vec3.normalize(vec3.create(), vec3.sub(vec3.create(), wp3, vf3));
        const ray = new Ray(vf3, d);
        return ray;
    }

    initWebGPU(gpuinfo: GPUInfo, canvasinfo: CanvasGPUInfo) {
        this.#webgpu.gpuinfo = gpuinfo;
        this.#webgpu.canvasinfo = canvasinfo;
    }

    refreshUniform() {

        if (this.#webgpu.gpuinfo) {
            const device = this.#webgpu.gpuinfo.device;

            if (!this.#webgpu.definition) {
                this.#webgpu.definition = makeShaderDataDefinitions(sceneCode);
            }

            const sceneView = makeStructuredView(this.#webgpu.definition.uniforms.scene);

            if (!this.#webgpu.uniform) {
                this.#webgpu.uniform = device.createBuffer({
                    label: "scene",
                    size: sceneView.arrayBuffer.byteLength,
                    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
                });
            }

            const cameraData = {
                eye: vec4t3(this.camera.from),
                center: vec4t3(this.camera.to),
                up: vec4t3(this.camera.up),
                viewmtx: this.camera.viewMtx,
                viewmtxInv: mat4.invert(mat4.create(), this.camera.viewMtx)
            }

            const projectionData = {
                near: this.projection.near,
                far: this.projection.far,
                fovy: this.projection.fovy,
                aspect: this.projection.aspect,
                projmtx: this.projection.perspectiveMatrixZO,
                projmtxInv: mat4.invert(mat4.create(), this.projection.perspectiveMatrixZO)
            }

            const viewportData = {
                width: this.#width,
                height: this.#height,
                viewportmtx: this.viewportMatrix,
                viewportmtxInv: this.viewportMatrixInv
            }

            const sh = this.getIBLsh();

            const iblData = {
                canIBL: bool2num(this.canIBL()),
                prescaled: bool2num(this.canIBL() && this.ibl.sh.prescale),
                sh: sh
            }

            const nLights = Math.min(this.MAX_NUM_LIGHTS, this.lights.length);
            const lightData = [];
            for (let i = 0; i < nLights; ++i) {
                lightData.push({
                    position: this.lights[i].position,
                    color: this.lights[i].color
                });
            }

            const uniformData = {
                worldmtx: this.worldmtx,
                camera: cameraData,
                projection: projectionData,
                viewport: viewportData,
                ibl: iblData,
                numLights: nLights,
                lights: lightData
            }

            sceneView.set(uniformData);

            device.queue.writeBuffer(this.#webgpu.uniform, 0, sceneView.arrayBuffer);
        }
    }

    get bindGroupLayout() {

        if (this.#webgpu.gpuinfo) {
            const device = this.#webgpu.gpuinfo.device;

            if (!this.#webgpu.layout) {
                this.#webgpu.layout = device.createBindGroupLayout({
                    label: "scene",
                    entries: [
                        {
                            binding: 0,
                            visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                            buffer: {
                                type: 'uniform'
                            }
                        },
                        {
                            binding: 1,
                            visibility: GPUShaderStage.FRAGMENT,
                            texture: {
                                viewDimension: 'cube',
                                sampleType: 'float',
                                multisampled: false,
                            },
                        },
                        {
                            binding: 2,
                            visibility: GPUShaderStage.FRAGMENT,
                            sampler: {
                                type: 'filtering',
                            },
                        },
                        {
                            binding: 3,
                            visibility: GPUShaderStage.FRAGMENT,
                            texture: {
                                viewDimension: '2d',
                                sampleType: 'float',
                                multisampled: false,
                            },
                        },
                        {
                            binding: 4,
                            visibility: GPUShaderStage.FRAGMENT,
                            sampler: {
                                type: 'filtering',
                            },
                        },
                    ]
                });
            }
            return this.#webgpu.layout;
        }
        return null;
    }

    getPrefilterTexture() {
        let texture: GPUTexture;
        if (this.canIBL()) {
            texture = this.ibl.getPrefilterTexture();
        }
        if (texture == null) {
            const device = this.#webgpu.gpuinfo?.device;
            texture = this.getDefaultCubeTexture(device);
        }
        return texture;
    }

    getPrefilterSampler() {
        let sampler: GPUSampler;
        if (this.canIBL()) {
            sampler = this.ibl.getPerfilterSampler();
        }
        if (sampler == null) {
            const device = this.#webgpu.gpuinfo?.device;
            sampler = this.getDefaultCubeSampler(device);
        }
        return sampler;
    }

    getLUTTexture() {
        let texture: GPUTexture;
        if (this.canIBL()) {
            texture = this.ibl.getLUTTexture();
        }
        if (texture == null) {
            const device = this.#webgpu.gpuinfo?.device;
            texture = this.getDefault2DTexture(device);
        }
        return texture;
    }

    getLUTSampler() {
        let sampler: GPUSampler;
        if (this.canIBL()) {
            sampler = this.ibl.getLUTSampler();
        }
        if (sampler == null) {
            const device = this.#webgpu.gpuinfo?.device;
            sampler = this.getDefault2DSampler(device);
        }
        return sampler;
    }

    getIBLsh() {
        if (this.canIBL()) {
            const res = this.ibl.sh.parameters;
            return res;
        } else {
            return Array(9).fill([1, 1, 1]);
        }
    }

    get bindGroup() {
        if (this.#webgpu.gpuinfo) {
            const device = this.#webgpu.gpuinfo.device;
            const prefilterTexture = this.getPrefilterTexture();
            const prefilterSampler = this.getPrefilterSampler();
            const lutTexture = this.getLUTTexture();
            const lutSampler = this.getLUTSampler();
            this.#webgpu.bindgroup = device.createBindGroup({
                layout: this.bindGroupLayout,
                entries: [
                    { binding: 0, resource: { buffer: this.#webgpu.uniform } },
                    {
                        binding: 1, resource: prefilterTexture.createView({
                            dimension: 'cube'
                        })
                    },
                    { binding: 2, resource: prefilterSampler },
                    {
                        binding: 3, resource: lutTexture.createView({
                            dimension: '2d'
                        })
                    },
                    { binding: 4, resource: lutSampler },
                ]
            });
            return this.#webgpu.bindgroup;
        }
        return null;
    }

    get uniform() {
        return this.#webgpu.uniform;
    }

    getDefaultCubeTexture(device: GPUDevice): GPUTexture {
        if (this.#webgpu.defaultCubeTexture == null) {
            const texture = device.createTexture({
                label: "default texture",
                size: [1, 1, 6],
                format: 'rgba8unorm',
                usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
            });
            device.queue.writeTexture(
                { texture: texture },
                new Uint8Array([0, 0, 0, 0]),
                { bytesPerRow: 4 },
                { width: 1, height: 1 }
            );
            this.#webgpu.defaultCubeTexture = texture;
        }
        return this.#webgpu.defaultCubeTexture;
    }

    getDefaultCubeSampler(device: GPUDevice): GPUSampler {
        if (this.#webgpu.defaultCubeSampler == null) {
            const sampler = device.createSampler({
                label: "default sampler",
                minFilter: 'linear',
                magFilter: 'linear',
                addressModeU: 'repeat',
                addressModeV: 'repeat'
            });
            this.#webgpu.defaultCubeSampler = sampler;
        }
        return this.#webgpu.defaultCubeSampler;
    }

    getDefault2DTexture(device: GPUDevice): GPUTexture {
        if (this.#webgpu.default2DTexture == null) {
            const texture = device.createTexture({
                label: "default texture",
                size: [1, 1, 1],
                format: 'rgba8unorm',
                dimension: '2d',
                usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
            });
            device.queue.writeTexture(
                { texture: texture },
                new Uint8Array([0, 0, 0, 0]),
                { bytesPerRow: 4 },
                { width: 1, height: 1 }
            );
            this.#webgpu.default2DTexture = texture;
        }
        return this.#webgpu.default2DTexture;
    }

    getDefault2DSampler(device: GPUDevice): GPUSampler {
        if (this.#webgpu.default2DSampler == null) {
            const sampler = device.createSampler({
                label: "default sampler",
                minFilter: 'linear',
                magFilter: 'linear',
                addressModeU: 'repeat',
                addressModeV: 'repeat'
            });
            this.#webgpu.default2DSampler = sampler;
        }
        return this.#webgpu.default2DSampler;
    }

    destroy() {
        if (this.#webgpu.uniform) {
            this.#webgpu.uniform.destroy();
        }
        if (this.#webgpu.defaultCubeTexture) {
            this.#webgpu.defaultCubeTexture.destroy();
        }
        if (this.#webgpu.default2DTexture) {
            this.#webgpu.default2DTexture.destroy();
        }
    }
};