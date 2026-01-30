import { mat4, vec3, vec4 } from "gl-matrix";
import { createSphere, Triangle, type Ray } from "../objects";
import Mesh from "./mesh";
import { MeshSelectMode } from "./mesh";
import { RenderSpace } from "./object";
import Color, { ColorRamp, Colors } from "../color";
import { vec4t3 } from "../matrix";
import { clamp } from "../utils";

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

export default class HalfEdgeInfo {

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
        const mesh = new Mesh({
            render: {
                depth: {
                    depthBias: -1,
                    depthBiasSlopeScale: -1
                },
                space: RenderSpace.WORLD
            }
        });
        mesh.positions = new Float32Array(positions);
        mesh.vertexIndices = new Uint32Array(indices);
        mesh.setColor([0, 0, 1, 0.5]);
        mesh.setWireframeColor([1, 0, 0, 0.5]);
        mesh.setModelMatrix(mat4.create());
        mesh.wireframe = false;

        mesh.initWebGPU(this.mesh.render.gpuinfo, this.mesh.render.canvasInfo, this.mesh.render.scene);
        return mesh;
    }

    #buildVertexMesh(vertex: HalfEdgeVertex): Mesh {
        const pos = this.vertexPosition(vertex, true);
        const sphere = createSphere(0.2, 10, 10, [pos[0], pos[1], pos[2]]);
        const sphereMesh = new Mesh({
            label: "sphere",
            render: {
                depth: {
                    depthBias: -1,
                    depthBiasSlopeScale: -1
                },
                space: RenderSpace.WORLD
            }
        });
        sphereMesh.positions = sphere.vertices;
        sphereMesh.normals = sphere.normals;
        sphereMesh.texcoords = sphere.texcoords;
        sphereMesh.setColor([255.0 / 255, 215.0 / 255, 0, 1]);
        sphereMesh.setModelMatrix(mat4.create());
        this.selectedVertexMeshes.push(sphereMesh);
        sphereMesh.initWebGPU(this.mesh.render.gpuinfo, this.mesh.render.canvasInfo, this.mesh.render.scene);
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
                const oneRing = this.getVertexOneRingFaces(this.vertexList[minRef]);

                const triangles = oneRing.faces.map(face => {

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

    getVertexOneRingFaces(vertex: HalfEdgeVertex): {
        boundary: boolean
        faces: HalfEdgeFace[]
    } {

        const faces: HalfEdgeFace[] = [];

        const heRef = vertex.halfedge;
        let he = this.halfedgeMap.get(heRef);
        const startHeRef = heRef;

        let boundary = false;

        while (he) {

            if (he.face) {
                faces.push(this.faceList[he.face]);
            }
            if (!he.opposite) {
                console.log("HE: opposite is null");
                boundary = true;
                break;
            }
            const opp = this.halfedgeMap.get(he.opposite);
            if (!opp) {
                console.log("getVertexOneRing, opp is null!");
                boundary = true;
                break;
            }
            const nextHeRef = opp.next;
            he = this.halfedgeMap.get(nextHeRef);
            if (nextHeRef === startHeRef) {
                boundary = false;
                break;
            }
        }

        return {
            boundary,
            faces
        };

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
            const oneRing = this.getVertexOneRingFaces(vertex);
            const faceNormals = [];
            for (const face of oneRing.faces) {
                faceNormals.push(this.computeFaceNormal(face));
            }
            const normal = vec3.fromValues(0, 0, 0);
            for (const n of faceNormals) {
                vec3.add(normal, normal, n);
            }
            vec3.normalize(normal, normal);
            if (this.mesh.frontFace === 'cw') {
                vec3.negate(normal, normal);
            }
            normalData[vertex.ref * 3] = normal[0];
            normalData[vertex.ref * 3 + 1] = normal[1];
            normalData[vertex.ref * 3 + 2] = normal[2];
        }
        this.mesh.normals = normalData;
        this.mesh.refreshVertexBuffers(true);
    }

    computeAveragingRegionArea(vertex: HalfEdgeVertex): number {
        const oneRing = this.getVertexOneRingFaces(vertex);
        let regionArea = 0;
        for (const face of oneRing.faces) {
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

    computeGaussianCurvature(vertex: HalfEdgeVertex) {

        const area = this.computeAveragingRegionArea(vertex);

        const oneRing = this.getVertexOneRingFaces(vertex);

        let s = 0;

        if (oneRing.boundary) {
            return NaN;
        }

        for (const face of oneRing.faces) {

            const idx = this.faceVertexIdx(vertex, face);
            const triangle = this.faceToTriangle(face);
            s += triangle.computeRadians(idx);
        }

        if (area === 0) {
            return NaN;
        }

        return (Math.PI * 2 - s) / area;

    }

    renderGaussianCurvature() {
        const curvatures = this.vertexList.map(v => this.computeGaussianCurvature(v)).map(c => isNaN(c) ? 0 : clamp(c, -100000, 100000));
        const minCurvature = curvatures.filter(c => !isNaN(c)).reduce((a, b) => a < b ? a : b);
        const maxCurvature = curvatures.filter(c => !isNaN(c)).reduce((a, b) => a > b ? a : b);
        let weights = curvatures.map(c => isNaN(c) ? 0 : (c - minCurvature) / (maxCurvature - minCurvature));
        weights = weights.map(w => Math.pow(w, 2));
        const colors = weights.map(w => Color.interpolate(ColorRamp.COOLWARN, w).toArray());
        this.mesh.setColors(colors);
    }

    computePrincipalCuvature() {}

}