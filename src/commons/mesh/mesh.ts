import { createBuffersAndAttributesFromArrays, makeShaderDataDefinitions, makeStructuredView, type BuffersAndAttributes, type ShaderDataDefinitions } from 'webgpu-utils';
import type { CanvasGPUInfo, GPUInfo } from '../webgpuUtils';
import code from '../shader/mesh.wgsl?raw';
import type Camera from '../camera';
import type Projection from '../projection';
import { mat4, vec3, vec4 } from 'gl-matrix';
import type Scene from '../scene';
import type { NumArr4 } from '../defines';
import { createSphere, Triangle, type Ray } from '../objects';
import { BlinnPhongMaterial } from '../material';

export type MeshColorMode = 'vertex' | 'face' | 'mesh'

interface MeshWebGPUOptions {
    depth: {
        depthBias: number,
        depthBiasSlopeScale: number
    }
}

export const MeshSelectMode = {
    NONE: 0,
    VERTEX: 1,
    FACE: 2,
    MESH: 3
} as const;

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
            kd: 0.8,
            diffuse: [1, 1, 1, 1],
            ks: 0.1,
            specular: [1, 1, 1, 1],
            phong: 2
        });
    }

    set wireframe(w: boolean) {
        this.#wireframe = w;
        this.refreshVertexBuffers();
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
        this.refreshDefaultVertexBuffer();
    }

    createDefaultWireframeColors() {
        const vertexCount = this.positions.length / 3;
        const color = [1, 0, 0, 1];
        this.wireframeColors = new Float32Array(Array(vertexCount).fill(color).flat());
    }

    setWireframeColor(color: NumArr4) {
        const vertexCount = this.positions.length / 3;
        if (Math.max(...color) > 1) {
            color = color.map(c => c / 255) as NumArr4;
        }
        this.wireframeColors = new Float32Array(Array(vertexCount).fill(color).flat());
        this.refreshWireframeVertexBuffer();
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
        }
    }) {
        this.#webgpu.gpuinfo = gpuinfo;
        this.#webgpu.canvasinfo = canvasinfo;
        this.#webgpu.definition = makeShaderDataDefinitions(code);

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

    refreshVertexBuffers() {

        this.refreshDefaultVertexBuffer();
        this.refreshWireframeVertexBuffer();
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

    selectedVertexMesh: Mesh | null = null;
    selectedFaceMesh: Mesh | null = null;
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

            // if (faceRef === 529) {
            //     debugger;
            // }


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

        if (this.selectedFaceMesh) {
            this.selectedFaceMesh.destroy();
            this.selectedFaceMesh = null;
        }
        if (this.selectedVertexMesh) {
            this.selectedVertexMesh.destroy();
            this.selectedVertexMesh = null;
        }

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

            this.#buildFacesMesh(faces.map(f => f.faceinfo.triangle));
        }

        for (const f of this.faceSelectCallbacks) {
            f(faces.map(f => f.faceinfo));
        }
    }

    #buildFacesMesh(faces: Triangle[]) {
        const positions = [];
        const indices = [];

        for (let i = 0; i < faces.length; ++i) {
            positions.push(...faces[i].p0)
            positions.push(...faces[i].p1)
            positions.push(...faces[i].p2)
            indices.push(i * 3, i * 3 + 1, i * 3 + 2);
        }
        this.selectedFaceMesh = new Mesh();
        this.selectedFaceMesh.positions = new Float32Array(positions);
        this.selectedFaceMesh.vertexIndices = new Uint32Array(indices);
        // this.selectedFaceMesh.setColor([255.0 / 255, 215.0 / 255, 0, 1]);
        this.selectedFaceMesh.setColor([0, 0, 1, 0.5]);
        this.selectedFaceMesh.setWireframeColor([1, 0, 0, 0.5]);
        this.selectedFaceMesh.setModelMatrix(mat4.create());
        this.selectedFaceMesh.wireframe = false;

        this.selectedFaceMesh.initWebGPU(this.mesh.render.gpuinfo, this.mesh.render.canvasInfo, this.mesh.render.scene, {
            depth: {
                depthBias: -1,
                depthBiasSlopeScale: -1
            }
        });
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

        if (this.selectedFaceMesh) {
            this.selectedFaceMesh.destroy();
            this.selectedFaceMesh = null;
        }
        if (this.selectedVertexMesh) {
            this.selectedVertexMesh.destroy();
            this.selectedVertexMesh = null;
        }

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

            const point = vertices[0].point;

            const sphere = createSphere(1, 10, 10, [point[0], point[1], point[2]]);
            const sphereMesh = new Mesh("sphere");
            sphereMesh.positions = sphere.vertices;
            sphereMesh.normals = sphere.normals;
            sphereMesh.texcoords = sphere.texcoords;
            sphereMesh.setColor([255.0 / 255, 215.0 / 255, 0, 1]);
            sphereMesh.setModelMatrix(mat4.create());
            this.selectedVertexMesh = sphereMesh;
            this.selectedVertexMesh.initWebGPU(this.mesh.render.gpuinfo, this.mesh.render.canvasInfo, this.mesh.render.scene, {
                depth: {
                    depthBias: -1,
                    depthBiasSlopeScale: -1
                }
            });

            if (this.mesh.selectVertexNRing === 0) {
                ;
            } else if (this.mesh.selectVertexNRing === 1) {
                const faces = this.getVertexOneRing(this.vertexList[minRef]);

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

                this.#buildFacesMesh(triangles);
            } else {
                console.warn("其他NRing暂时没实现");
            }

            for (const f of this.vertexSelectCallbacks) {
                f(vertices);
            }
        }
    }

    getVertexOneRing(vertex: HalfEdgeVertex): HalfEdgeFace[] {

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
            const nextHeRef = this.halfedgeMap.get(he.opposite).next;
            he = this.halfedgeMap.get(nextHeRef);
            if (nextHeRef === startHeRef) {
                break;
            }
        }

        return faces;

    }

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