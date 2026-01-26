import type { NumArr3, NumArr4 } from "./defines";

export default class PointLight {

    #position: NumArr3
    #color: NumArr4

    constructor(position: NumArr3, color: NumArr4) {
        this.#position = position;
        this.#color = color;
    }

    set position(position) {
        this.#position = position;
    }

    set color(color) {
        this.#color = color;
    }

    get position() {
        return this.#position;
    }

    get color() {
        return this.#color;
    }

}