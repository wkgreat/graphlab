export class FPS {

    lastTime: number;
    fps: number = 0;
    delta: number = 1000;
    frameCount: number = 0;
    callbacks: ((fps: number) => void)[] = [];

    constructor() {
        this.lastTime = performance.now();
    }

    addCallback(f) {
        this.callbacks.push(f);
    }

    refresh() {
        this.frameCount++;
        const now = performance.now();
        if (now - this.lastTime >= this.delta) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastTime = now;
            for (const f of this.callbacks) {
                f(this.fps);
            }
        }
    }
}