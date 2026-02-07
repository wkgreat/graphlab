import type { NumArr4 } from "./defines";

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