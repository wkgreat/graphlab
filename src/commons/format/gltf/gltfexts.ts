import type { NumArr2 } from "../../defines";
import { mat3 } from "gl-matrix";

export const GLTFExtensions = {
    KHR_texture_transform: "KHR_texture_transform"
} as const;
export type GLTFAttributres = typeof GLTFExtensions[keyof typeof GLTFExtensions];

export interface GLTFKNRTextureTransformProps {
    offset?: NumArr2
    rotation?: number
    scale?: NumArr2
    texCoord?: number
}

export class GLTFKNRTextureTransform {
    offset: NumArr2;
    rotation: number;
    scale: NumArr2;
    texcoord?: number;

    constructor(json: GLTFKNRTextureTransformProps) {
        this.offset = json.offset ?? [0, 0];
        this.rotation = json.rotation ?? 0;
        this.scale = json.scale ?? [1, 1];
        this.texcoord = json.texCoord;
    }

    get uniformObject() {
        return {
            offset: this.offset,
            rotation: this.rotation,
            scale: this.scale
        }
    }

    static getDefaultUniformObject() {
        return {
            offset: [0, 0],
            rotation: 0,
            scale: [1, 1]
        }
    }
}