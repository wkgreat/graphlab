import type { mat3 } from "@gltf-transform/core";
import type { NumArr3 } from "../defines";
import { vec3 } from "gl-matrix";
import { Ray } from "../objects";
import { vec3_norm } from "../matrix";

/**
        hl(high left)
              /``--__
             /       ``--__ high
            /             /         
           /             /
          /             /
    low  /             / b
         ``--__       /
            a  ``--__/
                     lr(low right)
    vlr: low->lr directional vector
*/

export default class Rectangle {

    name: string = "Rectangle";
    low: vec3;
    high: vec3;
    vlr: vec3; // low right direction vector

    constructor(name: string = "Rectangle", low: NumArr3 = [-1, -1, 0], hight: NumArr3 = [1, 1, 0], vlr: NumArr3 = [1, 0, 0]) {
        this.name = name;
        this.low = vec3.fromValues(...low);
        this.high = vec3.fromValues(...hight);
        this.vlr = vec3.fromValues(...vlr);
        vec3.normalize(this.vlr, this.vlr);
    }

    toTriagles() {
        const vlineDiag = vec3.sub(vec3.create(), this.high, this.low);
        const dot = vec3.dot(vec3_norm(vlineDiag), this.vlr);
        if (dot <= 1E-6) {
            console.warn("Rectangle, vlr is paralleled with diagonal!");
            return {
                positions: new Float32Array([]),
                normals: new Float32Array([]),
                texcoords: new Float32Array([])
            };
        }
        const a = vec3.dot(vlineDiag, this.vlr);
        const vlineA = vec3.scale(vec3.create(), this.vlr, a)
        const plr = vec3.add(vec3.create(), this.low, vlineA);
        const vlineB = vec3.sub(vec3.create(), vlineDiag, vlineA);
        const phl = vec3.add(vec3.create(), this.low, vlineB);
        const normal = vec3_norm(vec3.cross(vec3.create(), this.vlr, vlineDiag));

        const positions = [...this.low, ...plr, ...this.high, ...this.low, ...this.high, ...phl];
        const normals = [...normal, ...normal, ...normal, ...normal, ...normal, ...normal];
        const texcoords = [0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1];

        return {
            positions: new Float32Array(positions),
            normals: new Float32Array(normals),
            texcoords: new Float32Array(texcoords)
        }

    }

    getMeshData() {
        return this.toTriagles();
    }

}