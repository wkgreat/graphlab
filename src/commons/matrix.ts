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

export function vec3_scale(v: vec3, s: number): vec3 {
    return vec3.scale(vec3.create(), v, s);
}

export function vec3_add(v0: vec3, v1: vec3): vec3 {
    return vec3.add(vec3.create(), v0, v1);
}

export function vec3_sub(v0: vec3, v1: vec3): vec3 {
    return vec3.sub(vec3.create(), v0, v1);
}

export function vec3_norm(v: vec3): vec3 {
    return vec3.normalize(vec3.create(), v);
}