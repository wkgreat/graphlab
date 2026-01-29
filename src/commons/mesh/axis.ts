import type { NumArr2, NumArr3, NumArr4 } from "../defines";
import type Scene from "../scene";
import type { CanvasGPUInfo, GPUInfo } from "../webgpuUtils";
import SimpleLine from "./simpleline";

export interface AxisOptions {
    xlim?: NumArr2;
    ylim?: NumArr2;
    zlim?: NumArr2;
    xcolor?: NumArr4;
    ycolor?: NumArr4;
    zcolor?: NumArr4;
}

export default class Axis {

    #xlim: NumArr2;
    #ylim: NumArr2;
    #zlim: NumArr2;
    #xcolor: NumArr4;
    #ycolor: NumArr4;
    #zcolor: NumArr4;
    #line: SimpleLine;

    constructor(options: AxisOptions) {

        this.#xlim = options.xlim ?? [0, 1];
        this.#ylim = options.ylim ?? [0, 1];
        this.#zlim = options.zlim ?? [0, 1];
        this.#xcolor = options.xcolor ?? [1, 0, 0, 1];
        this.#ycolor = options.ycolor ?? [0, 1, 0, 1];
        this.#zcolor = options.zcolor ?? [0, 0, 1, 1];

        this.#line = new SimpleLine({
            topology: 'line-list',
            positions: new Float32Array([
                this.#xlim[0], 0, 0, this.#xlim[1], 0, 0,
                0, this.#ylim[0], 0, 0, this.#ylim[1], 0,
                0, 0, this.#zlim[0], 0, 0, this.#zlim[1]
            ]),
            colors: new Float32Array([
                ...this.#xcolor, ...this.#xcolor,
                ...this.#ycolor, ...this.#ycolor,
                ...this.#zcolor, ...this.#zcolor,
            ]),
            indices: null
        });
    }

    initWebGPU(gpuinfo: GPUInfo, canvasinfo: CanvasGPUInfo, scene: Scene) {

        this.#line.initWebGPU(gpuinfo, canvasinfo, scene);

    }

    draw(pass: GPURenderPassEncoder) {
        this.#line.draw(pass);
    }
}