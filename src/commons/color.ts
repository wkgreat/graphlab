import type { NumArr4 } from "./defines";

export class Colors {
    // 1. 核心基础 (用于清除背景或最基础渲染)
    static white: NumArr4 = [1.0, 1.0, 1.0, 1.0];
    static black: NumArr4 = [0.0, 0.0, 0.0, 1.0];
    static red: NumArr4 = [1.0, 0.0, 0.0, 1.0];
    static green: NumArr4 = [0.0, 1.0, 0.0, 1.0];
    static blue: NumArr4 = [0.0, 0.0, 1.0, 1.0];
    static transparent: NumArr4 = [0.0, 0.0, 0.0, 0.0];

    // 2. 灰色系 (你的基础增加了一些中间调)
    static silver: NumArr4 = [0.9, 0.9, 0.9, 1.0];
    static lightGray: NumArr4 = [0.75, 0.75, 0.75, 1.0];
    static gray: NumArr4 = [0.5, 0.5, 0.5, 1.0];
    static darkGray: NumArr4 = [0.25, 0.25, 0.25, 1.0];

    // 3. 科技/霓虹系 (非常适合视锥体、法线可视化、雷达扫描效果)
    static cyan: NumArr4 = [0.0, 1.0, 1.0, 1.0];        // 青色
    static magenta: NumArr4 = [1.0, 0.0, 1.0, 1.0];     // 品红
    static neonGreen: NumArr4 = [0.22, 1.0, 0.08, 1.0]; // 荧光绿
    static electricBlue: NumArr4 = [0.0, 0.47, 1.0, 1.0]; // 电子蓝
    static hotPink: NumArr4 = [1.0, 0.05, 0.6, 1.0];    // 亮粉

    // 4. 自然/环境色系
    static forestGreen: NumArr4 = [0.13, 0.55, 0.13, 1.0];
    static seafoam: NumArr4 = [0.44, 0.9, 0.69, 1.0];
    static sand: NumArr4 = [0.76, 0.7, 0.5, 1.0];
    static deepSea: NumArr4 = [0.0, 0.1, 0.2, 1.0];

    // 5. 警示/功能系 (用于 Debug)
    static errorRed: NumArr4 = [1.0, 0.0, 0.0, 1.0];
    static warningYellow: NumArr4 = [1.0, 0.9, 0.0, 1.0];
    static successGreen: NumArr4 = [0.0, 0.8, 0.0, 1.0];
    static infoBlue: NumArr4 = [0.1, 0.6, 1.0, 1.0];

    // 6. 你原本的柔和与经典色 (补齐 Alpha)
    static skyBlue: NumArr4 = [0.53, 0.81, 0.92, 1.0];
    static orange: NumArr4 = [1.0, 0.65, 0.0, 1.0];
    static lime: NumArr4 = [0.75, 1.0, 0.0, 1.0];
    static purple: NumArr4 = [0.5, 0.0, 0.5, 1.0];
    static slate: NumArr4 = [0.27, 0.35, 0.39, 1.0];
    static gold: NumArr4 = [1.0, 0.84, 0.0, 1.0];
    static crimson: NumArr4 = [0.86, 0.08, 0.24, 1.0];


    static random(): NumArr4 {
        return [
            Math.random(),
            Math.random(),
            Math.random(),
            1
        ];
    }

    static mix(color0: NumArr4, color1: NumArr4, w: number): NumArr4 {
        return [
            (1 - w) * color0[0] + w * color1[0],
            (1 - w) * color0[1] + w * color1[1],
            (1 - w) * color0[2] + w * color1[2],
            (1 - w) * color0[3] + w * color1[3]
        ];
    }

};

export type ColorLike = Color | string | number[];

export default class Color {

    /**
     * red chennel (0-1)
    */
    r: number = 0;
    /**
     * green chennel (0-1)
    */
    g: number = 0;
    /**
     * blue chennel (0-1)
    */
    b: number = 0;
    /**
     * alpha chennel (0-1)
    */
    a: number = 0;

    /**
     * @param r red chennel (0-1)
     * @param g green chennel (0-1)
     * @param b blue chennel (0-1)
     * @param a alpha chennel (0-1)
    */
    constructor(r: number, g: number, b: number, a: number) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    clone(): Color {
        return new Color(this.r, this.g, this.b, this.a);
    }

    static of(c: ColorLike): Color | null {

        if (c instanceof Color) {
            return c.clone();
        } else if (typeof c === 'string') {
            const cl = extractRGBA(c);
            if (cl === null) {
                return null;
            } else {
                return new Color(cl[0] / 255.0, cl[1] / 255.0, cl[2] / 255.0, cl[3]);
            }
        } else {
            const len = c.length;
            let t: number[] = [];
            if (len > 4) {
                t = c.slice(0, 4);
            } else if (len < 4) {
                t = [...c];
                for (let a = len; a <= 4; ++a) {
                    t.push(0);
                }
            }
            const lst = t as NumArr4;
            if (lst[0] > 1 || lst[0] > 1 || lst[0] > 1) {
                lst[0] /= 255.0;
                lst[1] /= 255.0;
                lst[2] /= 255.0;
            }
            if (lst[0] < 0) lst[0] = 0;
            if (lst[1] < 0) lst[1] = 0;
            if (lst[2] < 0) lst[2] = 0;
            if (lst[3] < 0) lst[2] = 0;
            if (lst[3] > 1) lst[2] = 1;
            return new Color(lst[0], lst[1], lst[2], lst[3]);
        }
    }

    toHex() {
        const rgb = [this.r, this.g, this.b];
        return (
            '#' +
            rgb.map(value => {
                const hex = (value * 255).toString(16)  // covert 0-1 chennel value to hex
                return hex.length === 1 ? '0' + hex : hex; // add 0
            }).join('')
        );
    }

    setAlpha(a: number) {
        this.a = a;
    }

    mix(c: Color, w: number) {
        w = Math.max(w, 0.0);
        w = Math.min(w, 1.0);
        return new Color(
            this.r * (1 - w) + c.r * w,
            this.g * (1 - w) + c.g * w,
            this.b * (1 - w) + c.b * w,
            this.a * (1 - w) + c.a * w,
        );
    }

    toArray(): NumArr4 {
        return [this.r, this.g, this.b, this.a];
    }

    static random(): Color {
        return new Color(Math.random(), Math.random(), Math.random(), 1.0);
    }

    static interpolate(colors: ColorLike[], w: number): Color {

        const clrs = colors.map(c => Color.of(c));

        // 1. 边界处理
        if (clrs.length === 0) return new Color(0, 0, 0, 0);
        if (clrs.length === 1) return clrs[0];

        // 限制 w 的范围在 [0, 1] 之间
        const t = Math.max(0, Math.min(1, w));

        // 2. 计算 w 在颜色数组中的“虚拟索引”
        // 例如：4个颜色，索引范围是 0-3。w=0.5 时，scaledW = 1.5
        const scaledW = t * (clrs.length - 1);

        // 3. 找到当前位置前后的两个颜色索引
        const index = Math.floor(scaledW);
        const nextIndex = Math.min(index + 1, clrs.length - 1);

        // 4. 计算这两个颜色之间的局部权重 (0-1)
        const localWeight = scaledW - index;

        const c1 = clrs[index];
        const c2 = clrs[nextIndex];

        // 5. 对每个通道进行线性插值
        // 公式: Result = a + (b - a) * t
        return new Color(
            c1.r + (c2.r - c1.r) * localWeight,
            c1.g + (c2.g - c1.g) * localWeight,
            c1.b + (c2.b - c1.b) * localWeight,
            c1.a + (c2.a - c1.a) * localWeight
        );
    }

}

function extractRGBA(colorString: string): NumArr4 | null {
    if (!colorString || typeof colorString !== 'string') {
        return null;
    }

    const s = colorString.trim().toLowerCase();

    // --- 1. HEX 格式 (#RRGGBB, #RGB, #RRGGBBAA, #RGBA) ---
    // 匹配 3, 4, 6, 8 位的 HEX 格式
    const hexMatch = s.match(/^#?([0-9a-f]{3,8})$/i);
    if (hexMatch) {
        let hex = hexMatch[1] as string;

        // 扩展 3位/4位 简写 (e.g. #F00 -> #FF0000)
        if (hex.length === 3 || hex.length === 4) {
            hex = Array.from(hex).map(char => char + char).join('');
        }

        // 解析 R, G, B, A
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        // 检查是否有 Alpha (Hex 8位)
        let a = 1.0;
        if (hex.length === 8) {
            const alphaHex = hex.substring(6, 8);
            // 将 00-FF 转换为 0.0-1.0
            a = parseInt(alphaHex, 16) / 255;
        }

        return [r, g, b, a];
    }

    // --- 2. RGB 或 RGBA 格式 (rgb(...) / rgba(...) ) ---
    // 匹配 rgb/rgba 函数格式，提取括号内的内容
    const funcMatch = s.match(/^(rgb|rgba)\s*\(([^)]+)\)$/);

    if (funcMatch) {
        // 提取括号内的所有参数字符串
        const paramsStr = funcMatch[2] as string;

        // 尝试通过逗号或空格分割参数。处理如 "255, 0, 0, 0.5" 或 "255 0 0 / 0.5" 格式
        const values = paramsStr.split(/[,\s/]/)
            .map(v => v.trim())
            .filter(v => v.length > 0);

        // 颜色分量（R, G, B）
        const r = parseInt(values[0] as string, 10);
        const g = parseInt(values[1] as string, 10);
        const b = parseInt(values[2] as string, 10);

        // Alpha 分量（如果没有，则默认为 1.0）
        // 检查是否包含第四个值
        let a = 1.0;
        if (values.length >= 4) {
            // CSS 中的 Alpha 通常是 0.0 到 1.0 的浮点数
            a = parseFloat(values[3] as string);
        }

        // 基础验证：确保 R, G, B 在 0-255 范围内
        if (isNaN(r) || isNaN(g) || isNaN(b) || r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
            return null;
        }

        // 返回结果
        return [r, g, b, Math.min(1.0, Math.max(0.0, a))]; // 限制 Alpha 在 0-1 之间
    }

    // --- 3. 格式不匹配 ---
    return null;
}

export class ColorRamp {
    static VIRIDIS = ['#440154', '#3b528b', '#21908d', '#5dc963', '#fde725'];
    static MAGMA = ['#000004', '#3b0f70', '#8c2981', '#fe9f6d', '#fcfdbf'];
    static INFERNO = ['#000004', '#420a68', '#ae2891', '#f1605d', '#ffbd33'];
    static TRAFFIC = ['#52c41a', '#fadb14', '#ff4d4f'];
    static COOLWARN = ['#00d2ff', '#92fe9d', '#ff9a9e', '#f1c40f', '#e74c3c'];
    static CYBERPUNK = ['#00f2fe', '#4facfe', '#7367f0', '#ce9ffc'];
    static OCEAN = ['#2193b0', '#6dd5ed'];
    static SUNSET = ['#ff5f6d', '#ffc371'];
    static RD_BU = ['#d73027', '#f46d43', '#fdae61', '#ffffff', '#abd9e9', '#74add1', '#4575b4'];
}