import { mat4, vec3, vec4 } from "gl-matrix";
import type Camera from "./camera";
import type Projection from "./projection";
import { Ray } from "./objects";
import type PointLight from "./light";
import type { CanvasGPUInfo, GPUInfo } from "./webgpuUtils";
import sceneCode from "./shader/scene.wgsl";
import { makeShaderDataDefinitions, makeStructuredView, type ShaderDataDefinitions } from "webgpu-utils";
import { vec4t3 } from "./matrix";

export default class Scene {

    camera: Camera;
    projection: Projection;
    #width: number = 0;
    #height: number = 0;
    lights: PointLight[] = [];
    #MAX_NUM_LIGHTS = 16;

    #webgpu: {
        gpuinfo?: GPUInfo,
        canvasinfo?: CanvasGPUInfo,
        definition?: ShaderDataDefinitions,
        uniform?: GPUBuffer,
        layout?: GPUBindGroupLayout
        bindgroup?: GPUBindGroup
    } = {};

    constructor(camera: Camera, projection: Projection) {
        this.camera = camera;
        this.projection = projection;
    }

    addLight(light: PointLight) {
        this.lights.push(light);
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

            const nLights = Math.min(this.#MAX_NUM_LIGHTS, this.lights.length);
            const lightData = [];
            for (let i = 0; i < nLights; ++i) {
                lightData.push({
                    position: this.lights[i].position,
                    color: this.lights[i].color
                });
            }

            const uniformData = {
                camera: cameraData,
                projection: projectionData,
                viewport: viewportData,
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
                    entries: [
                        {
                            binding: 0,
                            visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                            buffer: {
                                type: 'uniform'
                            }
                        }
                    ]
                });
            }
            return this.#webgpu.layout;
        }
        return null;
    }

    get bindGroup() {
        if (this.#webgpu.gpuinfo) {
            if (!this.#webgpu.bindgroup) {
                const device = this.#webgpu.gpuinfo.device;
                this.#webgpu.bindgroup = device.createBindGroup({
                    layout: this.bindGroupLayout,
                    entries: [
                        { binding: 0, resource: { buffer: this.#webgpu.uniform } }
                    ]
                });
            }
            return this.#webgpu.bindgroup;
        }
        return null;
    }

    get uniform() {
        return this.#webgpu.uniform;
    }
};