import { vec3 } from "gl-matrix";

class PointLight {

    origin: vec3;
    color: vec3;

    constructor(origin: vec3, color: vec3) {
        this.origin = origin;
        this.color = color;
    }

}