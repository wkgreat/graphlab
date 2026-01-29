import { createBuffersAndAttributesFromArrays, makeShaderDataDefinitions, makeStructuredView, type BuffersAndAttributes, type ShaderDataDefinitions } from "webgpu-utils";
import type Camera from "./camera";
import type { NumArr3, NumArr4 } from "./defines";
import type Projection from "./projection";
import { createCheckerBoardTexture } from "./texture";
import type { CanvasGPUInfo, GPUInfo } from "./webgpuUtils";
import { mat4, vec3, vec4 } from "gl-matrix";

interface RayCrossTriangleResult {
    cross: boolean,
    point: vec3 | null,
    distance: number | null;
    uvt: [number, number, number]
}

export class Triangle {
    p0: vec3 = vec3.fromValues(0, 0, 0);

    p1: vec3 = vec3.fromValues(1, 0, 0);

    p2: vec3 = vec3.fromValues(0, 1, 0);

    constructor(p0: vec3, p1: vec3, p2: vec3) {
        this.p0 = p0;
        this.p1 = p1;
        this.p2 = p2;
    }

    computeArea(): number {
        const e0 = vec3.sub(vec3.create(), this.p1, this.p0);
        const e1 = vec3.sub(vec3.create(), this.p2, this.p0);
        const c = vec3.cross(vec3.create(), e0, e1);
        return vec3.length(c) / 2.0;
    }

    #selectPointByIndex(idx: number): [vec3, vec3, vec3] {
        if (idx === 0) {
            return [this.p0, this.p1, this.p2];
        } else if (idx === 1) {
            return [this.p1, this.p2, this.p0];
        } else {
            return [this.p2, this.p0, this.p1];
        }
    }

    computeRadians(idx: number): number {
        const [a0, a1, a2] = this.#selectPointByIndex(idx);
        const v0 = vec3.create();
        const v1 = vec3.create();
        vec3.sub(v0, a1, a0);
        vec3.normalize(v0, v0);
        vec3.sub(v1, a2, a0);
        vec3.normalize(v1, v1);
        return Math.acos(vec3.dot(v0, v1));
    }

    computeBarycentricCellArea(idx: number): number {
        const [a0, a1, a2] = this.#selectPointByIndex(idx);
        const x0 = vec3.create(); // right
        const x1 = vec3.create(); // left
        const center = vec3.create();
        vec3.add(x0, a0, a1);
        vec3.scale(x0, x0, 0.5);
        vec3.add(x1, a0, a2);
        vec3.scale(x1, x1, 0.5);
        vec3.add(center, a0, a1);
        vec3.add(center, center, a2);
        vec3.scale(center, center, 1 / 3.0);
        const t0 = new Triangle(a0, center, x1);
        const t1 = new Triangle(a0, x0, center);
        const area0 = t0.computeArea();
        const area1 = t1.computeArea();
        return area0 + area1;

    }

    computeVoronoiCellArea(idx: number): number {
        //TODO
        return 0;
    }

    computeMixedVoronoiCellArea(idx: number): number {
        //TODO
        return 0;
    }
}

export class Ray {

    origin: vec3
    direct: vec3

    constructor(origin: vec3, direct: vec3) {
        this.origin = origin;
        this.direct = vec3.normalize(vec3.create(), direct);
    }

    crossTriangle(triangle: Triangle): RayCrossTriangleResult {

        const epsilon = 1E-6;
        const e1 = vec3.sub(vec3.create(), triangle.p1, triangle.p0);
        const e2 = vec3.sub(vec3.create(), triangle.p2, triangle.p0);
        const q = vec3.cross(vec3.create(), this.direct, e2);
        const a = vec3.dot(e1, q);
        if (Math.abs(a) < epsilon) {
            return {
                cross: false,
                point: null,
                distance: null,
                uvt: [0, 0, 0]
            }
        }
        const f = 1 / a;
        const s = vec3.sub(vec3.create(), this.origin, triangle.p0);
        const u = f * vec3.dot(s, q);
        if (u < 0.0) {
            return {
                cross: false,
                point: null,
                distance: null,
                uvt: [0, 0, 0]
            }
        }
        const r = vec3.cross(vec3.create(), s, e1);
        const v = f * vec3.dot(this.direct, r);
        if (v < 0.0 || u + v > 1.0) {
            return {
                cross: false,
                point: null,
                distance: null,
                uvt: [0, 0, 0]
            }
        }
        const t = f * vec3.dot(e2, r);

        const bp0 = vec3.scale(vec3.create(), triangle.p0, u);
        const bp1 = vec3.scale(vec3.create(), triangle.p1, v);
        const bp2 = vec3.scale(vec3.create(), triangle.p2, t);
        const cp = vec3.fromValues(0, 0, 0);
        vec3.add(cp, cp, bp0);
        vec3.add(cp, cp, bp1);
        vec3.add(cp, cp, bp2);

        const seg = vec3.sub(vec3.create(), cp, this.origin);
        const distance = vec3.length(seg);

        return {
            cross: true,
            point: cp,
            distance: distance,
            uvt: [u, v, t]
        }
    }

    distanceOfPoint(point: vec3): number {

        const A = this.origin;
        const D = this.direct;
        const P = point;
        const AP = vec3.sub(vec3.create(), P, A);
        const len = vec3.length(AP);
        const t = vec3.dot(vec3.normalize(vec3.create(), this.direct), vec3.normalize(vec3.create(), AP));


        if (t <= 0) {
            return len;
        } else {
            const sin = Math.sin(Math.acos(t));
            const distance = len * sin;
            return distance;
        }

    }

    dwithinPoint(point: vec3, dist: number): boolean {
        const distance = this.distanceOfPoint(point);

        return distance <= dist;
    }
}


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
                format: 'depth32float',
                depthWriteEnabled: true,
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

function pointTranslate(p: number[], dx: number, dy: number, dz: number): NumArr3 {
    return [p[0] + dx, p[1] + dy, p[2] + dz];
}

function pointOnSphere(r: number, a: number, b: number): NumArr3 {
    const x = r * Math.sin(b) * Math.cos(a);
    const y = r * Math.sin(b) * Math.sin(a);
    const z = r * Math.cos(b);
    return [x, y, z];
}

export function createSphere(radius: number = 1, xseg: number = 10, yseg: number = 10, center: NumArr3 = [0, 0, 0]) {

    const vertices = [];
    const normals = [];
    const texcoords = [];

    const alpha = 2 * Math.PI / xseg;
    const beta = Math.PI / yseg;

    for (let i = 0; i < xseg; ++i) {
        for (let j = 0; j < yseg; ++j) {
            const a0 = -Math.PI + i * alpha;
            const a1 = -Math.PI + (i + 1) * alpha;
            const b0 = -Math.PI / 2 + j * beta;
            const b1 = -Math.PI / 2 + (j + 1) * beta;

            const p0: NumArr3 = pointTranslate(pointOnSphere(radius, a0, Math.PI / 2 - b0), center[0], center[1], center[2]);
            const p1: NumArr3 = pointTranslate(pointOnSphere(radius, a1, Math.PI / 2 - b0), center[0], center[1], center[2]);
            const p2: NumArr3 = pointTranslate(pointOnSphere(radius, a1, Math.PI / 2 - b1), center[0], center[1], center[2]);
            const p3: NumArr3 = pointTranslate(pointOnSphere(radius, a0, Math.PI / 2 - b1), center[0], center[1], center[2]);

            const nv0 = vec3.subtract(vec3.create(), vec3.fromValues(...p0), vec3.fromValues(...center));
            const nv1 = vec3.subtract(vec3.create(), vec3.fromValues(...p1), vec3.fromValues(...center));
            const nv2 = vec3.subtract(vec3.create(), vec3.fromValues(...p2), vec3.fromValues(...center));
            const nv3 = vec3.subtract(vec3.create(), vec3.fromValues(...p3), vec3.fromValues(...center));

            vertices.push(...p0);
            normals.push(...nv0);
            texcoords.push((a0 + Math.PI) / (2 * Math.PI), (b0 + Math.PI / 2) / Math.PI);

            vertices.push(...p2);
            normals.push(...nv2);
            texcoords.push((a1 + Math.PI) / (2 * Math.PI), (b1 + Math.PI / 2) / Math.PI);

            vertices.push(...p3);
            normals.push(...nv3);
            texcoords.push((a0 + Math.PI) / (2 * Math.PI), (b1 + Math.PI / 2) / Math.PI);

            vertices.push(...p0);
            normals.push(...nv0);
            texcoords.push((a0 + Math.PI) / (2 * Math.PI), (b0 + Math.PI / 2) / Math.PI);

            vertices.push(...p1);
            normals.push(...nv1);
            texcoords.push((a1 + Math.PI) / (2 * Math.PI), (b0 + Math.PI / 2) / Math.PI);

            vertices.push(...p2);
            normals.push(...nv2);
            texcoords.push((a1 + Math.PI) / (2 * Math.PI), (b1 + Math.PI / 2) / Math.PI);
        }
    }

    return {
        hasIndices: false,
        nvertices: vertices.length / 3,
        verticeSize: 3,
        vertices: new Float32Array(vertices),
        normals: new Float32Array(normals),
        texcoords: new Float32Array(texcoords)
    }

}

function pointAtConeCircle(theta: number, height: number, radius: number): NumArr3 {
    const x = radius * Math.cos(theta);
    const y = radius * Math.sin(theta);
    const z = height;
    return [x, y, z];
}

function normalOnConeAtOrigin(p: NumArr3): vec3 {
    const vp = vec3.fromValues(...p);
    const vo = vec3.fromValues(0, 0, 0);
    const v1 = vec3.subtract(vec3.create(), vp, vo);
    const vc = vec3.fromValues(0, 0, p[2]);
    const va = vec3.subtract(vec3.create(), vc, vo);
    const vr = vec3.subtract(vec3.create(), vp, vc);
    const v2 = vec3.cross(vec3.create(), vr, va);
    const n = vec3.cross(vec3.create(), v1, v2);
    if (vec3.dot(n, vr) < 0) {
        vec3.negate(n, n);
    }
    vec3.normalize(n, n);
    return n;
}

export function createConeAtOrigin(radius = 1, height = 1, hseg = 10, vseg = 10) {
    const d_a = Math.PI * 2 / hseg;
    const d_h = height / vseg;
    const positions = [];
    const normals = [];
    const texcoords = [];
    //侧面
    for (let i = 0; i < hseg; ++i) {
        for (let j = 0; j < vseg; ++j) {
            const a0 = d_a * i;
            const a1 = d_a * (i + 1);
            const h0 = d_h * j;
            const h1 = d_h * (j + 1);
            const r0 = (h0 / height) * radius;
            const r1 = (h1 / height) * radius;
            //位置

            const p0 = pointAtConeCircle(a0, h0, r0);
            const p1 = pointAtConeCircle(a1, h0, r0);
            const p2 = pointAtConeCircle(a1, h1, r1);
            const p3 = pointAtConeCircle(a0, h1, r1);

            //法线
            const n2 = normalOnConeAtOrigin(p2);
            const n3 = normalOnConeAtOrigin(p3);
            let n0 = vec3.create();
            let n1 = vec3.create();
            if (h0 == 0) {
                n0 = n3;
                n1 = n2;
            } else {
                n0 = normalOnConeAtOrigin(p0);
                n1 = normalOnConeAtOrigin(p1);
            }

            //坐标
            const c0 = [i * 1.0 / hseg, j * 1.0 / hseg];
            const c1 = [(i + 1) * 1.0 / hseg, j * 1.0 / hseg];
            const c2 = [(i + 1) * 1.0 / hseg, (j + 1) * 1.0 / hseg];
            const c3 = [i * 1.0 / hseg, (j + 1) * 1.0 / hseg];

            positions.push(...p0, ...p2, ...p3);
            positions.push(...p0, ...p1, ...p2);
            normals.push(...n0, ...n2, ...n3);
            normals.push(...n0, ...n1, ...n2);
            texcoords.push(...c0, ...c2, ...c3);
            texcoords.push(...c0, ...c1, ...c2);
        }
    }

    //底面
    for (let i = 0; i < hseg; ++i) {
        const a0 = d_a * i;
        const a1 = d_a * (i + 1);
        const p0 = pointAtConeCircle(a0, height, radius);
        const p1 = pointAtConeCircle(a1, height, radius);
        const p2 = [0, 0, height];
        const n0 = [0, 0, 1];
        const n1 = [0, 0, 1];
        const n2 = [0, 0, 1];
        const c0 = [i * 1.0 / hseg, 0];
        const c1 = [(i + 1) * 1.0 / hseg, 0];
        positions.push(...p0, ...p1, ...p2);
        normals.push(...n0, ...n1, ...n2);
        texcoords.push(...c0, ...c1, ...c1);
    }

    return {
        hasIndices: false,
        nvertices: positions.length / 3,
        verticeSize: 3,
        vertices: new Float32Array(positions),
        normals: new Float32Array(normals),
        texcoords: new Float32Array(texcoords)
    }

}


