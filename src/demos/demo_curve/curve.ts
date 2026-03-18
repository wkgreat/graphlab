export interface Point {
    x: number
    y: number
    z: number
}

export function ptscale(p: Point, s: number): Point {
    return {
        x: p.x * s,
        y: p.y * s,
        z: p.z * s
    };
}

export function ptadd(p0: Point, p1: Point): Point {
    return {
        x: p0.x + p1.x,
        y: p0.y + p1.y,
        z: p0.z + p1.z
    };
}

export function ptdist(p0: Point, p1: Point): number {
    const dx2 = Math.pow(p0.x - p1.x, 2);
    const dy2 = Math.pow(p0.y - p1.y, 2);
    const dz2 = Math.pow(p0.z - p1.z, 2);
    return Math.sqrt(dx2 + dy2 + dz2);
}

interface CubicSpline1dInfo {
    h: number[]
    m: number[]
}

abstract class Curve {

    points: Point[];
    ts: number[];
    n: number;

    constructor(points: Point[]) {
        this.refreshPoints(points);
    }

    refreshPoints(points: Point[]) {
        this.points = points;
        this.n = this.points.length;
    }

    // 距离
    distance(p0: Point, p1: Point): number {
        return Math.sqrt(Math.pow(p0.x - p1.x, 2) + Math.pow(p0.y - p1.y, 2));
    }

    // 参数化
    parameterize(): number[] {
        const accDist = [0];
        for (let i = 1; i < this.points.length; ++i) {
            const d = this.distance(this.points[i - 1], this.points[i]);
            const a = accDist[accDist.length - 1];
            accDist.push(a + d);
        }
        const totd = accDist[accDist.length - 1];
        const ts = accDist.map(d => d / totd);
        this.ts = ts;
        return ts;
    }

    linspace(start: number, end: number, num: number) {
        const step = (end - start) / (num - 1);
        return Array.from({ length: num }, (_, i) => start + step * i);
    }

    abstract compute();
    abstract interpolate(npoints: number): Point[]

}

export class CubicSpline extends Curve {
    xinfo: CubicSpline1dInfo;
    yinfo: CubicSpline1dInfo;

    constructor(points: Point[]) {
        super(points);
        this.compute();
    }

    override compute() {
        if (this.n < 2) {
            return;
        }
        this.parameterize();
        const xs = this.points.map(p => p.x);
        const ys = this.points.map(p => p.y);
        this.xinfo = this.compute1d(this.ts, xs);
        this.yinfo = this.compute1d(this.ts, ys);
    }

    compute1d(x: number[], y: number[]): CubicSpline1dInfo {
        const n = x.length;

        const h = Array(n).fill(0);
        const b = Array(n).fill(0);
        const u = Array(n).fill(0);
        const v = Array(n).fill(0);

        for (let i = 0; i < n; ++i) {
            h[i] = i < n - 1 ? x[i + 1] - x[i] : 0;
            u[i] = i > 0 ? 2 * (h[i] + h[i - 1]) : 0;
            b[i] = i < n - 1 ? (6 / h[i]) * (y[i + 1] - y[i]) : 0;
            v[i] = i > 0 ? b[i] - b[i - 1] : 0;
        }

        const da = h.slice(1, n - 1);
        const db = u.slice(1, n - 1);
        const dc = [0, ...h.slice(1, n - 2)];
        const dd = v.slice(1, n - 1);

        let m = tdma(da, db, dc, dd);
        m = [0, ...m, 0];

        return { h, m };

    }

    override interpolate(npoints: number): Point[] {
        if (this.n < 2) {
            return [];
        }
        const ts = this.linspace(0, 1, npoints);
        const points = ts.map(t => this.interpolateAt(t));
        return points;
    }

    interpolateAt(t: number): Point | null {
        if (this.n < 2) {
            return null;
        }
        const xs = this.points.map(p => p.x);
        const ys = this.points.map(p => p.y);
        const x = this.interpolate1d(t, this.ts, xs, this.xinfo);
        const y = this.interpolate1d(t, this.ts, ys, this.yinfo);
        return { x, y, z: 0 };
    }

    interpolate1d(x: number, xs: number[], ys: number[], info: CubicSpline1dInfo): number {
        let i = 0;
        if (x < 0) {
            i = 0;
        } else if (x > 1) {
            i = this.n - 2;
        } else {
            for (let k = 0; k < this.n - 1; ++k) {
                if (x >= xs[k] && x <= xs[k + 1]) {
                    i = k;
                    break;
                }
            }
        }

        const dx0 = x - xs[i];
        const dx1 = xs[i + 1] - x;
        const m = info.m;
        const h = info.h;

        let s = 0;
        s += m[i] / (6 * h[i]) * Math.pow(dx1, 3);
        s += m[i + 1] / (6 * h[i]) * Math.pow(dx0, 3);
        s += (ys[i + 1] / h[i] - m[i + 1] * h[i] / 6) * dx0;
        s += (ys[i] / h[i] - m[i] * h[i] / 6) * dx1;

        return s;

    }
}

/**
 * 追赶法求解三对角矩阵
 * 
 * Ax = d;
 * A为三对角矩阵
 * a 为A的左对角线
 * b 为A的中心对角线
 * c 为A的右对角线
 * 
 */
export function tdma(a: number[], b: number[], c: number[], d: number[]): number[] {

    if (a.length === b.length - 1) {
        a = [0, ...a]; // 对齐
    }

    const n = b.length;
    const dc = Array(n).fill(0);
    const dd = Array(n).fill(0);
    const x = Array(n).fill(0);

    dc[0] = c[0] / b[0];
    dd[0] = d[0] / b[0];

    for (let i = 1; i < n; ++i) {
        const denom = b[i] - a[i] * dc[i - 1];
        dc[i] = i < n - 1 ? c[i] / denom : 0;
        dd[i] = (d[i] - a[i] * dd[i - 1]) / denom;
    }

    x[n - 1] = dd[n - 1];
    for (let i = n - 2; i >= 0; --i) {
        x[i] = dd[i] - dc[i] * x[i + 1];
    }

    return x;

}

export class BezierCurve extends Curve {

    constructor(points: Point[]) {
        super(points);
        this.compute();
    }

    factorial(n: number): number {
        if (n <= 1) {
            return 1;
        } else {
            let s = 1;
            for (let i = 1; i <= n; ++i) {
                s *= i;
            }
            return s;
        }
    }

    combination(n: number, i: number): number {
        if (i >= 0 && i <= n) {
            return this.factorial(n) / (this.factorial(n - i) * this.factorial(i));
        } else {
            return 0;
        }
    }

    bernstein(n: number, i: number, t: number) {
        const a = this.combination(n, i)
        const b = Math.pow(t, i)
        const c = Math.pow(1 - t, n - i);
        return a * b * c;
    }

    compute() {}

    interpolateAt(t: number): Point {
        return this.deCasteljauInterp(t);
    }

    // 标准基于公式的算法
    standardInterp(t: number): Point {
        let x: number = 0;
        let y: number = 0;
        const bs = [];
        for (let i = 0; i < this.n; ++i) {
            const b = this.bernstein(this.n - 1, i, t); // n个控制点，Bernstein基为n-1阶
            bs.push(b);
            x += b * this.points[i].x;
            y += b * this.points[i].y;
        }
        return { x, y, z: 0 };
    }

    // deCasteljau算法
    deCasteljauInterp(t: number): Point {
        const b: Point[] = [];
        for (const p of this.points) {
            b.push({ ...p });
        }
        for (let i = 1; i < this.n; ++i) {
            for (let j = 0; j < this.n - i; ++j) {
                b[j] = ptadd(ptscale(b[j], 1 - t), ptscale(b[j + 1], t));
            }
        }
        return b[0];
    }

    interpolate(npoints: number): Point[] {
        if (this.n < 2) {
            return [];
        }
        const ts = this.linspace(0, 1, npoints);
        const points = ts.map(t => this.interpolateAt(t));
        return points;
    }

}

export class BasisSpline extends Curve {

    degree: number;
    knotvector: number[];

    constructor(points: Point[], degree: number = 4) {
        super(points);
        this.degree = degree;
        this.compute();
    }

    computeKnotvector(): number[] {
        if (this.n < 2) {
            return;
        }
        const n = this.n - 1;
        const k = Math.min(this.degree, n);
        const m = n + k + 1;
        const v = Array(m + 1).fill(0);
        for (let i = 0; i <= k; ++i) {
            v[i] = 0;
        }
        for (let i = n + 1; i <= m; ++i) {
            v[i] = 1;
        }
        const s = 1 / (n + 1 - k);
        for (let i = k + 1; i <= n; ++i) {
            v[i] = v[i - 1] + s;
        }
        return v;
    }

    compute() {
        this.knotvector = this.computeKnotvector();
    }

    basis(i: number, k: number, t: number): number {
        const v = this.knotvector;
        if (k === 0) {
            if (t >= v[i] && t < v[i + 1]) {
                return 1;
            } else {
                return 0;
            }
        } else {
            const h0 = v[i + k] - v[i];
            const h1 = v[i + k + 1] - v[i + 1];
            const a0 = h0 === 0 ? 0 : (t - v[i]) / h0;
            const a1 = h1 === 0 ? 0 : (v[i + k + 1] - t) / h1;
            const n0 = this.basis(i, k - 1, t);
            const n1 = this.basis(i + 1, k - 1, t);
            return a0 * n0 + a1 * n1;
        }
    }

    interpolateAt(t: number): Point {

        const n = this.n - 1;
        const k = Math.min(this.degree, n);

        let p = { x: 0, y: 0, z: 0 };

        for (let i = 0; i <= n; ++i) {
            const b = this.basis(i, k, t);
            p = ptadd(p, ptscale(this.points[i], b));
        }
        return p;
    }

    interpolate(npoints: number): Point[] {

        if (this.n < 2) {
            return [];
        }
        const ts = this.linspace(0, 1 - 1E-6, npoints); // 注意b样条定义在[0,1) 所以不能取到1
        const points = ts.map(t => this.interpolateAt(t));
        return points;

    }

}

export class NurbsCurve extends BasisSpline {

    weights: number[];

    constructor(points: Point[], degree: number = 4) {
        super(points, degree);
        this.initWeights();
    }

    initWeights(): number[] {
        const ws = Array(this.n).fill(1.0);
        this.weights = ws;
        return ws;
    }

    override interpolateAt(t: number): Point {

        const n = this.n - 1;
        const k = Math.min(this.degree, n);
        const w = this.weights;

        let p = { x: 0, y: 0, z: 0 };
        let denom = 0;

        for (let i = 0; i <= n; ++i) {
            const b = this.basis(i, k, t);
            p = ptadd(p, ptscale(this.points[i], b));
            denom += b * w[i];
        }
        p = ptscale(p, 1 / denom);
        return p;
    }

}