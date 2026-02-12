import type { NumArr2 } from "../../defines";
import { mat3 } from "gl-matrix";
import { GLTFTextureInfo, type TGLTF } from "./gltf";

export const GLTFExtensions = {
    KHR_texture_transform: "KHR_texture_transform",
    KHR_materials_transmission: "KHR_materials_transmission"
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

    get data() {
        return {
            offset: this.offset,
            rotation: this.rotation,
            scale: this.scale
        }
    }

    static getDefaultData() {
        return {
            offset: [0, 0],
            rotation: 0,
            scale: [1, 1]
        }
    }
}

export interface GLTFKNRMaterialsTransmissionProps {
    transmissionFactor: number
    transmissionTexture?: TGLTF.ITextureInfo
}

export class GLTFKNRMaterialsTransmission {

    factor: number;
    texture?: GLTFTextureInfo

    constructor(json: GLTFKNRMaterialsTransmissionProps) {
        this.factor = json.transmissionFactor;
        if (json.transmissionTexture != null) {
            this.texture = new GLTFTextureInfo(json.transmissionTexture);
        }
    }
}