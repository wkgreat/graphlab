import { mat4, vec3 } from "gl-matrix";
import type Camera from "./camera";
import type Projection from "./projection";
import type { CanvasGPUInfo, GPUInfo } from "./webgpuUtils";
import { createBuffersAndAttributesFromArrays, makeShaderDataDefinitions, makeStructuredView, type BuffersAndAttributes, type ShaderDataDefinitions } from "webgpu-utils";
import type { NumArr3, NumArr4 } from "./defines";
import { createCheckerBoardTexture } from "./texture";
import { Colors } from "./color";

export class Ground {

    positions = [
        -1, -1, 0,   // 左下
        1, -1, 0,   // 右下
        1, 1, 0,   // 右上
        -1, 1, 0,   // 左上
    ];

    normals = [
        0, 0, 1,   // 左下
        0, 0, 1,   // 右下
        0, 0, 1,   // 右上
        0, 0, 1,   // 左上
    ];

    texcoords = [
        0, 0,   // 左下
        1, 0,   // 右下
        1, 1,   // 右上
        0, 1,   // 左上
    ];

    indices = [
        0, 1, 2,   // 第一个三角形
        0, 2, 3,   // 第二个三角形
    ];

    definition: ShaderDataDefinitions | null = null;
    sceneUniform: GPUBuffer | null = null;
    vertexBuffer: BuffersAndAttributes | null = null;
    indexBuffer: GPUBuffer | null = null;
    module: GPUShaderModule | null = null;
    pipeline: GPURenderPipeline | null = null;
    texture: GPUTexture | null = null;
    sampler: GPUSampler | null = null;

    constructor(xsize: number = 100, ysize: number = 100) {
        const hx = xsize / 2;
        const hy = ysize / 2;
        for (let i = 0; i < this.positions.length; ++i) {
            if (i % 3 === 0) {
                this.positions[i] *= hx;
            } else if (i % 3 === 1) {
                this.positions[i] *= hy;
            }
        }
    }

    refreshVertexBuffer(device: GPUDevice) {

        const vertexBuffer = createBuffersAndAttributesFromArrays(device, {
            position: { data: new Float32Array(this.positions), numComponents: 3 },
            texcoord: { data: new Float32Array(this.texcoords), numComponents: 2 },
            normal: { data: new Float32Array(this.normals), numComponents: 3 },

        });

        const indexBufferData = new Uint32Array(this.indices);

        const indexBuffer = device.createBuffer({
            size: indexBufferData.byteLength,
            usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST
        });
        device.queue.writeBuffer(indexBuffer, 0, indexBufferData);

        this.vertexBuffer = vertexBuffer;
        this.indexBuffer = indexBuffer;

    }

    refreshTexture(device: GPUDevice) {
        if (!this.texture || !this.sampler) {
            const textureInfo = createCheckerBoardTexture({
                device,
                color1: [0.7, 0.7, 0.7, 1],
                color2: [0.3, 0.3, 0.3, 1],
                density: 15,
            });
            if (this.texture) {
                this.texture.destroy();
            }
            this.texture = textureInfo.texture;
            this.sampler = textureInfo.sampler;
        }
    }

    refreshUniforms(device: GPUDevice, camera: Camera, projection: Projection) {
        if (!this.definition) {
            console.error("definition is null");
            return;
        }

        const view = makeStructuredView(this.definition.uniforms.scene);
        view.set({
            viewmtx: camera.viewMtx,
            projmtx: projection.perspectiveMatrixZO
        });
        if (!this.sceneUniform) {
            this.sceneUniform = device.createBuffer({
                size: view.arrayBuffer.byteLength,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
            });
        }
        device.queue.writeBuffer(this.sceneUniform, 0, view.arrayBuffer);
    }

    initWebGPU(gpuinfo: GPUInfo, canvasinfo: CanvasGPUInfo) {
        const device = gpuinfo.device;

        this.refreshVertexBuffer(device);

        const code = /*WGSL*/`

        struct SceneUniform {
            viewmtx: mat4x4f,
            projmtx: mat4x4f
        }

        @group(0) @binding(0) var<uniform> scene: SceneUniform;

        @group(1) @binding(0) var theTexture: texture_2d<f32>;
        @group(1) @binding(1) var theSampler: sampler;
        
        struct VSInput {
            @location(0) position: vec3f,
            @location(1) texcoord: vec2f,
            @location(2) normal: vec3f
        }

        struct VSOutput {
            @builtin(position) position: vec4f,
            @location(0) texcoord: vec2f,
            @location(1) normal: vec3f
        }

        @vertex fn vs(input: VSInput) -> VSOutput {

            let worldpos = vec4f(input.position, 1.0);
            let ndcpos = scene.projmtx * scene.viewmtx * worldpos;
            var output: VSOutput;
            output.position = ndcpos;
            output.texcoord = input.texcoord;
            output.normal = input.normal;

            return output;

        }
        @fragment fn fs(input: VSOutput) -> @location(0) vec4f {

            var color = textureSample(theTexture, theSampler, input.texcoord);

            return color;
        }
        `

        this.definition = makeShaderDataDefinitions(code);

        this.module = device.createShaderModule({
            label: "Ground",
            code
        });

        this.pipeline = device.createRenderPipeline({
            label: "Ground",
            layout: "auto",
            vertex: {
                module: this.module,
                buffers: this.vertexBuffer.bufferLayouts
            },
            fragment: {
                module: this.module,
                targets: [
                    { format: canvasinfo.context.getConfiguration()!.format }
                ]
            },
            primitive: {
                topology: 'triangle-list',
            },
            depthStencil: {
                format: 'depth24plus',
                depthWriteEnabled: false,
                depthCompare: 'less-equal'
            }
        });
    }

    draw(gpuinfo: GPUInfo, camera: Camera, projection: Projection, pass: GPURenderPassEncoder) {

        const device = gpuinfo.device;

        this.refreshTexture(device);

        this.refreshUniforms(device, camera, projection);

        const sceneBindGroup = device.createBindGroup({
            label: "Ground",
            layout: this.pipeline.getBindGroupLayout(0),
            entries: [
                { binding: 0, resource: { buffer: this.sceneUniform! } }
            ]
        });

        const textureBindGroup = device.createBindGroup({
            label: "Ground",
            layout: this.pipeline.getBindGroupLayout(1),
            entries: [
                { binding: 0, resource: this.texture },
                { binding: 1, resource: this.sampler }
            ]
        });

        pass.setPipeline(this.pipeline);
        pass.setBindGroup(0, sceneBindGroup);
        pass.setBindGroup(1, textureBindGroup);
        pass.setVertexBuffer(0, this.vertexBuffer.buffers[0])
        pass.setIndexBuffer(this.indexBuffer, 'uint32');
        pass.drawIndexed(6);

    }

}

export type NDCCubeColorMode = 'vertex' | 'triangle' | 'face'

export interface NDCCubeOptions {
    colors?: NumArr4[]
    colormode?: NDCCubeColorMode
}

export class NDCCube {

    positions = new Float32Array([
        // 前面 (Z = 1.0)
        -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, -1, 1, 1, 1, 1, -1, 1, 1,
        // 后面 (Z = -1.0)
        -1, -1, -1, -1, 1, -1, 1, 1, -1, -1, -1, -1, 1, 1, -1, 1, -1, -1,
        // 上面 (Y = 1.0)
        -1, 1, -1, -1, 1, 1, 1, 1, 1, -1, 1, -1, 1, 1, 1, 1, 1, -1,
        // 下面 (Y = -1.0)
        -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, -1, 1, -1, 1, -1, -1, 1,
        // 右面 (X = 1.0)
        1, -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, -1, 1, 1, 1, 1, -1, 1,
        // 左面 (X = -1.0)
        -1, -1, -1, -1, -1, 1, -1, 1, 1, -1, -1, -1, -1, 1, 1, -1, 1, -1,
    ])

    // ---------- 顶点法向量 (nx, ny, nz) ----------
    normals = new Float32Array([
        ...Array(6).fill([0, 0, 1]).flat(), ...Array(6).fill([0, 0, -1]).flat(),
        ...Array(6).fill([0, 1, 0]).flat(), ...Array(6).fill([0, -1, 0]).flat(),
        ...Array(6).fill([1, 0, 0]).flat(), ...Array(6).fill([-1, 0, 0]).flat(),
    ])


    // ---------- 顶点纹理坐标 (u, v) ----------
    texcoords = new Float32Array([
        ...Array(6).fill([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0]).flat(),
    ])

    colors: Float32Array | null = null;

    vertexCount = 36;
    inputColors: NumArr4[];
    colorMode: NDCCubeColorMode;

    constructor(options: NDCCubeOptions) {
        if (options.colors && options.colors.length !== 0) {
            this.inputColors = options.colors;
        } else {
            this.inputColors = [[1, 1, 1, 1]];
        }
        this.colorMode = options.colormode || 'face';

        this.genCubeColors();
    }

    genCubeColors() {

        let stride = 0;
        if (this.colorMode === 'vertex') {
            stride = 1;
        } else if (this.colorMode === 'triangle') {
            stride = 3;
        } else if (this.colorMode === 'face') {
            stride = 6;
        }

        const colors = [];

        const numInColors = this.inputColors.length;

        for (let i = 0; i < this.vertexCount; ++i) {

            const idx = Math.floor((i) / stride) % numInColors;
            const color = this.inputColors[idx];
            colors.push(color);
        }

        this.colors = new Float32Array(colors.flat());

    }
};

export class NDCCubeZO extends NDCCube {

    override positions = new Float32Array([
        // 前面 (Z = 1.0) - CCW
        -1, -1, 1, 1, -1, 1, 1, 1, 1,
        -1, -1, 1, 1, 1, 1, -1, 1, 1,

        // 后面 (Z = 0.0) - CCW (从后方看是CCW，从前方看是CW)
        -1, -1, 0, -1, 1, 0, 1, 1, 0,
        -1, -1, 0, 1, 1, 0, 1, -1, 0,

        // 上面 (Y = 1.0) - CCW
        -1, 1, 0, -1, 1, 1, 1, 1, 1,
        -1, 1, 0, 1, 1, 1, 1, 1, 0,

        // 下面 (Y = -1.0) - CCW
        -1, -1, 0, 1, -1, 0, 1, -1, 1,
        -1, -1, 0, 1, -1, 1, -1, -1, 1,

        // 右面 (X = 1.0) - CCW
        1, -1, 0, 1, 1, 0, 1, 1, 1,
        1, -1, 0, 1, 1, 1, 1, -1, 1,

        // 左面 (X = -1.0) - CCW
        -1, -1, 0, -1, -1, 1, -1, 1, 1,
        -1, -1, 0, -1, 1, 1, -1, 1, 0,
    ])

    override normals = new Float32Array([
        ...Array(6).fill([0, 0, 1]).flat(),  // 前
        ...Array(6).fill([0, 0, -1]).flat(),  // 后
        ...Array(6).fill([0, 1, 0]).flat(),  // 上
        ...Array(6).fill([0, -1, 0]).flat(),  // 下
        ...Array(6).fill([1, 0, 0]).flat(),  // 右
        ...Array(6).fill([-1, 0, 0]).flat(), // 左
    ])

    override texcoords = new Float32Array([
        ...Array(6).fill([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0]).flat(),
    ])

    constructor(options: NDCCubeOptions) {
        super(options);
    }

}