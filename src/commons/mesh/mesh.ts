import { mat4, vec3, vec4 } from 'gl-matrix';
import { createBuffersAndAttributesFromArrays, makeShaderDataDefinitions, makeStructuredView, type BuffersAndAttributes, type ShaderDataDefinitions } from 'webgpu-utils';
import type Camera from '../camera';
import Color, { ColorRamp, Colors } from '../color';
import type { NumArr4 } from '../defines';
import { BlinnPhongMaterial } from '../material';
import { vec4t3 } from '../matrix';
import { createSphere, Triangle, type Ray } from '../objects';
import type Projection from '../projection';
import type Scene from '../scene';
import code from '../shader/mesh.wgsl?raw';
import type { CanvasGPUInfo, GPUInfo } from '../webgpuUtils';

export type MeshColorMode = 'vertex' | 'face' | 'mesh'

export const MeshRenderSpace = {
    WORLD: 0,
    NDC: 1
} as const;

export type MeshRenderSpace = typeof MeshRenderSpace[keyof typeof MeshRenderSpace];

export interface MeshWebGPUOptions {
    depth: {
        depthBias: number,
        depthBiasSlopeScale: number
    }
    space: MeshRenderSpace
}

export const MeshSelectMode = {
    NONE: 0,
    VERTEX: 1,
    FACE: 2,
    MESH: 3
} as const;

export type MeshSelectMode = typeof MeshSelectMode[keyof typeof MeshSelectMode];

export class Mesh {

    render: MeshRender | null = null;

    positions?: Float32Array
    normals?: Float32Array
    texcoords?: Float32Array

    vertexCount: number = 0;

    vertexIndices?: Uint32Array
    wireframeVertexIndices?: Uint32Array

    textureIndices?: Uint32Array
    textures?: string[]

    colors?: Float32Array
    colorMode?: MeshColorMode
    wireframeColors?: Float32Array

    #material: BlinnPhongMaterial;
    #lighting: boolean = true;
    #space: MeshRenderSpace = MeshRenderSpace.WORLD;

    label: string = "Mesh"
    modelmtx: mat4 = mat4.create();

    halfedge?: HalfEdgeInfo;

    #wireframe: boolean = false;

    #webgpu: {
        gpuinfo?: GPUInfo
        canvasinfo?: CanvasGPUInfo
        definition?: ShaderDataDefinitions
        module?: GPUShaderModule
        pipelines?: { [key: string]: GPURenderPipeline }
        buffers?: { [key: string]: BuffersAndAttributes }
        uniforms?: { [key: string]: GPUBuffer }
        textures?: { [key: string]: GPUTexture }
        samplers?: { [key: string]: GPUSampler }
    } = {}

    selectMode: number = MeshSelectMode.NONE;
    selectVertexNRing: number = 0;

    constructor(label?: string) {
        this.label = label ?? "Mesh";
        this.#webgpu.uniforms = {};
        this.#webgpu.pipelines = {};
        this.#webgpu.buffers = {};
        this.#webgpu.textures = {};
        this.#webgpu.samplers = {};
        this.modelmtx = mat4.create();

        this.#material = new BlinnPhongMaterial({
            ka: 0.1,
            ambient: [1, 1, 1, 1],
            kd: 1,
            diffuse: [0.1, 0.1, 0.1, 0],
            ks: 0.1,
            specular: [1, 1, 1, 1],
            phong: 1.5
        });
    }

    set wireframe(w: boolean) {
        this.#wireframe = w;
        this.refreshVertexBuffers();
    }

    set lighting(lighting: boolean) {
        this.#lighting = lighting;
    }

    get lighting(): boolean {
        return this.#lighting;
    }

    createDefaultColors() {
        const vertexCount = this.positions.length / 3;
        const color = [0, 1, 0, 1];
        this.colors = new Float32Array(Array(vertexCount).fill(color).flat());
    }

    setColor(color: NumArr4) {
        const vertexCount = this.positions.length / 3;
        if (Math.max(...color) > 1) {
            color = color.map(c => c / 255) as NumArr4;
        }
        this.colors = new Float32Array(Array(vertexCount).fill(color).flat());
        this.refreshDefaultVertexBuffer(true);
    }

    setColors(colors: NumArr4[]) {
        const vertexCount = this.positions.length / 3;
        const colorCount = colors.length;
        const colorData = new Float32Array(vertexCount * 4);
        for (let i = 0; i < vertexCount; ++i) {

            const color = colors[i % colorCount];
            colorData[i * 4] = color[0];
            colorData[i * 4 + 1] = color[1];
            colorData[i * 4 + 2] = color[2];
            colorData[i * 4 + 3] = color[3];

        }

        this.colors = colorData;
        this.refreshDefaultVertexBuffer(true);
    }

    createDefaultWireframeColors() {
        const vertexCount = this.positions.length / 3;
        const color = [0, 0, 0, 0.1];
        this.wireframeColors = new Float32Array(Array(vertexCount).fill(color).flat());
    }

    setWireframeColor(color: NumArr4) {
        const vertexCount = this.positions.length / 3;
        if (Math.max(...color) > 1) {
            color = color.map(c => c / 255) as NumArr4;
        }
        this.wireframeColors = new Float32Array(Array(vertexCount).fill(color).flat());
        this.refreshWireframeVertexBuffer(true);
    }

    get wireframe() {
        return this.#wireframe;
    }

    createHalfEdge() {
        this.halfedge = new HalfEdgeInfo(this);
    }

    initWebGPU(gpuinfo: GPUInfo, canvasinfo: CanvasGPUInfo, scene: Scene, options: MeshWebGPUOptions = {
        depth: {
            depthBias: 0,
            depthBiasSlopeScale: 0
        },
        space: MeshRenderSpace.WORLD
    }) {
        this.#webgpu.gpuinfo = gpuinfo;
        this.#webgpu.canvasinfo = canvasinfo;
        this.#webgpu.definition = makeShaderDataDefinitions(code);

        this.#space = options.space;

        this.render = new MeshRender(gpuinfo, canvasinfo, scene);

        this.vertexCount = this.positions.length / 3;

        this.refreshVertexBuffers();

        this.refreshUniforms(scene.camera, scene.projection);

        this.createPipelines(options);
    }

    createWireFrameVertexIndices() {

        if (this.vertexIndices) {
            if (!this.wireframeVertexIndices) {
                const vertexIndexLen = this.vertexIndices.length;
                this.wireframeVertexIndices = new Uint32Array(vertexIndexLen / 3 * 5);
                for (let i = 0; i < this.vertexIndices.length / 3; ++i) {

                    this.wireframeVertexIndices[i * 5] = this.vertexIndices[i * 3];
                    this.wireframeVertexIndices[i * 5 + 1] = this.vertexIndices[i * 3 + 1];
                    this.wireframeVertexIndices[i * 5 + 2] = this.vertexIndices[i * 3 + 2];
                    this.wireframeVertexIndices[i * 5 + 3] = this.vertexIndices[i * 3];
                    this.wireframeVertexIndices[i * 5 + 4] = 0xFFFFFFFF;

                }
            }
        }
    }

    setModelMatrix(modelmtx: mat4) {
        this.modelmtx = modelmtx;
    }

    refreshDefaultVertexBuffer(force: boolean = false) {
        if (!this.#webgpu.gpuinfo) {
            return;
        }

        const device = this.#webgpu.gpuinfo.device;

        if (force || !("default" in this.#webgpu.buffers)) {
            if (!this.colors) {
                this.createDefaultColors();
            }
            const oldBuffer = this.#webgpu.buffers.default;

            if (this.vertexIndices) {
                const newBuffer = createBuffersAndAttributesFromArrays(device, {
                    position: { data: this.positions, numComponents: 3 },
                    normal: { data: this.normals, numComponents: 3 },
                    texcoord: { data: this.texcoords, numComponents: 2 },
                    colors: { data: this.colors, numComponents: 4 },
                    indices: this.vertexIndices
                });
                this.#webgpu.buffers.default = newBuffer;
            } else {
                const newBuffer = createBuffersAndAttributesFromArrays(device, {
                    position: { data: this.positions, numComponents: 3 },
                    normal: { data: this.normals, numComponents: 3 },
                    texcoord: { data: this.texcoords, numComponents: 2 },
                    colors: { data: this.colors, numComponents: 4 }
                });
                this.#webgpu.buffers.default = newBuffer;
            }

            if (oldBuffer) {
                oldBuffer.buffers.forEach(b => b.destroy());
                if (oldBuffer.indexBuffer) {
                    oldBuffer.indexBuffer.destroy();
                }
            }
        }
    }

    refreshWireframeVertexBuffer(force: boolean = false) {
        if (!this.#webgpu.gpuinfo) {
            return;
        }

        const device = this.#webgpu.gpuinfo.device;

        if (force || !("wireframe" in this.#webgpu.buffers)) {

            this.createWireFrameVertexIndices();
            if (!this.wireframeColors) {
                this.createDefaultWireframeColors();
            }
            const oldBuffer = this.#webgpu.buffers.wireframe

            if (this.vertexIndices) {
                const newBuffer = createBuffersAndAttributesFromArrays(device, {
                    position: { data: this.positions, numComponents: 3 },
                    normal: { data: this.normals, numComponents: 3 },
                    texcoord: { data: this.texcoords, numComponents: 2 },
                    colors: { data: this.wireframeColors, numComponents: 4 },
                    indices: this.wireframeVertexIndices
                });
                this.#webgpu.buffers.wireframe = newBuffer;
            } else {
                const newBuffer = createBuffersAndAttributesFromArrays(device, {
                    position: { data: this.positions, numComponents: 3 },
                    normal: { data: this.normals, numComponents: 3 },
                    texcoord: { data: this.texcoords, numComponents: 2 },
                    colors: { data: this.wireframeColors, numComponents: 4 }
                });
                this.#webgpu.buffers.wireframe = newBuffer;
            }

            if (oldBuffer) {
                oldBuffer.buffers.forEach(b => b.destroy());
                if (oldBuffer.indexBuffer) {
                    oldBuffer.indexBuffer.destroy();
                }

            }
        }
    }

    refreshVertexBuffers(force: boolean = false) {

        this.refreshDefaultVertexBuffer(force);
        this.refreshWireframeVertexBuffer(force);
    }

    refreshUniforms(camera: Camera, projection: Projection) {

        const device = this.#webgpu.gpuinfo.device;

        this.render.scene.refreshUniform();

        //material
        const materialView = makeStructuredView(this.#webgpu.definition.uniforms.material);
        if (!("material" in this.#webgpu.uniforms)) {
            this.#webgpu.uniforms.material = device.createBuffer({
                label: `${this.label} material uniform`,
                size: materialView.arrayBuffer.byteLength,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
            });
        }
        materialView.set({
            blinnPhong: {
                ka: this.#material.ka,
                kd: this.#material.kd,
                ks: this.#material.ks,
                phong: this.#material.phong,
                ambient: this.#material.ambient,
                diffuse: this.#material.diffuse,
                specular: this.#material.specular
            }
        })

        device.queue.writeBuffer(this.#webgpu.uniforms.material, 0, materialView.arrayBuffer);

        //model
        const modelView = makeStructuredView(this.#webgpu.definition.uniforms.model);

        if (!("model" in this.#webgpu.uniforms)) {
            this.#webgpu.uniforms.model = device.createBuffer({
                label: `${this.label} model uniform`,
                size: modelView.arrayBuffer.byteLength,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
            });
        }
        modelView.set({
            hasnormal: this.normals ? 1 : 0,
            hastexcoord: this.texcoords ? 1 : 0,
            lighting: this.#lighting ? 1 : 0,
            space: this.#space,
            modelmtx: this.modelmtx,
            normalmtx: mat4.transpose(mat4.create(), mat4.invert(mat4.create(), this.modelmtx))
        });

        device.queue.writeBuffer(this.#webgpu.uniforms.model, 0, modelView.arrayBuffer);


    }

    createPipelines(options: MeshWebGPUOptions) {

        const device = this.#webgpu.gpuinfo.device;

        this.#webgpu.module = device.createShaderModule({
            label: this.label,
            code
        });

        const bindGroupLayout = device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                    buffer: { type: 'uniform' }
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                    buffer: { type: 'uniform' }
                }
            ]
        });

        const layout = device.createPipelineLayout({
            bindGroupLayouts: [
                this.render.scene.bindGroupLayout,
                bindGroupLayout
            ]
        });

        const descriptor: GPURenderPipelineDescriptor = {
            label: this.label,
            layout: layout,
            vertex: {
                module: this.#webgpu.module,
                buffers: this.#webgpu.buffers.default.bufferLayouts
            },
            fragment: {
                module: this.#webgpu.module,
                targets: [
                    {
                        format: this.#webgpu.canvasinfo.context.getConfiguration().format,
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
                cullMode: 'none',
                frontFace: 'ccw'
            },
            depthStencil: {
                format: 'depth32float',
                depthWriteEnabled: true,
                depthCompare: 'less-equal',
            }
        };

        descriptor.depthStencil.depthBias = options.depth.depthBias;
        descriptor.depthStencil.depthBiasSlopeScale = options.depth.depthBiasSlopeScale;
        this.#webgpu.pipelines["default"] = device.createRenderPipeline(descriptor);

        descriptor.vertex.buffers = this.#webgpu.buffers.wireframe.bufferLayouts;
        descriptor.primitive.topology = 'line-strip';
        descriptor.primitive.stripIndexFormat = 'uint32';
        descriptor.depthStencil.depthBias = 0;
        descriptor.depthStencil.depthBiasSlopeScale = 0;
        this.#webgpu.pipelines["wireframe"] = device.createRenderPipeline(descriptor);

    }

    draw(pass: GPURenderPassEncoder) {

        const device = this.render.gpuinfo.device;
        const scene = this.render.scene;
        this.refreshUniforms(scene.camera, scene.projection);

        const bindGroup = device.createBindGroup({
            layout: this.#webgpu.pipelines["default"].getBindGroupLayout(1),
            entries: [
                { binding: 0, resource: { buffer: this.#webgpu.uniforms.material } },
                { binding: 1, resource: { buffer: this.#webgpu.uniforms.model } }
            ]
        });

        if (this.wireframe) {
            const bufferInfo = this.#webgpu.buffers.wireframe;
            pass.setPipeline(this.#webgpu.pipelines["wireframe"]);
            pass.setBindGroup(0, this.render.scene.bindGroup);
            pass.setBindGroup(1, bindGroup);
            pass.setVertexBuffer(0, bufferInfo.buffers[0]);
            if (this.vertexIndices) {
                pass.setIndexBuffer(bufferInfo.indexBuffer, bufferInfo.indexFormat);
                pass.drawIndexed(bufferInfo.numElements);
            } else {
                pass.draw(this.vertexCount);
            }

        } else {
            const bufferInfo = this.#webgpu.buffers.default;
            pass.setPipeline(this.#webgpu.pipelines["default"]);
            pass.setBindGroup(0, this.render.scene.bindGroup);
            pass.setBindGroup(1, bindGroup);
            pass.setVertexBuffer(0, bufferInfo.buffers[0]);
            if (this.vertexIndices) {
                pass.setIndexBuffer(bufferInfo.indexBuffer, bufferInfo.indexFormat);
                pass.drawIndexed(bufferInfo.numElements);
            } else {
                pass.draw(this.vertexCount);
            }
        }

    }

    destroy() {
        Object.values(this.#webgpu.buffers).forEach(info => {
            info.buffers.forEach(b => b.destroy());
            if (info.indexBuffer) {
                info.indexBuffer.destroy();
            }
        })
        Object.values(this.#webgpu.uniforms).forEach(u => {
            u.destroy();
        })
        Object.values(this.#webgpu.textures).forEach(t => {
            t.destroy();
        })
    }

}

export type HalfEdgeRef = string;

// 顶点
export interface HalfEdgeVertex {
    ref: number
    position: number // 指向位置数组的索引
    halfedge?: HalfEdgeRef //某个从顶点出去的半边 halfedge数组中的索引 有些点可能没用上
}

// 面
export interface HalfEdgeFace {
    ref: number
    vertices: [number, number, number]
    halfedge: HalfEdgeRef // 其拥有的某个半边 
}

// 半边
export interface HalfEdge {
    vertexFrom: number // 其出发顶点的编号
    vertexTo: number // 其指向顶点的编号
    face?: number // 其相邻的面，如果是边界则为空
    next?: HalfEdgeRef // 相邻面的下一个半边
    prev?: HalfEdgeRef // 相邻面的上一个半边
    opposite?: HalfEdgeRef // 对立半边
}

export interface SelectFaceInfo {
    ref: number
    face: HalfEdgeFace,
    triangle: Triangle
}

export interface SelectVertexInfo {
    ref: number
    vertex: HalfEdgeVertex,
    point: vec3
}

type FaceSelectCallback = (info: SelectFaceInfo[]) => void;
type VertexSelectCallback = (info: SelectVertexInfo[]) => void;

export class HalfEdgeInfo {

    mesh: Mesh;

    vertexList: HalfEdgeVertex[] = []
    faceList: HalfEdgeFace[] = [];
    halfedgeMap: Map<HalfEdgeRef, HalfEdge> = new Map();

    selectedVertexMeshes: Mesh[] = [];
    selectedFaceMeshes: Mesh[] = [];
    faceSelectCallbacks: FaceSelectCallback[] = [];
    vertexSelectCallbacks: VertexSelectCallback[] = [];


    constructor(mesh: Mesh) {
        this.mesh = mesh;
        this.build();
    }

    build() {

        const vertexCount = this.mesh.positions.length / 3;
        for (let i = 0; i < vertexCount; ++i) {
            this.vertexList.push({
                ref: i,
                position: i * 3,
            });
        }


        //for each face
        for (let i = 0; i < this.mesh.vertexIndices.length / 3; ++i) {

            const vertex0 = this.mesh.vertexIndices[i * 3];
            const vertex1 = this.mesh.vertexIndices[i * 3 + 1];
            const vertex2 = this.mesh.vertexIndices[i * 3 + 2];

            const numFace = this.faceList.length;
            const faceRef = numFace;
            const edgeRef0: HalfEdgeRef = `${vertex0}-${vertex1}`;
            const edgeRef1: HalfEdgeRef = `${vertex1}-${vertex2}`;
            const edgeRef2: HalfEdgeRef = `${vertex2}-${vertex0}`;
            const oppEdgeRef0: HalfEdgeRef = `${vertex1}-${vertex0}`;
            const oppEdgeRef1: HalfEdgeRef = `${vertex2}-${vertex1}`;
            const oppEdgeRef2: HalfEdgeRef = `${vertex0}-${vertex2}`;


            if (this.halfedgeMap.has(edgeRef0) || this.halfedgeMap.has(edgeRef1) || this.halfedgeMap.has(edgeRef2)) {
                console.warn("HalfEdge 边有重叠");
            }

            this.vertexList[vertex0].halfedge = edgeRef0;
            this.vertexList[vertex1].halfedge = edgeRef1;
            this.vertexList[vertex2].halfedge = edgeRef2;

            // done
            this.halfedgeMap.set(edgeRef0, {
                vertexFrom: vertex0,
                vertexTo: vertex1,
                face: faceRef,
                next: edgeRef1,
                prev: edgeRef2,
                opposite: oppEdgeRef0
            });
            this.halfedgeMap.set(edgeRef1, {
                vertexFrom: vertex1,
                vertexTo: vertex2,
                face: faceRef,
                next: edgeRef2,
                prev: edgeRef0,
                opposite: oppEdgeRef1
            });
            this.halfedgeMap.set(edgeRef2, {
                vertexFrom: vertex2,
                vertexTo: vertex0,
                face: faceRef,
                next: edgeRef0,
                prev: edgeRef1,
                opposite: oppEdgeRef2
            });

            //done
            const face: HalfEdgeFace = {
                ref: faceRef,
                vertices: [vertex0, vertex1, vertex2],
                halfedge: edgeRef0
            }
            this.faceList.push(face);

        }

    }

    clearSelectedMeshes() {
        if (this.selectedFaceMeshes.length > 0) {
            this.selectedFaceMeshes.forEach(m => m.destroy());
            this.selectedFaceMeshes = [];
        }
        if (this.selectedVertexMeshes.length > 0) {
            this.selectedVertexMeshes.forEach(m => m.destroy());
            this.selectedVertexMeshes = [];
        }
    }

    addFaceSelectCallback(f: FaceSelectCallback) {
        this.faceSelectCallbacks.push(f);
    }

    addVertexSelectCallback(f: VertexSelectCallback) {
        this.vertexSelectCallbacks.push(f);
    }

    selectByRay(ray: Ray) {
        switch (this.mesh.selectMode) {
            case MeshSelectMode.NONE:
                break;
            case MeshSelectMode.VERTEX:
                this.getVerticesByRay(ray);
                break;
            case MeshSelectMode.FACE:
                this.getFracesByRay(ray);
                break;
            case MeshSelectMode.MESH:
                //TODO
                break;
        }
    }

    getFracesByRay(ray: Ray) {

        let faces = this.faceList.map((face, i) => {

            const points = face.vertices.map(v => {
                const posidx = this.vertexList[v].position;
                const p = this.mesh.positions.slice(posidx, posidx + 3);
                const v4 = vec4.transformMat4(
                    vec4.create(),
                    vec4.fromValues(p[0], p[1], p[2], 1),
                    this.mesh.modelmtx);
                const v3 = vec3.fromValues(v4[0], v4[1], v4[2]);
                return v3;
            })

            const r: SelectFaceInfo = {
                ref: i,
                face: face,
                triangle: new Triangle(points[0], points[1], points[2])
            };
            return r;

        }).map(t => ({
            faceinfo: t,
            crossinfo: ray.crossTriangle(t.triangle)
        })).filter(info => info.crossinfo.cross);

        this.clearSelectedMeshes();

        if (faces.length > 0) {

            let minD = Infinity;
            let minInfo = null;

            for (const info of faces) {
                const d = info.crossinfo.distance;
                if (d < minD) {
                    minD = d;
                    minInfo = info;
                }
            }

            faces = [minInfo];

            const faceMesh = this.#buildFacesMesh(faces.map(f => f.faceinfo.triangle));
            this.selectedFaceMeshes.push(faceMesh);
        }

        for (const f of this.faceSelectCallbacks) {
            f(faces.map(f => f.faceinfo));
        }
    }

    #buildFacesMesh(faces: Triangle[]): Mesh {
        const positions = [];
        const indices = [];

        for (let i = 0; i < faces.length; ++i) {
            positions.push(...faces[i].p0)
            positions.push(...faces[i].p1)
            positions.push(...faces[i].p2)
            indices.push(i * 3, i * 3 + 1, i * 3 + 2);
        }
        const mesh = new Mesh();
        mesh.positions = new Float32Array(positions);
        mesh.vertexIndices = new Uint32Array(indices);
        mesh.setColor([0, 0, 1, 0.5]);
        mesh.setWireframeColor([1, 0, 0, 0.5]);
        mesh.setModelMatrix(mat4.create());
        mesh.wireframe = false;

        mesh.initWebGPU(this.mesh.render.gpuinfo, this.mesh.render.canvasInfo, this.mesh.render.scene, {
            depth: {
                depthBias: -1,
                depthBiasSlopeScale: -1
            },
            space: MeshRenderSpace.WORLD
        });
        return mesh;
    }

    #buildVertexMesh(vertex: HalfEdgeVertex): Mesh {
        const pos = this.vertexPosition(vertex, true);
        const sphere = createSphere(0.2, 10, 10, [pos[0], pos[1], pos[2]]);
        const sphereMesh = new Mesh("sphere");
        sphereMesh.positions = sphere.vertices;
        sphereMesh.normals = sphere.normals;
        sphereMesh.texcoords = sphere.texcoords;
        sphereMesh.setColor([255.0 / 255, 215.0 / 255, 0, 1]);
        sphereMesh.setModelMatrix(mat4.create());
        this.selectedVertexMeshes.push(sphereMesh);
        sphereMesh.initWebGPU(this.mesh.render.gpuinfo, this.mesh.render.canvasInfo, this.mesh.render.scene, {
            depth: {
                depthBias: -1,
                depthBiasSlopeScale: -1
            },
            space: MeshRenderSpace.WORLD
        });
        return sphereMesh;
    }

    getVerticesByRay(ray: Ray) {

        let vertices = this.vertexList.map((v, i) => {
            const posidx = v.position;
            const p = this.mesh.positions.slice(posidx, posidx + 3);
            const v4 = vec4.transformMat4(
                vec4.create(),
                vec4.fromValues(p[0], p[1], p[2], 1),
                this.mesh.modelmtx);
            return {
                ref: i,
                vertex: v,
                point: vec3.fromValues(v4[0], v4[1], v4[2])
            };
        }).filter(v => ray.dwithinPoint(v.point, 1));

        this.clearSelectedMeshes();

        if (vertices.length > 0) {

            let minD = Infinity;
            let minIdx = 0;
            let minRef = 0;
            let minVertex = null;

            for (let i = 0; i < vertices.length; ++i) {
                const d = vec3.length(vec3.sub(vec3.create(), vertices[i].point, ray.origin));
                if (d < minD) {
                    minD = d;
                    minIdx = i;
                    minRef = vertices[i].ref;
                    minVertex = vertices[i];
                }
            }

            vertices = [minVertex];

            const vertex = this.vertexList[minRef];
            const vertexMesh = this.#buildVertexMesh(vertex);
            vertexMesh.setColor(Colors.red);
            this.selectedVertexMeshes.push(vertexMesh);

            if (this.mesh.selectVertexNRing === 0) {
                ;
            } else if (this.mesh.selectVertexNRing === 1) {
                const faces = this.getVertexOneRingFaces(this.vertexList[minRef]);

                const triangles = faces.map(face => {

                    const points = face.vertices.map(v => {
                        const posidx = this.vertexList[v].position;
                        const p = this.mesh.positions.slice(posidx, posidx + 3);
                        const v4 = vec4.transformMat4(
                            vec4.create(),
                            vec4.fromValues(p[0], p[1], p[2], 1),
                            this.mesh.modelmtx);
                        const v3 = vec3.fromValues(v4[0], v4[1], v4[2]);
                        return v3;
                    })

                    return new Triangle(points[0], points[1], points[2]);

                });

                const faceMesh = this.#buildFacesMesh(triangles);

                this.selectedFaceMeshes.push(faceMesh);

                const vertices = this.getVertexOneRingVertices(this.vertexList[minRef]);

                for (const v of vertices) {
                    const m = this.#buildVertexMesh(v);
                    this.selectedVertexMeshes.push(m);
                }


            } else {
                console.warn("其他NRing暂时没实现");
            }

            for (const f of this.vertexSelectCallbacks) {
                f(vertices);
            }
        }
    }

    getVertexOneRingFaces(vertex: HalfEdgeVertex): HalfEdgeFace[] {

        const faces: HalfEdgeFace[] = [];

        const heRef = vertex.halfedge;
        let he = this.halfedgeMap.get(heRef);
        const startHeRef = heRef;

        while (he) {

            if (he.face) {
                faces.push(this.faceList[he.face]);
            }
            if (!he.opposite) {
                console.log("HE: opposite is null");
                break;
            }
            const opp = this.halfedgeMap.get(he.opposite);
            if (!opp) {
                console.log("getVertexOneRing, opp is null!");
                break;
            }
            const nextHeRef = opp.next;
            he = this.halfedgeMap.get(nextHeRef);
            if (nextHeRef === startHeRef) {
                break;
            }
        }

        return faces;

    }

    getVertexOneRingVertices(vertex: HalfEdgeVertex): HalfEdgeVertex[] {

        const vertices: HalfEdgeVertex[] = [];

        const startHeRef = vertex.halfedge;
        let he = this.halfedgeMap.get(vertex.halfedge);
        while (he) {
            vertices.push(this.vertexList[he.vertexTo]);
            const opp = this.halfedgeMap.get(he.opposite);
            if (!opp) {
                break;
            }
            const nextHeRef = opp.next;
            const next = this.halfedgeMap.get(nextHeRef);
            if (!next) {
                break;
            }
            if (startHeRef === nextHeRef) {
                break;
            }
            he = next;
        }
        return vertices;
    }

    vertexPosition(vertex: HalfEdgeVertex, applyModelMatrix: boolean = false): vec3 {
        const p = this.mesh.positions.slice(vertex.position, vertex.position + 3);
        if (applyModelMatrix) {
            const v = vec4.fromValues(p[0], p[1], p[2], 1);
            vec4.transformMat4(v, v, this.mesh.modelmtx);
            return vec4t3(v);
        } else {
            return vec3.fromValues(p[0], p[1], p[2]);
        }

    }

    faceVertexIdx(vertex: HalfEdgeVertex, face: HalfEdgeFace): number {
        if (face.vertices[0] == vertex.ref) {
            return 0;
        }
        return face.vertices.findIndex(r => r === vertex.ref);
    }

    faceVertexIdxOppsiteEdge(face: HalfEdgeFace, edge: HalfEdge): number {
        const vref0 = edge.vertexFrom;
        const vref1 = edge.vertexTo;
        if (face.vertices.includes(vref0) && face.vertices.includes(vref1)) {
            return face.vertices.findIndex(r => r !== vref0 && r !== vref1);
        } else {
            console.warn("faceVertexIdxOppsiteEdge edge not belong to the face!");
            return -1;
        }
    }

    faceToTriangle(face: HalfEdgeFace): Triangle {
        const vertex0 = this.vertexList[face.vertices[0]];
        const vertex1 = this.vertexList[face.vertices[1]];
        const vertex2 = this.vertexList[face.vertices[2]];
        const p0 = this.mesh.positions.slice(vertex0.position, vertex0.position + 3);
        const p1 = this.mesh.positions.slice(vertex1.position, vertex1.position + 3);
        const p2 = this.mesh.positions.slice(vertex2.position, vertex2.position + 3);
        const v0 = vec3.fromValues(p0[0], p0[1], p0[2]);
        const v1 = vec3.fromValues(p1[0], p1[1], p1[2]);
        const v2 = vec3.fromValues(p2[0], p2[1], p2[2]);
        return new Triangle(v0, v1, v2);
    }

    computeFaceNormal(face: HalfEdgeFace) {
        const vertex0 = this.vertexList[face.vertices[0]];
        const vertex1 = this.vertexList[face.vertices[1]];
        const vertex2 = this.vertexList[face.vertices[2]];
        const position0 = this.mesh.positions.slice(vertex0.position, vertex0.position + 3);
        const position1 = this.mesh.positions.slice(vertex1.position, vertex1.position + 3);
        const position2 = this.mesh.positions.slice(vertex2.position, vertex2.position + 3);
        const v0 = vec4.fromValues(position0[0], position0[1], position0[2], 1.0);
        const v1 = vec4.fromValues(position1[0], position1[1], position1[2], 1.0);
        const v2 = vec4.fromValues(position2[0], position2[1], position2[2], 1.0);
        vec4.transformMat4(v0, v0, this.mesh.modelmtx);
        vec4.transformMat4(v1, v1, this.mesh.modelmtx);
        vec4.transformMat4(v2, v2, this.mesh.modelmtx);

        const e0 = vec3.sub(vec3.create(), v1, v0);
        const e1 = vec3.sub(vec3.create(), v2, v0);
        const n = vec3.cross(vec3.create(), vec4t3(e0), vec4t3(e1));
        vec3.scale(n, n, -1);
        vec3.normalize(n, n);
        return n;
    }

    computeNormals() {
        const normalData = new Float32Array(this.mesh.vertexCount * 3);
        for (const vertex of this.vertexList) {
            const faces = this.getVertexOneRingFaces(vertex);
            const faceNormals = [];
            for (const face of faces) {
                faceNormals.push(this.computeFaceNormal(face));
            }
            const normal = vec3.fromValues(0, 0, 0);
            for (const n of faceNormals) {
                vec3.add(normal, normal, n);
            }
            vec3.normalize(normal, normal);
            normalData[vertex.ref * 3] = normal[0];
            normalData[vertex.ref * 3 + 1] = normal[1];
            normalData[vertex.ref * 3 + 2] = normal[2];
        }
        this.mesh.normals = normalData;
        this.mesh.refreshVertexBuffers(true);
    }

    computeAveragingRegionArea(vertex: HalfEdgeVertex): number {
        const oneRingFaces = this.getVertexOneRingFaces(vertex);
        let regionArea = 0;
        for (const face of oneRingFaces) {
            const triangle = this.faceToTriangle(face);
            const idx = this.faceVertexIdx(vertex, face);
            if (idx === -1) {
                console.log("faceVertexIdx is -1");
                continue;
            }
            regionArea += triangle.computeBarycentricCellArea(idx);
        }
        return regionArea;
    }

    computeContagentLaplace(vertex: HalfEdgeVertex): vec3 {
        const regionArea = this.computeAveragingRegionArea(vertex);
        const oneRingVertices = this.getVertexOneRingVertices(vertex);

        const s3 = vec3.fromValues(0, 0, 0);
        for (const vert of oneRingVertices) {
            const edgeRef = `${vertex.ref}-${vert.ref}`;
            const edge = this.halfedgeMap.get(edgeRef);
            const opp = this.halfedgeMap.get(edge.opposite);
            if (!opp) {
                console.log("computeContagentLaplace vert opp is null!");
                continue;
            }
            const face0 = this.faceList[edge.face];
            const face1 = this.faceList[opp.face];
            const idx0 = this.faceVertexIdxOppsiteEdge(face0, edge);
            const idx1 = this.faceVertexIdxOppsiteEdge(face1, opp);
            const triangle0 = this.faceToTriangle(face0);
            const triangle1 = this.faceToTriangle(face1);
            const tan0 = Math.tan(triangle0.computeRadians(idx0));
            const tan1 = Math.tan(triangle1.computeRadians(idx1));
            const cot0 = 1 / tan0;
            const cot1 = 1 / tan1;
            const pos0 = this.vertexPosition(vertex);
            const pos1 = this.vertexPosition(vert);
            const v3 = vec3.sub(vec3.create(), pos1, pos0);
            vec3.scale(v3, v3, cot0 + cot1);
            vec3.add(s3, s3, v3);
        }
        const doubleArea = regionArea * 2;
        vec3.scale(s3, s3, 1 / doubleArea);

        return s3;

    }

    computeMeanCurvature(vertex: HalfEdgeVertex): number {
        const laplace = this.computeContagentLaplace(vertex);
        const mag = vec3.length(laplace);
        if (mag === 0) {
            return 0;
        }
        if (isNaN(mag)) {
            console.warn("laplace mag is NaN");
            return 0;
        }
        return 0.5 * mag;
    }

    renderAveraginRegionArea() {
        const areas = this.vertexList.map(v => this.computeAveragingRegionArea(v));
        const minArea = areas.reduce((a, b) => a < b ? a : b);
        const maxArea = areas.reduce((a, b) => a > b ? a : b);
        const weights = areas.map(c => (c - minArea) / (maxArea - minArea));
        const colors = weights.map(w => Color.interpolate(ColorRamp.COOLWARN, w).toArray());;
        // const colors = weights.map(w => Colors.mix(Colors.green, Colors.red, w));
        this.mesh.setColors(colors);
    }

    renderMeanCurvature() {
        const curvatures = this.vertexList.map(v => this.computeMeanCurvature(v));
        const minCurvature = curvatures.reduce((a, b) => a < b ? a : b);
        const maxCurvature = curvatures.reduce((a, b) => a > b ? a : b);
        let weights = curvatures.map(c => (c - minCurvature) / (maxCurvature - minCurvature));
        weights = weights.map(w => Math.pow(w, 0.3));
        const colors = weights.map(w => Color.interpolate(ColorRamp.COOLWARN, w).toArray());
        // const colors = weights.map(w => Colors.mix(Colors.green, Colors.red, w));
        this.mesh.setColors(colors);
    }

    computeGaussianCurvature() {}

    computePrincipalCuvature() {}

}

class MeshRender {
    gpuinfo: GPUInfo
    canvasInfo: CanvasGPUInfo
    scene: Scene

    constructor(gpuinfo: GPUInfo, canvasinfo: CanvasGPUInfo, scene: Scene) {
        this.gpuinfo = gpuinfo;
        this.canvasInfo = canvasinfo;
        this.scene = scene;
    }
}