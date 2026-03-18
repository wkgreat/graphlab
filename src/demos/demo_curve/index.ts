import { Pane } from 'tweakpane';
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
import { BasisSpline, BezierCurve, CubicSpline, NurbsCurve, ptdist, type Point } from './curve';
import './styles.css';

type DrawMode = "NONE" | "DRAW" | "SELECT";

class CurveDemo {

    canvas: HTMLCanvasElement
    context: CanvasRenderingContext2D;
    resizeObserver: ResizeObserver;
    points: Point[] = []
    mode: DrawMode = 'DRAW';
    needNewMovePoint: boolean = true;

    cubicSpline?: CubicSpline;
    bezierCurve?: BezierCurve;
    basisSpline?: BasisSpline;
    nurbsCurve?: NurbsCurve;

    snapedPointIdx?: number;
    selectPointIdx?: number;

    pane: Pane = new Pane({
        title: "曲线选项"
    });

    paneParams = {
        mode: "绘制模式",
        linear: {
            enable: true,
            color: { r: 100, g: 100, b: 100 }
        },
        cubicSpline: {
            enable: true,
            npoints: 100,
            color: { r: 255, g: 0, b: 0 }
        },
        bezier: {
            enable: true,
            npoints: 100,
            color: { r: 0, g: 255, b: 0 }
        },
        basisSpline: {
            enable: true,
            npoints: 100,
            degree: 4,
            color: { r: 0, g: 0, b: 255 }
        },
        nurbs: {
            enable: true,
            npoints: 100,
            degree: 4,
            color: { r: 0, g: 255, b: 255 },
            weight: 1,
        }
    };

    constructor() {

        this.canvas = document.getElementById("demo-canvas") as HTMLCanvasElement | null;

        this.context = this.canvas.getContext("2d");

        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;

        this.resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                const canvas = entry.target as HTMLCanvasElement;
                canvas.width = canvas.clientWidth;
                canvas.height = canvas.clientHeight;
            }
            this.draw();
        });

        this.resizeObserver.observe(this.canvas);

        this.canvas.addEventListener("click", (e) => {
            if (this.mode === 'DRAW') {
                this.needNewMovePoint = true;
            } else if (this.mode === "SELECT") {
                this.selectPointIdx = this.snapedPointIdx;
                this.paneParams.nurbs.weight = this.nurbsCurve.weights[this.selectPointIdx];
                this.draw();
            }
        });

        this.canvas.addEventListener("mousemove", (e) => {

            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            if (this.mode === 'DRAW') {

                if (this.needNewMovePoint) {
                    this.needNewMovePoint = false;
                    const point = { x, y, z: 0 };
                    this.points.push(point);
                    console.log(this.points);
                }

                this.points[this.points.length - 1].x = x;
                this.points[this.points.length - 1].y = y;
                this.points[this.points.length - 1].z = 0;

                this.refreshCurves();

            } else if (this.mode === 'SELECT') {
                const idx = this.snapPoint(x, y, 5);
                this.snapedPointIdx = idx;
            }

            this.draw();
        });

        this.canvas.addEventListener("dblclick", (e) => {
            if (this.mode === "DRAW") {
                this.mode = "SELECT";
                this.paneParams.mode = "选择模式";
            } else if (this.mode === "SELECT") {
                this.mode = "DRAW";
                this.paneParams.mode = "绘制模式";
            }
        })

        this.pane.registerPlugin(EssentialsPlugin);
        this.setPane();


        this.points = [
            { "x": 147, "y": 234, "z": 0 }, { "x": 214, "y": 314, "z": 0 },
            { "x": 336, "y": 409, "z": 0 }, { "x": 452, "y": 408, "z": 0 },
            { "x": 594, "y": 351, "z": 0 }, { "x": 782, "y": 400, "z": 0 },
            { "x": 880, "y": 512, "z": 0 }, { "x": 879, "y": 624, "z": 0 },
            { "x": 855, "y": 697, "z": 0 }, { "x": 966, "y": 767, "z": 0 },
            { "x": 1086, "y": 699, "z": 0 }, { "x": 1170, "y": 588, "z": 0 }];
        this.refreshCurves();
        this.draw();
    }

    refreshCurves() {
        this.cubicSpline = new CubicSpline(this.points);
        this.bezierCurve = new BezierCurve(this.points);
        this.basisSpline = new BasisSpline(this.points, this.paneParams.basisSpline.degree);
        this.nurbsCurve = new NurbsCurve(this.points, this.paneParams.nurbs.degree);
    }

    drawPoint(p: Point, size: number = 10, color: string = "white") {

        this.context.fillStyle = color;
        this.context.fillRect(p.x - size / 2, p.y - size / 2, size, size);

    }

    snapPoint(x: number, y: number, d: number = 2): number {
        const m = { x, y, z: 0 };
        for (let i = 0; i < this.points.length; ++i) {
            if (ptdist(m, this.points[i]) <= d) {
                return i;
            }
        }
        return -1;
    }

    drawLinearInterp() {

        if (!this.paneParams.linear.enable) {
            return;
        }

        const color = this.paneParams.linear.color;
        this.context.strokeStyle = `rgb(${color.r},${color.g},${color.b})`;
        this.context.lineWidth = 1;

        if (this.points.length > 1) {
            this.context.beginPath();
            for (let i = 1; i < this.points.length; ++i) {
                const p0 = this.points[i - 1];
                const p1 = this.points[i];
                this.context.moveTo(p0.x, p0.y);
                this.context.lineTo(p1.x, p1.y);
                this.context.stroke();
            }
        }
    }

    drawCubicSpline() {

        if (!this.paneParams.cubicSpline.enable) {
            return;
        }

        if (this.cubicSpline == null) {
            return;
        }

        if (this.points.length < 2) {
            return;
        }

        const n = this.paneParams.cubicSpline.npoints;

        const interpPoints = this.cubicSpline.interpolate(n);

        if (interpPoints == null) {
            return;
        }

        const color = this.paneParams.cubicSpline.color;
        this.context.strokeStyle = `rgb(${color.r},${color.g},${color.b})`;
        this.context.lineWidth = 1;
        this.context.beginPath();
        for (let i = 0; i < n - 1; ++i) {
            const p0 = interpPoints[i];
            const p1 = interpPoints[i + 1];
            this.context.moveTo(p0.x, p0.y);
            this.context.lineTo(p1.x, p1.y);
            this.context.stroke();
        }

    }

    drawBezierCurve() {
        if (this.points.length < 2) {
            return;
        }
        if (!this.paneParams.bezier.enable) {
            return;
        }

        const n = this.paneParams.bezier.npoints;

        const interpPoints = this.bezierCurve.interpolate(n);

        if (interpPoints == null) {
            return;
        }

        const color = this.paneParams.bezier.color;
        this.context.strokeStyle = `rgb(${color.r},${color.g},${color.b})`;
        this.context.lineWidth = 1;

        this.context.beginPath();
        for (let i = 0; i < n - 1; ++i) {
            const p0 = interpPoints[i];
            const p1 = interpPoints[i + 1];
            this.context.moveTo(p0.x, p0.y);
            this.context.lineTo(p1.x, p1.y);
            this.context.stroke();
        }
    }

    drawBasisSpline() {
        if (this.points.length < 2) {
            return;
        }
        if (!this.paneParams.basisSpline.enable) {
            return;
        }

        const n = this.paneParams.basisSpline.npoints;

        const interpPoints = this.basisSpline.interpolate(n);

        if (interpPoints == null) {
            return;
        }

        const color = this.paneParams.basisSpline.color;
        this.context.strokeStyle = `rgb(${color.r},${color.g},${color.b})`;
        this.context.lineWidth = 1;

        this.context.beginPath();
        for (let i = 0; i < n - 1; ++i) {
            const p0 = interpPoints[i];
            const p1 = interpPoints[i + 1];
            this.context.moveTo(p0.x, p0.y);
            this.context.lineTo(p1.x, p1.y);
            this.context.stroke();
        }
    }

    drawNurbsCurve() {
        if (this.points.length < 2) {
            return;
        }
        if (!this.paneParams.nurbs.enable) {
            return;
        }

        const n = this.paneParams.nurbs.npoints;

        const interpPoints = this.nurbsCurve.interpolate(n);

        if (interpPoints == null) {
            return;
        }

        const color = this.paneParams.nurbs.color;
        this.context.strokeStyle = `rgb(${color.r},${color.g},${color.b})`;
        this.context.lineWidth = 1;

        this.context.beginPath();
        for (let i = 0; i < n - 1; ++i) {
            const p0 = interpPoints[i];
            const p1 = interpPoints[i + 1];
            this.context.moveTo(p0.x, p0.y);
            this.context.lineTo(p1.x, p1.y);
            this.context.stroke();
        }
    }

    render() {

        const width = this.canvas.width;
        const height = this.canvas.height;

        this.context.fillStyle = "black";

        this.context.fillRect(0, 0, width, height);

        for (const p of this.points) {
            this.drawPoint(p);
        }

        for (let i = 0; i < this.points.length; ++i) {
            const p = this.points[i];
            let color = 'rgb(100,100,100)';
            if (i === this.snapedPointIdx) {
                color = 'rgb(255,255,0)'
            }
            if (i === this.selectPointIdx) {
                color = 'rgb(255,0,255)'
            }
            this.drawPoint(p, 10, color);
        }

        this.drawLinearInterp();

        this.drawCubicSpline();

        this.drawBezierCurve();

        this.drawBasisSpline();

        this.drawNurbsCurve();


    }

    draw() {

        this.render();

    }

    setPane() {

        this.pane.on("change", (e) => {
            this.draw();
        });

        this.pane.addBinding(this.paneParams, "mode", {
            label: "当前模式",
            readonly: true,
        })

        const drawBlade = this.pane.addBlade({
            view: 'buttongrid',
            size: [3, 1],
            cells: (x, y) => ({
                title: [
                    ['绘制模式', '选择模式', '清空内容'],
                ][y][x],
            }),
        });
        (drawBlade as any).on("click", (ev) => {
            const [x, y] = ev.index;
            const funcs = [
                [
                    () => {
                        console.log("start draw");
                        this.mode = "DRAW";
                        this.paneParams.mode = "绘制模式";
                    },
                    () => {
                        console.log("close draw");
                        this.mode = "SELECT";
                        this.paneParams.mode = "选择模式";
                    },
                    () => {
                        console.log("clean draw");
                        this.points = [];
                        this.refreshCurves();
                        this.draw();
                    }
                ]
            ];
            funcs[y][x]();
        });

        const linearFolder = this.pane.addFolder({
            title: "线性插值"
        });

        linearFolder.addBinding(this.paneParams.linear, "enable", {
            label: "是否绘制"
        });

        linearFolder.addBinding(this.paneParams.linear, "color", {
            label: "曲线颜色"
        });

        const cubicSplineFolder = this.pane.addFolder({
            title: "三次样条曲线"
        });

        cubicSplineFolder.addBinding(this.paneParams.cubicSpline, "enable", {
            label: "是否绘制"
        });

        cubicSplineFolder.addBinding(this.paneParams.cubicSpline, "npoints", {
            label: "插值点数",
            min: 10,
            max: 1000,
            step: 1
        });

        cubicSplineFolder.addBinding(this.paneParams.cubicSpline, "color", {
            label: "曲线颜色"
        });

        const bezierFolder = this.pane.addFolder({
            title: "贝塞尔曲线"
        });

        bezierFolder.addBinding(this.paneParams.bezier, "enable", {
            label: "是否绘制"
        });

        bezierFolder.addBinding(this.paneParams.bezier, "npoints", {
            label: "插值点数",
            min: 10,
            max: 1000,
            step: 1
        });

        bezierFolder.addBinding(this.paneParams.bezier, "color", {
            label: "曲线颜色"
        });

        const basisSplineFolder = this.pane.addFolder({
            title: "B样条曲线"
        });

        basisSplineFolder.addBinding(this.paneParams.basisSpline, "enable", {
            label: "是否绘制"
        });

        basisSplineFolder.addBinding(this.paneParams.basisSpline, "degree", {
            label: "阶数(degree)",
            min: 1,
            max: 10,
            step: 1
        });

        basisSplineFolder.addBinding(this.paneParams.basisSpline, "npoints", {
            label: "插值点数",
            min: 10,
            max: 1000,
            step: 1
        });

        basisSplineFolder.addBinding(this.paneParams.basisSpline, "color", {
            label: "曲线颜色"
        });


        const nurbsFolder = this.pane.addFolder({
            title: "NURBS曲线"
        });

        nurbsFolder.addBinding(this.paneParams.nurbs, "enable", {
            label: "是否绘制"
        });

        nurbsFolder.addBinding(this.paneParams.nurbs, "degree", {
            label: "阶数(degree)",
            min: 1,
            max: 10,
            step: 1
        });

        nurbsFolder.addBinding(this.paneParams.nurbs, "npoints", {
            label: "插值点数",
            min: 10,
            max: 1000,
            step: 1
        });

        nurbsFolder.addBinding(this.paneParams.nurbs, "color", {
            label: "曲线颜色"
        });

        nurbsFolder.addBinding(this.paneParams.nurbs, "weight", {
            label: "选中点权重",
            min: 0,
            max: 2,
            step: 0.01
        }).on("change", (e) => {
            const w = e.value;
            if (this.nurbsCurve != null && this.selectPointIdx >= 0) {
                this.nurbsCurve.weights[this.selectPointIdx] = w;
            }
        });
    }

}

function main() {

    const demo = new CurveDemo();

    demo.draw();
}

main();