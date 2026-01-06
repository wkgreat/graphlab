import { vec3, vec4, mat4 } from "gl-matrix";

class Camera {

    from = vec4.fromValues(1, 1, 1, 1);
    to = vec4.fromValues(0, 0, 0, 1);
    up = vec4.fromValues(0, 1, 0, 0);
    viewMtx = mat4.create();
    invViewMtx = mat4.create();

    constructor(from: vec4, to: vec4, up: vec4) {
        this.setFrom(from);
        this.setTo(to);
        this.setUp(up);
    }

    setFrom(vin: vec3 | vec4) {
        this.setVector4(this.from, vin);
    }
    setTo(vin: vec3 | vec4) {
        this.setVector4(this.to, vin);
    }
    setUp(vin: vec3 | vec4) {
        this.setVector4(this.up, vin);
    }

    setVector4(vout: vec4, vin: vec3 | vec4) {
        const len = vin.length;
        if (len < 3) {
            console.log("len < 3");
        } else if (len == 3) {
            vec4.set(vout, vin[0], vin[1], vin[2], 1);
        } else {
            vec4.set(vout, vin[0], vin[1], vin[2], vin[3]!);
        }
    }

    _vec3(v: vec4) {
        return vec3.set(vec3.create(), v[0], v[1], v[2]);
    }

    _look() {
        mat4.lookAt(this.viewMtx, this._vec3(this.from), this._vec3(this.to), this._vec3(this.up));
        mat4.invert(this.invViewMtx, this.viewMtx);
    }

    getFrom(): vec4 {
        return this.from;
    }

    getMatrix() {
        this._look();
        return {
            viewMtx: this.viewMtx,
            invViewMtx: this.invViewMtx
        };
    }

    getViewMatrix() {
        this._look();
        return this.viewMtx;
    }

    getRelViewMatrix() {
        this._look();
        const f = vec3.fromValues(this.from[0], this.from[1], this.from[2]);
        const t = vec3.fromValues(this.to[0], this.to[1], this.to[2]);
        const u = vec3.fromValues(this.up[0], this.up[1], this.up[2]);
        const d = vec3.sub(vec3.create(), t, f);
        const m = mat4.lookAt(mat4.create(), vec3.fromValues(0, 0, 0), d, u);
        return m;
    }

    /**
     * @description 相机绕目标点(to)旋转
     * @param {number} dx x方向上旋转（绕y轴旋转）的角度
     * @param {number} dy y方向上旋转（绕x轴旋转）的角度
     * @returns {void}
    */
    round(dx: number, dy: number) {
        const viewFrom4 = vec4.transformMat4(vec4.create(), this.from, this.viewMtx);
        const viewTo4 = vec4.transformMat4(vec4.create(), this.to, this.viewMtx);
        const viewFrom3 = this._vec3(viewFrom4);
        const viewTo3 = this._vec3(viewTo4);

        vec3.rotateY(viewFrom3, viewFrom3, viewTo3, dx); // 绕Y轴旋转dx
        vec3.rotateX(viewFrom3, viewFrom3, viewTo3, dy); // 绕x轴旋转dy

        vec4.set(viewFrom4, viewFrom3[0], viewFrom3[1], viewFrom3[2], 1);
        vec4.transformMat4(this.from, viewFrom4, this.invViewMtx);

        this._look();
    }

    /**
     * @description 缩放（相机前进或后退）
     * @param {number} f 缩放系数 
    */
    zoom(f: number) {
        const d = vec4.create();
        vec4.sub(d, this.to, this.from);
        vec4.multiply(d, d, [f, f, f, f]);
        vec4.add(this.from, this.from, d);
        this._look();
    }

    /**
     * @description 相机平移
     * @param {number} dx x轴方向平移量
     * @param {number} dy y轴方向平移量
    */
    move(dx: number, dy: number) {

        const viewFrom4 = vec4.transformMat4(vec4.create(), this.from, this.viewMtx);
        const viewTo4 = vec4.transformMat4(vec4.create(), this.to, this.viewMtx);

        const mtx = mat4.create();
        mat4.translate(mtx, mtx, [dx, dy, 0]);
        vec4.transformMat4(viewFrom4, viewFrom4, mtx);
        vec4.transformMat4(viewTo4, viewTo4, mtx);

        vec4.transformMat4(this.from, viewFrom4, this.invViewMtx);
        vec4.transformMat4(this.to, viewTo4, this.invViewMtx);

        this._look();

    }

};

const LEFTBUTTON = 0;
const WHEELBUTTON = 1;
const RIGHTBUTTON = 2;

type MouseCallBack = (e: any) => void;

export class CameraMouseControl {

    camera: Camera;
    canvas: HTMLCanvasElement;
    leftButtonDown = false;
    wheelButtonDown = false;
    lastMouseX = 0;
    lastMouseY = 0;
    handleMouseDownFunc: MouseCallBack | null = null;
    handleMouseMoveFunc: MouseCallBack | null = null;
    handleMouseUpFunc: MouseCallBack | null = null;
    handleMouseLeaveFunc: MouseCallBack | null = null;
    handleMouseWheelFunc: MouseCallBack | null = null;

    /**
     * @param {Camera} camera
     * @param {HTMLElement} canvas  
    */
    constructor(camera: Camera, canvas: HTMLCanvasElement) {
        this.camera = camera;
        this.canvas = canvas;
    }

    handleMouseDown() {
        const that = this;
        return (e: any) => {
            if (e.button == LEFTBUTTON) {
                that.leftButtonDown = true;
            } else if (e.button == WHEELBUTTON) {
                that.wheelButtonDown = true;
            }
            that.lastMouseX = e.clientX;
            that.lastMouseY = e.clientY;

        }
    }

    handleMouseMove() {
        const that = this;
        return (e: any) => {
            if (this.leftButtonDown) {
                const dx = e.clientX - that.lastMouseX;
                const dy = e.clientY - that.lastMouseY;
                that.camera.round(-dx / 200, -dy / 200);
            } else if (this.wheelButtonDown) {
                e.preventDefault();
                const dx = e.clientX - that.lastMouseX;
                const dy = e.clientY - that.lastMouseY;
                that.camera.move(-dx / 5, dy / 5);
            }
            that.lastMouseX = e.clientX;
            that.lastMouseY = e.clientY;
        }
    }

    handleMouseUp() {
        const that = this;
        return (e: any) => {
            if (e.button == LEFTBUTTON) {
                that.leftButtonDown = false;
            }
            if (e.button == WHEELBUTTON) {
                that.wheelButtonDown = false;
            }
        }
    }

    handleMouseLeave() {
        const that = this;
        return (e: any) => {
            that.leftButtonDown = false;
            that.wheelButtonDown = false;
        }
    }

    handleMouseWheel() {
        const that = this;
        return (e: any) => {
            e.preventDefault();
            this.camera.zoom(e.wheelDeltaY / 120 * (1 / 10));
        }
    }

    enable() {
        this.handleMouseDownFunc = this.handleMouseDown();
        this.handleMouseMoveFunc = this.handleMouseMove();
        this.handleMouseUpFunc = this.handleMouseUp();
        this.handleMouseLeaveFunc = this.handleMouseLeave();
        this.handleMouseWheelFunc = this.handleMouseWheel();
        this.canvas.addEventListener('mousedown', this.handleMouseDownFunc);
        this.canvas.addEventListener('mousemove', this.handleMouseMoveFunc)
        this.canvas.addEventListener('mouseup', this.handleMouseUpFunc);
        this.canvas.addEventListener('mouseleave', this.handleMouseLeaveFunc);
        this.canvas.addEventListener('wheel', this.handleMouseWheelFunc);
    }
    disable() {
        this.canvas.removeEventListener('mousedown', this.handleMouseDownFunc as any);
        this.canvas.removeEventListener('mousemove', this.handleMouseMoveFunc as any)
        this.canvas.removeEventListener('mouseup', this.handleMouseUpFunc as any);
        this.canvas.removeEventListener('mouseleave', this.handleMouseLeaveFunc as any);
        this.canvas.removeEventListener('wheel', this.handleMouseWheelFunc as any);
        this.handleMouseDownFunc = null;
        this.handleMouseMoveFunc = null;
        this.handleMouseUpFunc = null;
        this.handleMouseLeaveFunc = null;
        this.handleMouseWheelFunc = null;
    }
};

export default Camera;