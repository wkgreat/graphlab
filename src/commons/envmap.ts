import { read, type KTX2Container } from "ktx-parse";
import type { CanvasGPUInfo, GPUInfo, WebGPUContext } from "./webgpuUtils";
import { createCubeTextureFromKTX2 } from "./texture";
import type Scene from "./scene";
import { vec3 } from "gl-matrix";
import { vec3_add, vec3_norm, vec3_scale, vec3_sub, vec4t3 } from "./matrix";
import skyboxCode from './shader/skybox.wgsl';

export const EnvironmentMapTypes = {
    KTX: "KTX",
    PNG: "PNG",
    JPG: "JPG"
} as const;

export type EnvironmentMapTypes = typeof EnvironmentMapTypes[keyof typeof EnvironmentMapTypes];

export default class EnvironmentMap {

    name: string = "EnvironmentMap";
    type: EnvironmentMapTypes;
    ktx?: KTX2Container;

    webgpu: {
        context?: WebGPUContext
        scene?: Scene;
        buffers?: Record<string, GPUBuffer>;
        uniforms?: Record<string, GPUBuffer>;
        sampler?: GPUSampler;
        cubeTexture?: GPUTexture;
        module?: GPUShaderModule;
        pipeline?: GPURenderPipeline;
        bindGroup?: GPUBindGroup;
    } = {};

    private constructor() {
        this.webgpu.buffers = {};
        this.webgpu.uniforms = {};
    }

    static async fromKtx(name: string, uri: string): Promise<EnvironmentMap> {

        const res = await fetch(uri);
        const buf = await res.arrayBuffer();
        const u8buf = new Uint8Array(buf);
        const ktx = read(u8buf);

        const envmap = new EnvironmentMap();
        envmap.type = 'KTX';
        envmap.name = name;
        envmap.ktx = ktx;

        return envmap;
    }

    initWebGPU(context: WebGPUContext, scene: Scene) {
        this.webgpu.context = context;
        this.webgpu.scene = scene;
    }

    #createCubeTexture(): GPUTexture | null {

        if (this.type === 'KTX') {
            if (this.ktx == null) {
                return null;
            }
            const device = this.webgpu.context?.device;
            if (device == null) {
                return null;
            }
            return createCubeTextureFromKTX2(device, this.ktx);
        } else {
            //TODO
        }

    }

    #createVertexData() {
        const scene = this.webgpu.scene;
        const cameraFrom = scene.camera.from;
        const cameraTo = scene.camera.to;
        const cameraUp = scene.camera.up;
        const near = scene.projection.near;
        const fovy = scene.projection.fovy;
        const aspect = scene.projection.aspect;

        const forward = vec3.create();
        vec3.sub(forward, vec4t3(cameraTo), vec4t3(cameraFrom));
        vec3.normalize(forward, forward);

        const worldup = vec3.normalize(vec3.create(), cameraUp);

        const right = vec3.cross(vec3.create(), worldup, forward);
        vec3.normalize(right, right);

        const up = vec3.cross(vec3.create(), forward, right);
        vec3.normalize(up, up);

        const half_height = near * Math.tan(fovy / 2);
        const half_width = aspect * half_height;

        const leftUp = vec3_norm(vec3_add(vec3_add(vec3_scale(right, half_width), vec3_scale(up, half_height)), vec3_scale(forward, near)));
        const rightUp = vec3_norm(vec3_add(vec3_add(vec3_scale(right, -half_width), vec3_scale(up, half_height)), vec3_scale(forward, near)));
        const rightDown = vec3_norm(vec3_add(vec3_sub(vec3_scale(right, -half_width), vec3_scale(up, half_height)), vec3_scale(forward, near)));
        const leftDown = vec3_norm(vec3_add(vec3_sub(vec3_scale(right, half_width), vec3_scale(up, half_height)), vec3_scale(forward, near)));

        // vertices in clip space
        // [x,y,z,dx,dy,dz]
        const vertices = [

            -1, 1, 1, ...leftUp, //leftup
            -1, -1, 1, ...leftDown, //leftdown
            1, -1, 1, ...rightDown, //rightdown
            1, -1, 1, ...rightDown, //rightdown
            1, 1, 1, ...rightUp, //rightup
            -1, 1, 1, ...leftUp //leftup

        ]

        return new Float32Array(vertices);
    }

    getVertexBuffer() {
        const device = this.webgpu.context?.device;
        if (device == null) {
            return null;
        }
        if (this.webgpu.buffers.default == null) {
            const data = this.#createVertexData();
            const buffer = device.createBuffer({
                label: "envmap skybox",
                size: data.byteLength,
                usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
            });
            device.queue.writeBuffer(buffer, 0, data);
            this.webgpu.buffers.default = buffer;
        } else {
            //TODO 每次都更新数据，后面改成相机和投影变化时触发
            const data = this.#createVertexData();
            device.queue.writeBuffer(this.webgpu.buffers.default, 0, data);
        }
        return this.webgpu.buffers.default;
    }

    getCubeTexture(): GPUTexture | null {
        if (this.webgpu.cubeTexture == null) {
            this.webgpu.cubeTexture = this.#createCubeTexture();
        }
        return this.webgpu.cubeTexture;
    }

    getSampler(): GPUSampler | null {
        const device = this.webgpu.context?.device;
        if (device == null) {
            return null;
        }
        if (this.webgpu.sampler == null) {
            this.webgpu.sampler = device.createSampler({
                label: "envmap sapler",
                magFilter: 'linear',
                minFilter: 'linear',
                mipmapFilter: 'linear',
                addressModeU: 'clamp-to-edge',
                addressModeV: 'clamp-to-edge',
                addressModeW: 'clamp-to-edge',
            });
        }
        return this.webgpu.sampler;
    }

    getBindGroup(): GPUBindGroup | null {
        const device = this.webgpu.context?.device;
        if (device == null) {
            return;
        }
        if (this.webgpu.bindGroup == null) {
            const pipeline = this.getPipeline();
            const texture = this.getCubeTexture();
            const sampler = this.getSampler();
            const bindGroup = device.createBindGroup({
                label: "envmap skybox",
                layout: pipeline.getBindGroupLayout(0),
                entries: [
                    {
                        binding: 0, resource: texture.createView({
                            dimension: 'cube'
                        })
                    },
                    { binding: 1, resource: sampler },
                ]
            });
            this.webgpu.bindGroup = bindGroup;
        }
        return this.webgpu.bindGroup;
    }

    draw(pass: GPURenderPassEncoder): void {

        const device = this.webgpu.context?.device;
        if (device == null) {
            return;
        }
        const pipeline = this.getPipeline();
        const bindgroup = this.getBindGroup();
        const vertexBuffer = this.getVertexBuffer();

        pass.setPipeline(pipeline);
        pass.setBindGroup(0, bindgroup);
        pass.setVertexBuffer(0, vertexBuffer);
        pass.draw(6);
    }

    getPipeline(): GPURenderPipeline | null {

        const device = this.webgpu.context?.device;
        if (device == null) {
            return null;
        }
        const module = device.createShaderModule({
            label: "envmap skybox",
            code: skyboxCode
        });

        this.webgpu.module = module;

        const bindGroupLayout = device.createBindGroupLayout({
            label: "envmap skybox",
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {
                        viewDimension: 'cube',
                        sampleType: 'float',
                        multisampled: false,
                    },
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: {
                        type: 'filtering',
                    },
                },
            ]
        });

        const pipelineLayout = device.createPipelineLayout({
            bindGroupLayouts: [
                bindGroupLayout
            ]
        });

        const pipeline = device.createRenderPipeline({
            label: "envmap skybox",
            layout: pipelineLayout,
            vertex: {
                module,
                buffers: [
                    {
                        arrayStride: 6 * 4,
                        attributes: [
                            { shaderLocation: 0, offset: 0, format: 'float32x3' },
                            { shaderLocation: 1, offset: 3 * 4, format: 'float32x3' },
                        ]
                    }
                ]
            },
            fragment: {
                module,
                targets: [
                    { format: this.webgpu.context.canvas.context.getConfiguration().format }
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

        this.webgpu.pipeline = pipeline;

        return this.webgpu.pipeline;

    };

    destroy(): void {
        if (this.webgpu.cubeTexture) {
            this.webgpu.cubeTexture.destroy();
        }
    }

}