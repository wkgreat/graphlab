import type { ChangeCallback, NumArr4 } from "./defines";

export interface BlinnPhongMaterialOptions {
    ka: number
    ambient: NumArr4
    kd: number
    diffuse: NumArr4
    ks: number
    specular: NumArr4
    phong: number
}

export class BlinnPhongMaterial {
    #ka: number
    #ambient: NumArr4
    #kd: number
    #diffuse: NumArr4
    #ks: number
    #specular: NumArr4
    #phong: number

    #callbacks: ChangeCallback<BlinnPhongMaterial>[] = [];

    constructor(options: BlinnPhongMaterialOptions) {
        this.#ka = options.ka;
        this.#ambient = options.ambient;
        this.#kd = options.kd;
        this.#diffuse = options.diffuse;
        this.#ks = options.ks;
        this.#specular = options.specular;
        this.#phong = options.phong;
    }

    addCallback(f: ChangeCallback<BlinnPhongMaterial>) {
        this.#callbacks.push(f);
    }

    invokeChange() {
        for (const f of this.#callbacks) {
            f(this);
        }
    }

    set ka(ka) {
        this.#ka = ka;
        this.invokeChange();
    }

    set ambient(ambient) {
        this.#ambient = ambient;
        this.invokeChange();
    }

    set kd(kd) {
        this.#kd = kd;
        this.invokeChange();
    }

    set diffuse(diffuse) {
        this.#diffuse = diffuse;
        this.invokeChange();
    }

    set ks(ks) {
        this.#ks = ks;
        this.invokeChange();
    }

    set specular(specular) {
        this.#specular = specular;
        this.invokeChange();
    }

    set phong(phong) {
        this.#phong = phong;
        this.invokeChange();
    }

    get ka() {
        return this.#ka;
    }

    get ambient() {
        return this.#ambient;
    }

    get kd() {
        return this.#kd;
    }

    get diffuse() {
        return this.#diffuse;
    }

    get ks() {
        return this.#ks;
    }

    get specular() {
        return this.#specular;
    }

    get phong() {
        return this.#phong;
    }

};