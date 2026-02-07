import jpeg from 'jpeg-js';
import UPNG from 'upng-js';

export interface ImageDataInfo {
    data: Uint8Array,
    width: number,
    height: number
}

function isPNG(bytes: Uint8Array): boolean {
    return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47;
}

function isJPG(bytes: Uint8Array): boolean {
    return bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF;
}

export function resolveImageData(buffer: ArrayBuffer): ImageDataInfo {
    const bytes = new Uint8Array(buffer);
    if (isJPG(bytes)) {
        return loadJPGImageData(buffer);
    } else if (isPNG(bytes)) {
        return loadPNGImageData(buffer);
    } else {
        throw Error("wrong image format");
    }
}

export function loadJPGImageData(buffer: ArrayBuffer): ImageDataInfo {
    const rawImageData = jpeg.decode(buffer, { useTArray: true });
    return {
        data: rawImageData.data,
        width: rawImageData.width,
        height: rawImageData.height
    };
}

export function loadPNGImageData(buffer: ArrayBuffer): ImageDataInfo {
    const img = UPNG.decode(buffer);
    const data = new Uint8Array(UPNG.toRGBA8(img)[0]);
    return {
        data,
        width: img.width,
        height: img.height
    };
}