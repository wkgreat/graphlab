import type { NumArr3 } from "../defines";

export class AABB {
    low: NumArr3;
    high: NumArr3;
    constructor(low: NumArr3 = [0, 0, 0], high: NumArr3 = [0, 0, 0]) {
        this.low = low;
        this.high = high;
    }

    addPoint(p: NumArr3 | Float32Array) {
        if (p[0] < this.low[0]) {
            this.low[0] = p[0];
        }
        if (p[0] > this.high[0]) {
            this.high[0] = p[0];
        }
        if (p[1] < this.low[1]) {
            this.low[1] = p[1];
        }
        if (p[1] > this.high[1]) {
            this.high[1] = p[1];
        }
        if (p[2] < this.low[2]) {
            this.low[2] = p[2];
        }
        if (p[2] > this.high[2]) {
            this.high[2] = p[2];
        }
    }

    get xmin() {
        return this.low[0];
    }

    get xmax() {
        return this.high[0];
    }

    get ymin() {
        return this.low[1];
    }

    get ymax() {
        return this.high[1];
    }

    get zmin() {
        return this.low[2];
    }

    get zmax() {
        return this.high[2];
    }
}