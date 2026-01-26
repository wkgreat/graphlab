import { vec3, type vec4 } from "gl-matrix";

export function vec4t3(v: vec4) {
    return vec3.fromValues(v[0], v[1], v[2]);
}