import type { NumArr4 } from "./defines";
import { type KTX2Container } from 'ktx-parse';

export interface CheckerBoardTextureOptions {
    device: GPUDevice,
    color1: NumArr4,
    color2: NumArr4,
    density: number
}

export interface CheckerBoardTextureInfo {
    texture: GPUTexture,
    sampler: GPUSampler,
}

export function createCheckerBoardTexture(options: CheckerBoardTextureOptions): CheckerBoardTextureInfo {

    const device = options.device;
    let color1: NumArr4 = options.color1;
    let color2: NumArr4 = options.color2;
    const density = Math.max(options.density - options.density % 2, 2);

    if (color1.every(x => x <= 1.0)) {
        color1 = color1.map(c => c * 255) as NumArr4;
        color1[3] = 255;
    }
    if (color2.every(x => x <= 1.0)) {
        color2 = color2.map(c => c * 255) as NumArr4;
        color2[3] = 255;
    }


    const width = density;
    const height = density;

    const arr: number[] = [];

    for (let x = 0; x < width; ++x) {
        for (let y = 0; y < height; ++y) {
            if ((x + y) % 2 === 0) {
                arr.push(...color1);
            } else {
                arr.push(...color2);
            }

        }
    }

    const textureData = new Uint8Array(arr);

    const texture = device.createTexture({
        format: 'rgba8unorm',
        size: [width, height, 1],
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_DST
    });

    device.queue.writeTexture(
        {
            texture: texture,
            mipLevel: 0,
            origin: { x: 0, y: 0, z: 0 }
        },
        textureData,
        {
            offset: 0,
            bytesPerRow: width * 4, //rgba
        },
        {
            width: width,
            height: height,
            depthOrArrayLayers: 1
        }

    )

    const sampler = device.createSampler({
        minFilter: 'nearest',
        magFilter: 'nearest',
        addressModeU: 'repeat',
        addressModeV: 'repeat'
    });

    return {
        texture,
        sampler
    }

}

export function createTexture2D(device: GPUDevice, source: ImageBitmap): GPUTexture {
    // 1. 确定格式：数据纹理用 rgba8unorm，颜色纹理用 rgba8unorm-srgb
    // 亮度偏高通常就是因为数据纹理错误使用了 -srgb
    const format: GPUTextureFormat = "rgba8unorm";

    const texture = device.createTexture({
        size: [source.width, source.height],
        format: format,
        usage:
            GPUTextureUsage.TEXTURE_BINDING |
            GPUTextureUsage.COPY_DST |
            GPUTextureUsage.RENDER_ATTACHMENT,
    });

    // 2. 将 ImageBitmap 写入纹理
    device.queue.copyExternalImageToTexture(
        {
            source: source,
            flipY: false
        },
        { texture: texture },
        [source.width, source.height]
    );

    return texture;
}

export function createTexture2DFromTypedArray(device: GPUDevice, data: Uint8Array, width: number, height: number): GPUTexture {
    const texture = device.createTexture({
        size: [width, height],
        format: 'rgba8unorm',
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
    });

    // 4. 将原始像素写入纹理
    device.queue.writeTexture(
        { texture },
        data.buffer, // 这里的 data 是 width * height * 4 的 RGBA 数组
        {
            offset: 0,
            bytesPerRow: width * 4, // writeTexture 接口不需要 256 字节对齐
            rowsPerImage: height,
        },
        [width, height]
    );

    return texture;
}

// 常用格式映射表 (Vulkan -> WebGPU)
const VK_FORMAT_MAP: Record<number, { format: GPUTextureFormat; bpp: number }> = {
    97: { format: 'rgba16float', bpp: 8 },   // VK_FORMAT_R16G16B16A16_SFLOAT
    109: { format: 'rgba32float', bpp: 16 },  // VK_FORMAT_R32G32B32A32_SFLOAT
    106: { format: 'rgba32float', bpp: 16 }, // VK_FORMAT_R32G32B32_SFLOAT
    37: { format: 'rgba8unorm', bpp: 4 },   // VK_FORMAT_R8G8B8A8_UNORM
    43: { format: 'rgba8unorm-srgb', bpp: 4 }, // VK_FORMAT_R8G8B8A8_SRGB
};

/**
 * 计算每一行需要的字节数，并处理 WebGPU 可能需要的对齐（若使用 copyBufferToTexture）
 * 这里使用 writeTexture，对齐要求相对宽松
 */
function getBytesPerRow(width: number, bpp: number): number {
    return width * bpp;
}

export function createCubeTextureFromKTX2(device: GPUDevice, ktx: KTX2Container, lable: string = "ktx2 cubemap"): GPUTexture {

    // 1. 自动检测格式
    const formatConfig = VK_FORMAT_MAP[ktx.vkFormat];
    if (!formatConfig) {
        throw new Error(`Unsupported KTX2 format: ${ktx.vkFormat}. You may need to add it to VK_FORMAT_MAP.`);
    }

    const { format, bpp } = formatConfig;
    const width = ktx.pixelWidth;
    const height = ktx.pixelHeight;
    const mipCount = ktx.levels.length;

    console.log(formatConfig);

    // 2. 创建 Cubemap 纹理
    const texture = device.createTexture({
        label: lable,
        size: [width, height, 6], // Cubemap 在 WebGPU 中深度为 6
        mipLevelCount: mipCount,
        format: format,
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
    });

    // 3. 遍历 Mipmaps 和 Faces 上传数据
    for (let level = 0; level < mipCount; level++) {
        const levelData = ktx.levels[level].levelData;
        const levelWidth = Math.max(1, width >> level);
        const levelHeight = Math.max(1, height >> level);

        // KTX2 立方体贴图每个 level 包含 6 个面，顺序为 +X, -X, +Y, -Y, +Z, -Z
        const faceSize = levelData.byteLength / 6;

        for (let face = 0; face < 6; face++) {
            const offset = face * faceSize;
            const dataView = new Uint8Array(
                levelData.buffer,
                levelData.byteOffset + offset,
                faceSize
            );

            device.queue.writeTexture(
                {
                    texture: texture,
                    mipLevel: level,
                    origin: [0, 0, face], // 重点：origin.z 代表 face 索引
                },
                dataView as unknown as BufferSource,
                {
                    offset: 0,
                    bytesPerRow: getBytesPerRow(levelWidth, bpp),
                    rowsPerImage: levelHeight,
                },
                [levelWidth, levelHeight]
            );
        }
    }

    return texture;
}