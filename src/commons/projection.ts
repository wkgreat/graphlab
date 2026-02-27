import { mat4 } from "gl-matrix";

export type ProjectionChangeCallback = (projection: Projection) => void;

class Projection {

    #fovy: number = Math.PI / 3;
    #aspect: number = 1;
    #near: number = 0.1;
    #far: number = 1E10;

    #callbacks: Record<string, ProjectionChangeCallback[]> = {};

    on(event: string, f: ProjectionChangeCallback) {
        if (!(event in this.#callbacks)) {
            this.#callbacks[event] = [];
        }
        this.#callbacks[event].push(f);
    }

    fire(event: string) {
        if (event in this.#callbacks) {
            for (const f of this.#callbacks[event]) {
                f(this);
            }
        }
    }

    constructor(fovy: number, aspect: number, near: number, far: number) {
        this.#fovy = fovy;
        this.#aspect = aspect;
        this.#near = near;
        this.#far = far;
    }

    //TODO lazy calc
    get perspectiveMatrix(): mat4 {
        return mat4.perspectiveZO(mat4.create(), this.#fovy, this.#aspect, this.#near, this.#far);
    }

    get perspectiveMatrixZO(): mat4 {
        return mat4.perspectiveZO(mat4.create(), this.#fovy, this.#aspect, this.#near, this.#far);
    }

    get fovy(): number {
        return this.#fovy;
    }

    //TODO lazy calc
    get fovx(): number {
        const half_fovy = this.#fovy / 2;
        const t = Math.tan(half_fovy)
        const half_fovx = Math.atan(t * this.aspect)
        return 2 * half_fovx;
    }

    get near(): number {
        return this.#near;
    }

    get far(): number {
        return this.#far;
    }

    set aspect(aspect: number) {
        if (this.#aspect !== aspect) {
            this.#aspect = aspect;
            this.fire("change");
        }
    }

    get aspect(): number {
        return this.#aspect;
    }

};

export default Projection;