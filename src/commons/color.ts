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
};