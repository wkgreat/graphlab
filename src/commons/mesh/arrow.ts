import { mat4 } from "gl-matrix";
import type { ConeOptions } from "./cone";
import Cone from "./cone";
import type { CylinderOptions } from "./cylinder";
import Cylinder from "./cylinder";
import Mesh, { type MeshOptions } from "./mesh";
import ArrayBufferUtils from "../arraybuffer";

export interface ArrowOptions extends MeshOptions {
    head?: ConeOptions,
    tail?: CylinderOptions
}

export default class Arrow extends Mesh {

    #headOpts: ConeOptions;
    #tailOpts: CylinderOptions;

    constructor(options: ArrowOptions = {}) {
        super(options);
        this.#headOpts = {};
        this.#tailOpts = {};
        options.head = options.head ?? {};
        options.tail = options.tail ?? {};
        this.#headOpts.height = options.head.height ?? 1;
        this.#headOpts.radius = options.head.radius ?? 1;
        this.#headOpts.hseg = options.head.hseg ?? 100;
        this.#headOpts.vseg = options.head.vseg ?? 100;
        this.#headOpts.label = "Arrow Head";
        this.#tailOpts.height = options.tail.height ?? 1;
        this.#tailOpts.radius = options.tail.radius ?? 0.5;
        this.#tailOpts.hseg = options.tail.hseg ?? 100;
        this.#tailOpts.vseg = options.tail.vseg ?? 100;
        this.#tailOpts.label = "Arrow Tail";

        this.buildArrow();
    }

    buildArrow() {

        const head = new Cone(this.#headOpts);
        const mtx = mat4.create();
        mat4.translate(mtx, mtx, [0, 0, this.#tailOpts.height + this.#headOpts.height]);
        mat4.scale(mtx, mtx, [1, 1, -1]);
        head.transform(mtx);

        const tail = new Cylinder(this.#tailOpts);

        this.positions = ArrayBufferUtils.concat(head.positions, tail.positions);
        this.normals = ArrayBufferUtils.concat(head.normals, tail.normals);
        this.texcoords = ArrayBufferUtils.concat(head.texcoords, tail.texcoords);

    }

}