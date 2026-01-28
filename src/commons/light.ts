import type { BindingApi } from "@tweakpane/core";
import type { FolderApi, Pane } from "tweakpane";
import type { NumArr3, NumArr4 } from "./defines";

export default class PointLight {

    #position: NumArr3
    #color: NumArr4

    #helper: PointLightHelper | null = null;

    constructor(position: NumArr3, color: NumArr4) {
        this.#position = position;
        this.#color = color;
    }

    set position(position: NumArr3) {
        this.#position = position;
    }

    set color(color: NumArr4) {
        this.#color = color;
    }

    get position() {
        return this.#position;
    }

    get color() {
        return this.#color;
    }

    set x(x: number) {
        this.#position[0] = x;
    }

    set y(y: number) {
        this.#position[1] = y;
    }

    set z(z: number) {
        this.#position[2] = z;
    }

    addHelper(pane: Pane | FolderApi, folder?: { create: boolean, title: string, expanded: boolean }) {
        if (!this.#helper) {
            this.#helper = new PointLightHelper(pane, this, folder);
        }
    }

}

export class PointLightHelper {

    params = {
        position: { x: 0, y: 0, z: 0 },
        color: { r: 255, g: 255, b: 255, a: 1 }
    };

    pane: Pane | FolderApi;
    folder: FolderApi | null = null;

    light: PointLight;

    bindx: BindingApi;
    bindy: BindingApi;
    bindz: BindingApi;
    bindcolor: BindingApi;

    constructor(pane: Pane | FolderApi, light: PointLight, folder?: { create: boolean, title: string, expanded: boolean }) {

        this.pane = pane;
        this.light = light;

        this.params = {
            position: {
                x: this.light.position[0],
                y: this.light.position[1],
                z: this.light.position[2],
            },
            color: {
                r: this.light.color[0] * 255,
                g: this.light.color[1] * 255,
                b: this.light.color[2] * 255,
                a: this.light.color[3] * 255,
            }
        }

        let curPane: Pane | FolderApi = this.pane;

        if (folder && folder.create) {
            this.folder = pane.addFolder({
                title: folder.title,
                expanded: folder.expanded
            });
            curPane = this.folder;
        }

        this.bindx = curPane.addBinding(this.params.position, "x", {
            label: "position x",
            min: -500, max: 500, step: 1
        }).on("change", (e) => {
            this.light.x = e.value;
        })
        this.bindy = curPane.addBinding(this.params.position, "y", {
            label: "position y",
            min: -500, max: 500, step: 1
        }).on("change", (e) => {
            this.light.y = e.value;
        })
        this.bindz = curPane.addBinding(this.params.position, "z", {
            label: "position z",
            min: -500, max: 500, step: 1
        }).on("change", (e) => {
            this.light.z = e.value;
        })

        this.bindcolor = curPane.addBinding(this.params, "color", {
            label: "color"
        }).on("change", (e) => {
            const newcolor: NumArr4 = [
                e.value.r / 255,
                e.value.g / 255,
                e.value.b / 255,
                e.value.a
            ]
            this.light.color = newcolor;
        })

    }

}