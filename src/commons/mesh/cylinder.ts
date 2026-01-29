import { vec3 } from "gl-matrix";
import type { NumArr3 } from "../defines";
import Mesh, { type MeshOptions } from "./mesh";

export interface CylinderOptions extends MeshOptions {
    radius?: number
    height?: number
    hseg?: number
    vseg?: number
}

export default class Cylinder extends Mesh {

    #radius: number;
    #height: number;
    #hseg: number;
    #vseg: number;

    constructor(options: CylinderOptions = {}) {
        super(options);
        this.#radius = options.radius ?? 1;
        this.#height = options.height ?? 1;
        this.#hseg = options.hseg ?? 10;
        this.#vseg = options.vseg ?? 10;

        this.buildCylinder();
    }

    #pointAt(theta: number, height: number, radius: number): NumArr3 {
        const x = radius * Math.cos(theta);
        const y = radius * Math.sin(theta);
        const z = height;
        return [x, y, z];
    }

    buildCylinder() {

        const radius = this.#radius;
        const height = this.#height;
        const hseg = this.#hseg;
        const vseg = this.#vseg;

        const d_a = Math.PI * 2 / hseg;
        const d_h = height / vseg;
        const positions = [];
        const normals = [];
        const texcoords = [];

        //侧面
        for (let i = 0; i < hseg; ++i) {
            for (let j = 0; j < vseg; ++j) {
                const a0 = d_a * i; // 弧点0
                const a1 = d_a * (i + 1); // 弧点1
                const h0 = d_h * j; // 高度0
                const h1 = d_h * (j + 1); // 高度1
                //位置

                const p0 = this.#pointAt(a0, h0, this.#radius);
                const p1 = this.#pointAt(a1, h0, this.#radius);
                const p2 = this.#pointAt(a1, h1, this.#radius);
                const p3 = this.#pointAt(a0, h1, this.#radius);

                //法线
                const n0 = [p0[0], p0[1], 0];
                const n1 = [p1[0], p1[1], 0];
                const n2 = [p2[0], p2[1], 0];
                const n3 = [p3[0], p3[1], 0];

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

        //底面与顶面
        for (let i = 0; i < hseg; ++i) {
            const a0 = d_a * i;
            const a1 = d_a * (i + 1);
            const p0 = this.#pointAt(a0, height, radius);
            const p1 = this.#pointAt(a1, height, radius);
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
        for (let i = 0; i < hseg; ++i) {
            const a0 = d_a * i;
            const a1 = d_a * (i + 1);
            const p0 = this.#pointAt(a0, 0, radius);
            const p1 = this.#pointAt(a1, 0, radius);
            const p2 = [0, 0, 0];
            const n0 = [0, 0, -1];
            const n1 = [0, 0, -1];
            const n2 = [0, 0, -1];
            const c0 = [i * 1.0 / hseg, 0];
            const c1 = [(i + 1) * 1.0 / hseg, 0];
            positions.push(...p0, ...p1, ...p2);
            normals.push(...n0, ...n1, ...n2);
            texcoords.push(...c0, ...c1, ...c1);
        }

        this.positions = new Float32Array(positions);
        this.normals = new Float32Array(normals);
        this.texcoords = new Float32Array(texcoords);
        this.vertexIndices = null;

    }

}