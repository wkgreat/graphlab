import type { BuffersAndAttributes, ShaderDataDefinitions } from "webgpu-utils";
import type Scene from "../scene";
import type { CanvasGPUInfo, GPUInfo } from "../webgpuUtils";

export interface RenderObjectWebGPU {
    gpuinfo?: GPUInfo
    canvasinfo?: CanvasGPUInfo
    scene?: Scene
    definition?: ShaderDataDefinitions
    module?: GPUShaderModule
    pipelines?: { [key: string]: GPURenderPipeline }
    buffers?: { [key: string]: BuffersAndAttributes }
    uniforms?: { [key: string]: GPUBuffer }
    textures?: { [key: string]: GPUTexture }
    samplers?: { [key: string]: GPUSampler }
    storages?: { [key: string]: GPUBuffer }
}

export const RenderSpace = {
    WORLD: 0,
    NDC: 1
} as const;

export type RenderSpace = typeof RenderSpace[keyof typeof RenderSpace];

export interface RenderOptions {
    depth?: {
        depthBias?: number
        depthBiasSlopeScale?: number
    }
    frontFace?: GPUFrontFace
    space?: RenderSpace
}

export interface RenderObjectOptions {
    label?: string,
    render?: RenderOptions
};

export default abstract class RenderObject {

    label: string;
    protected webgpu: RenderObjectWebGPU = {};
    protected renderOptions: RenderOptions = {};

    constructor(options: RenderObjectOptions = {}) {
        this.label = options.label ?? "RenderObject";
        this.webgpu.buffers = {}
        this.webgpu.uniforms = {}
        this.refreshRenderOptions(options.render);

    }

    refreshRenderOptions(options?: RenderOptions) {
        this.renderOptions = this.renderOptions ?? {};
        this.renderOptions.depth = this.renderOptions.depth ?? {};
        if (!options) {
            return;
        }
        if (options.depth) {
            this.renderOptions.depth.depthBias = options.depth.depthBias ?? 0;
            this.renderOptions.depth.depthBiasSlopeScale = options.depth.depthBiasSlopeScale ?? 0;
        } else {
            this.renderOptions.depth.depthBias = 0;
            this.renderOptions.depth.depthBiasSlopeScale = 0;
        }
        this.renderOptions.frontFace = options.frontFace ?? 'ccw';
        this.renderOptions.space = options.space ?? RenderSpace.WORLD;

    }

    initWebGPU(gpuinfo: GPUInfo, canvasinfo: CanvasGPUInfo, scene: Scene, options?: RenderOptions) {

        this.webgpu.gpuinfo = gpuinfo;
        this.webgpu.canvasinfo = canvasinfo;
        this.webgpu.scene = scene;

        if (options) {
            this.refreshRenderOptions(options);
        }

        this.refreshVertexBuffers(true);
        this.refreshUniforms(true);
        this.createPipeline(true);

    }

    abstract refreshVertexBuffers(force: boolean): void;
    abstract refreshUniforms(force: boolean): void;
    abstract createPipeline(force: boolean): void;
    abstract draw(pass: GPURenderPassEncoder): void;
    abstract destroy(): void;

}