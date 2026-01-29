import { vec3 } from "gl-matrix";
import type { NumArr3 } from "../defines";
import Mesh, { type MeshOptions } from "./mesh";

export interface ConeOptions extends MeshOptions {
    radius?: number
    height?: number
    hseg?: number
    vseg?: number
}

export default class Cone extends Mesh {

    #radius: number;
    #height: number;
    #hseg: number;
    #vseg: number;

    constructor(options: ConeOptions = {}) {
        super(options);
        this.#radius = options.radius ?? 1;
        this.#height = options.height ?? 1;
        this.#hseg = options.hseg ?? 10;
        this.#vseg = options.vseg ?? 10;

        this.buildCone();
    }

    #pointAtConeCircle(theta: number, height: number, radius: number): NumArr3 {
        const x = radius * Math.cos(theta);
        const y = radius * Math.sin(theta);
        const z = height;
        return [x, y, z];
    }

    #normalOnConeAtOrigin(p: NumArr3): vec3 {
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

    buildCone() {

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
                const a0 = d_a * i;
                const a1 = d_a * (i + 1);
                const h0 = d_h * j;
                const h1 = d_h * (j + 1);
                const r0 = (h0 / height) * radius;
                const r1 = (h1 / height) * radius;
                //位置

                const p0 = this.#pointAtConeCircle(a0, h0, r0);
                const p1 = this.#pointAtConeCircle(a1, h0, r0);
                const p2 = this.#pointAtConeCircle(a1, h1, r1);
                const p3 = this.#pointAtConeCircle(a0, h1, r1);

                //法线
                const n2 = this.#normalOnConeAtOrigin(p2);
                const n3 = this.#normalOnConeAtOrigin(p3);
                let n0 = vec3.create();
                let n1 = vec3.create();
                if (h0 == 0) {
                    n0 = n3;
                    n1 = n2;
                } else {
                    n0 = this.#normalOnConeAtOrigin(p0);
                    n1 = this.#normalOnConeAtOrigin(p1);
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
            const p0 = this.#pointAtConeCircle(a0, height, radius);
            const p1 = this.#pointAtConeCircle(a1, height, radius);
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

        this.positions = new Float32Array(positions);
        this.normals = new Float32Array(normals);
        this.texcoords = new Float32Array(texcoords);
        this.vertexIndices = null;

    }

}