import { mat4, vec3, type vec4 } from "gl-matrix";

export function vec4t3(v: vec4) {
    return vec3.fromValues(v[0], v[1], v[2]);
}

export function normalMatrix(mtx: mat4) {
    const out = mat4.create();
    mat4.invert(out, mtx);
    mat4.transpose(out, out);
    return out;
}