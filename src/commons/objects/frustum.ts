import { mat4, vec3 } from "gl-matrix"
import type Camera from "../camera"
import type { NumArr3 } from "../defines"
import { NDCCubeZO } from "../objects"
import type Projection from "../projection"
import type { CanvasGPUInfo, GPUInfo } from "../webgpuUtils"
import { createBuffersAndAttributesFromArrays, makeShaderDataDefinitions, makeStructuredView, type BuffersAndAttributes, type ShaderDataDefinitions } from "webgpu-utils"
import { Colors } from "../color"

export interface FrustumOptions {
    eye: NumArr3
    target: NumArr3
    up: NumArr3
    near: number
    far: number
    aspect: number
    fovy: number
}

export class Frustum {

    #eye: NumArr3
    #target: NumArr3
    #near: number
    #far: number
    #aspect: number
    #fovy: number
    #up: NumArr3
    #cube: NDCCubeZO;
    #projmtx: mat4;
    #viewmtx: mat4;
    #projmtxInv: mat4;
    #viewmtxInv: mat4;

    shaderDefinition: ShaderDataDefinitions | null = null;
    module: GPUShaderModule | null = null;
    pipeline: GPURenderPipeline | null = null;
    vertexBuffer: BuffersAndAttributes | null = null;
    indexBuffer: GPUBuffer | null = null;
    sceneUniform: GPUBuffer | null = null;
    frustumUniform: GPUBuffer | null = null;
    callbacks: ((frustum: Frustum) => void)[] = [];

    constructor(options: FrustumOptions) {
        this.#eye = options.eye;
        this.#target = options.target;
        this.#near = options.near;
        this.#far = options.far;
        this.#aspect = options.aspect;
        this.#fovy = options.fovy;
        this.#up = options.up;
        this.#cube = new NDCCubeZO({
            colors: [
                Colors.cyan,
                Colors.magenta,
                Colors.neonGreen,
                Colors.electricBlue,
                Colors.hotPink,
                Colors.sand
            ],
            colormode: 'face'
        });

        this.#computeMatrix();

    }

    set eye(eye: NumArr3) {
        this.#eye = eye;
        this.#computeMatrix();
        this.#change();
    }

    get eye() {
        return this.#eye;
    }

    set target(target: NumArr3) {
        this.#target = target;
        this.#computeMatrix();
        this.#change();
    }

    get target() {
        return this.#target;
    }

    set up(up: NumArr3) {
        this.#up = up;
        this.#computeMatrix();
        this.#change();
        console.log(this.#up);
    }

    get up() {
        return this.#up;
    }

    set near(near: number) {
        this.#near = near;
        this.#computeMatrix();
        this.#change();
    }

    get near() {
        return this.#near;
    }

    set far(far: number) {
        this.#far = far;
        this.#computeMatrix();
        this.#change();
    }

    get far() {
        return this.#far;
    }

    set aspect(aspect: number) {
        this.#aspect = aspect;
        this.#computeMatrix();
        this.#change();
    }

    get aspect() {
        return this.#aspect;
    }

    set fovy(fovy: number) {
        this.#fovy = fovy;
        this.#computeMatrix();
        this.#change();
    }

    get fovy() {
        return this.#fovy;
    }

    addChangeCallbacks(f: (Frustum) => void) {
        this.callbacks.push(f);
    }

    #change() {
        for (const f of this.callbacks) {
            f(this);
        }
    }

    #computeMatrix() {
        const projmtx = mat4.perspectiveZO(mat4.create(), this.#fovy, this.#aspect, this.#near, this.#far);
        const center = this.#target;
        const viewmtx = mat4.lookAt(mat4.create(), this.#eye, center, this.#up);
        const projmtxInv = mat4.invert(mat4.create(), projmtx);
        const viewmtxInv = mat4.invert(mat4.create(), viewmtx);

        this.#projmtx = projmtx;
        this.#viewmtx = viewmtx;
        this.#projmtxInv = projmtxInv;
        this.#viewmtxInv = viewmtxInv;
    }

    computeSightLine() {

        const eye = vec3.fromValues(...this.eye);
        const target = vec3.fromValues(...this.target);
        const up = vec3.fromValues(...this.#up);
        const near = this.near;
        const far = this.far;
        const nd = vec3.normalize(vec3.create(), vec3.sub(vec3.create(), target, eye));
        const nr = vec3.normalize(vec3.create(), vec3.cross(vec3.create(), nd, up));
        const nu = vec3.normalize(vec3.create(), vec3.cross(vec3.create(), nd, nr));

        const vEye2near = vec3.scale(vec3.create(), nd, near);
        const ptNearCenter = vec3.add(vec3.create(), eye, vEye2near);
        const halfNearHeight = Math.tan(this.#fovy / 2) * near;
        const halfNearWidth = this.#aspect * halfNearHeight;
        let pnUR = vec3.add(vec3.create(), ptNearCenter, vec3.scale(vec3.create(), nr, halfNearWidth));
        pnUR = vec3.add(vec3.create(), pnUR, vec3.scale(vec3.create(), nu, halfNearHeight));

        let pnUL = vec3.add(vec3.create(), ptNearCenter, vec3.scale(vec3.create(), nr, -halfNearWidth));
        pnUL = vec3.add(vec3.create(), pnUL, vec3.scale(vec3.create(), nu, halfNearHeight));

        let pnDR = vec3.add(vec3.create(), ptNearCenter, vec3.scale(vec3.create(), nr, halfNearWidth));
        pnDR = vec3.add(vec3.create(), pnDR, vec3.scale(vec3.create(), nu, -halfNearHeight));

        let pnDL = vec3.add(vec3.create(), ptNearCenter, vec3.scale(vec3.create(), nr, -halfNearWidth));
        pnDL = vec3.add(vec3.create(), pnDL, vec3.scale(vec3.create(), nu, -halfNearHeight));

        const vEye2far = vec3.scale(vec3.create(), nd, far);
        const ptFarCenter = vec3.add(vec3.create(), eye, vEye2far);
        const halfFarHeight = Math.tan(this.#fovy / 2) * far;
        const halfFarWidth = this.#aspect * halfFarHeight;
        let pfUR = vec3.add(vec3.create(), ptFarCenter, vec3.scale(vec3.create(), nr, halfFarWidth));
        pfUR = vec3.add(vec3.create(), pfUR, vec3.scale(vec3.create(), nu, halfFarHeight));

        let pfUL = vec3.add(vec3.create(), ptFarCenter, vec3.scale(vec3.create(), nr, -halfFarWidth));
        pfUL = vec3.add(vec3.create(), pfUL, vec3.scale(vec3.create(), nu, halfFarHeight));

        let pfDR = vec3.add(vec3.create(), ptFarCenter, vec3.scale(vec3.create(), nr, halfFarWidth));
        pfDR = vec3.add(vec3.create(), pfDR, vec3.scale(vec3.create(), nu, -halfFarHeight));

        let pfDL = vec3.add(vec3.create(), ptFarCenter, vec3.scale(vec3.create(), nr, -halfFarWidth));
        pfDL = vec3.add(vec3.create(), pfDL, vec3.scale(vec3.create(), nu, -halfFarHeight));

        const centerline = new Float32Array([
            ...eye, ...ptFarCenter,
            ...eye, ...pfUR,
            ...eye, ...pfUL,
            ...eye, ...pfDR,
            ...eye, ...pfDL,
        ]);

        return centerline;

    }

    refreshVertexBuffer(device: GPUDevice) {

        //vertex buffer
        if (!this.vertexBuffer) {

            this.vertexBuffer = createBuffersAndAttributesFromArrays(device, {
                position: { data: this.#cube.positions, numComponents: 3 },
                color: { data: this.#cube.colors, numComponents: 4 }
            });
        }
    }

    refreshUniform(device: GPUDevice, camera: Camera, projection: Projection) {

        const label = "Frustum";
        const frustumView = makeStructuredView(this.shaderDefinition.uniforms.frustum);
        if (!this.frustumUniform) {
            this.frustumUniform = device.createBuffer({
                label,
                size: frustumView.arrayBuffer.byteLength,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
            });
        }
        frustumView.set({
            viewmtxInv: this.#viewmtxInv,
            projmtxInv: this.#projmtxInv
        });
        device.queue.writeBuffer(this.frustumUniform, 0, frustumView.arrayBuffer);

        const sceneView = makeStructuredView(this.shaderDefinition.uniforms.scene);

        if (!this.sceneUniform) {
            this.sceneUniform = device.createBuffer({
                label,
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

    initWebGPU(gpuinfo: GPUInfo, canvasinfo: CanvasGPUInfo, camera: Camera, projection: Projection) {

        const device = gpuinfo.device;

        const code = /*WGSL*/`

        struct FrustumUniform {
            viewmtxInv: mat4x4f,
            projmtxInv: mat4x4f
        }
        
        struct SceneUniform {
            viewmtx: mat4x4f,
            projmtx: mat4x4f
        }

        @group(0) @binding(0) var<uniform> frustum : FrustumUniform;
        @group(0) @binding(1) var<uniform> scene : SceneUniform;

        struct VSInput {
            @location(0) position: vec3f,
            @location(1) color: vec4f
        }

        struct VSOutput {
            @builtin(position) position: vec4f,
            @location(0) color: vec4f
        }

        @vertex 
        fn vs(input: VSInput) -> VSOutput {

            let cubepos = vec4f(input.position, 1);

            let worldpos = frustum.viewmtxInv * frustum.projmtxInv * cubepos;

            let ndcpos = scene.projmtx * scene.viewmtx * worldpos;

            var output: VSOutput;

            output.position = ndcpos;

            output.color = input.color;

            return output;

        }
        
        @fragment 
        fn fs(input: VSOutput) -> @location(0) vec4f {
            var color = input.color;
            color.a = 0.5;
            return color;
        }
        
        `

        const label = "Frustum";

        this.shaderDefinition = makeShaderDataDefinitions(code);

        this.refreshVertexBuffer(device);

        this.refreshUniform(device, camera, projection);

        //module and pipeline
        this.module = device.createShaderModule({
            label,
            code
        });

        this.pipeline = device.createRenderPipeline({
            label,
            layout: 'auto',
            vertex: {
                module: this.module,
                buffers: this.vertexBuffer.bufferLayouts
            },
            fragment: {
                module: this.module,
                targets: [
                    {
                        format: canvasinfo.context.getConfiguration()!.format,
                        blend: {
                            color: {
                                srcFactor: 'src-alpha',         // 当前片元颜色贡献 = 颜色 * alpha
                                dstFactor: 'one-minus-src-alpha', // 背景颜色贡献 = 颜色 * (1 - alpha)
                                operation: 'add',
                            },
                            alpha: {
                                srcFactor: 'one',               // 当前片元 alpha 直接写入
                                dstFactor: 'one-minus-src-alpha', // 背景 alpha 考虑透过率
                                operation: 'add',
                            },
                        },
                        writeMask: GPUColorWrite.ALL,
                    }
                ]
            },
            primitive: {
                topology: 'triangle-list',
                cullMode: 'none',
                frontFace: 'ccw'
            },
            depthStencil: {
                format: 'depth24plus',
                depthWriteEnabled: false,
                depthCompare: 'less'
            }
        });

    }

    draw(gpuinfo: GPUInfo, camera: Camera, projection: Projection, pass: GPURenderPassEncoder) {

        const device = gpuinfo.device;

        this.refreshVertexBuffer(device);

        this.refreshUniform(device, camera, projection);

        const bindGroup = device.createBindGroup({
            label: "Frustum",
            layout: this.pipeline.getBindGroupLayout(0),
            entries: [
                { binding: 0, resource: { buffer: this.frustumUniform! } },
                { binding: 1, resource: { buffer: this.sceneUniform! } }
            ]
        });

        pass.setPipeline(this.pipeline);
        pass.setBindGroup(0, bindGroup);
        pass.setVertexBuffer(0, this.vertexBuffer.buffers[0])
        pass.draw(this.#cube.vertexCount);

    }

}