import { type GLTF as TGLTF, type Extension as TGLTFExtension } from '@gltf-transform/core';
import { mat4, quat, vec3 } from "gl-matrix";
import { createTextureFromSource } from 'webgpu-utils';
import type { NumArr16, NumArr3, NumArr4 } from '../../defines';
import RenderObject, { type RenderObjectOptions, type RenderObjectWebGPU } from '../../mesh/object';
import type Scene from '../../scene';
import type { CanvasGPUInfo, GPUInfo } from '../../webgpuUtils';
import { arrayBufferToImageBitmap } from '../../image';
import { GLTFExtensions, GLTFKNRMaterialsTransmission, GLTFKNRTextureTransform, type GLTFKNRMaterialsTransmissionProps } from './gltfexts';
import { GLTFGPUMaterial } from './gltfrender';

export type { GLTF as TGLTF } from '@gltf-transform/core';
export type { Extension as TGLTFExtension } from '@gltf-transform/core';

export type GLTFRef = number;

export interface GLTFDataOptions extends RenderObjectOptions {
    uri: string;
    name?: string;
}

export class GLTFScene {
    ref: GLTFRef;
    gltf: GLTF;
    json: TGLTF.IScene;
    nodes: GLTFRef[];
    constructor(gltf: GLTF, ref: GLTFRef, json: TGLTF.IScene) {
        this.gltf = gltf;
        this.ref = ref;
        this.json = json;
        this.nodes = json.nodes;
    }
}

export class GLTFNode {
    gltf: GLTF;
    ref: number;
    json: TGLTF.INode
    matrix: mat4 = mat4.create();
    children?: GLTFRef[];
    camera?: GLTFRef;
    skin?: GLTFRef;
    mesh?: GLTFRef;

    #enabled: boolean = true;

    constructor(gltf: GLTF, ref: GLTFRef, json: TGLTF.INode) {
        this.gltf = gltf;
        this.ref = ref;
        this.json = json;
        if (this.json.children) {
            this.children = json.children;
        }
        if (this.json.matrix) {
            this.matrix = mat4.fromValues(...(this.json.matrix as NumArr16));
        } else if (this.json.translation) {
            const t = this.json.translation ?? [0, 0, 0];
            const r = this.json.rotation ?? [0, 0, 0, 1];
            const s = this.json.scale ?? [1, 1, 1];
            this.matrix = mat4.fromRotationTranslationScale(
                mat4.create(),
                quat.fromValues(r[0], r[1], r[2], r[3]),
                vec3.fromValues(t[0], t[1], t[2]),
                vec3.fromValues(s[0], s[1], s[2])
            );
        }
        this.camera = this.json.camera;
        this.mesh = this.json.mesh;
        this.skin = this.json.skin;
    }

    get enabled() {
        return this.#enabled;
    }

    enable() {
        this.#enabled = true;
    }

    disable() {
        this.#enabled = false;
    }

    switch() {
        this.#enabled = !this.#enabled;
    }
}

export class GLTFMesh {
    gltf: GLTF;
    ref: GLTFRef;
    json: TGLTF.IMesh;
    primitives: GLTFPrimitive[];

    #enabled: boolean = true;

    disable() {
        this.#enabled = false;
    }

    enable() {
        this.#enabled = true;
    }

    get enabled() {
        return this.#enabled;
    }

    constructor(gltf: GLTF, ref: GLTFRef, json: TGLTF.IMesh) {
        this.gltf = gltf;
        this.ref = ref;
        this.json = json;
        this.primitives = this.json.primitives.map((v, i) => new GLTFPrimitive(gltf, this, i));
    }
}

export const GLTFAttributres = {
    POSITION: "POSITION",
    NORMAL: "NORMAL",
    TANGENT: "TANGENT",
    TEXCOORD: "TEXCOORD",
    JOINTS: "JOINTS",
    WEIGHTS: "WEIGHTS"
} as const;
export type GLTFAttributres = typeof GLTFAttributres[keyof typeof GLTFAttributres];

export interface GLTFMaterialTexCoordIndexMap {
    baseColor?: number;
    metallicRoughness?: number;
    normal?: number;
    emmissive?: number;
    occlusion?: number;
}

export type GPUMaterialTexCoordOrderMap = GLTFMaterialTexCoordIndexMap;

export class GLTFPrimitive {

    gltf: GLTF;
    ref: GLTFRef;
    mesh: GLTFMesh;
    json: TGLTF.IMeshPrimitive;
    mode: TGLTF.MeshPrimitiveMode;
    indices?: GLTFRef;
    webgpu: {
        uniform?: GPUBuffer;
        defaultVec2FloatBuffer?: GPUBuffer;
        defaultVec3FloatBuffer?: GPUBuffer;
        defaultVec4FloatBuffer?: GPUBuffer;
    } = {};

    constructor(gltf: GLTF, mesh: GLTFMesh, ref: GLTFRef) {
        this.gltf = gltf;
        this.ref = ref;
        this.mesh = mesh;
        this.json = mesh.json.primitives[ref];
        this.mode = this.json.mode;
        this.indices = this.json.indices;
    }

    getVertexCount() {
        return this.getAssessor(GLTFAttributres.POSITION).count;
    }

    getMode(): TGLTF.MeshPrimitiveMode {
        return this.mode;
    }

    getMeterial(): GLTFMaterial {
        const material = this.gltf.getMaterial(this.json.material);
        return material;
    }

    hasIndicies(): boolean {
        return !!this.indices;
    }

    hasPosition(): boolean {
        return GLTFAttributres.POSITION in this.json.attributes;
    }

    hasNormal(): boolean {
        return GLTFAttributres.NORMAL in this.json.attributes;
    }

    hasTangent(): boolean {
        return GLTFAttributres.TANGENT in this.json.attributes;
    }

    hasTexcoord(idx: number = 0) {
        return `${GLTFAttributres.TEXCOORD}_${idx}` in this.json.attributes;
    }

    numTexcoord(): number {
        return Object.keys(this.json.attributes).filter(a => a.startsWith(GLTFAttributres.TEXCOORD)).length;
    }

    hasJoints(idx: number = 0) {
        return `${GLTFAttributres.JOINTS}_${idx}` in this.json.attributes;
    }

    numJoints(): number {
        return Object.keys(this.json.attributes).filter(a => a.startsWith(GLTFAttributres.JOINTS)).length;
    }

    hasWeights(idx: number = 0) {
        return `${GLTFAttributres.WEIGHTS}_${idx}` in this.json.attributes;
    }

    numWeights(): number {
        return Object.keys(this.json.attributes).filter(a => a.startsWith(GLTFAttributres.WEIGHTS)).length;
    }

    hasMorph(): boolean {
        return !!this.json.targets;
    }

    getAssessor(attr: string, idx?: number): GLTFAccessor | null {
        const fattr = idx ? `${attr}_${idx}` : attr;
        const ref = this.json.attributes[fattr];
        if (ref == null) {
            return null;
        } else {
            return this.gltf.assessors[ref];
        }
    }

    getBufferView(attr: string, idx?: number): GLTFBufferView | null {
        const assessor = this.getAssessor(attr, idx);
        if (assessor == null) {
            return null;
        } else {
            // TODO if not exist buffer view, it use sparse data
            return this.gltf.bufferViews[assessor.json.bufferView] ?? null;
        }
    }

    getOrderedTexcoordAttrName(): string[] {
        return Object.keys(this.json.attributes)
            .filter(a => a.startsWith(GLTFAttributres.TEXCOORD))
            .sort((a, b) => {
                const v0 = parseInt(a.split("_")[1]);
                const v1 = parseInt(b.split("_")[1]);
                return v0 - v1;
            });
    }

    getGPUMaterialTexCoordMap(): GPUMaterialTexCoordOrderMap {
        const material = this.gltf.materials[this.json.material];
        if (material) {
            const orderMap = this.getTexCoordOrderMap();
            const indexMap = material.getTexcoordIndexMap();
            const entries = Object.entries(indexMap).map(([s, i]) => {
                const ord = orderMap[i];
                return [s, ord];
            })
            return Object.fromEntries(entries);
        }
        return {};
    }

    getTexCoordOrderMap(): { [key: number]: number } {

        const entries = Object.keys(this.json.attributes)
            .filter(a => a.startsWith(GLTFAttributres.TEXCOORD))
            .map(a => parseInt(a.split("_")[1])).sort()
            .map((idx, ord) => [idx, ord]);
        return Object.fromEntries(entries);
    }

    getDefaultVec4FloatGPUBuffer(device: GPUDevice): GPUBuffer {
        if (this.webgpu.defaultVec4FloatBuffer != null) {
            return this.webgpu.defaultVec4FloatBuffer;
        }
        const count = this.getVertexCount();
        const bytes = 4 * 4 * count;
        const bufferData = new ArrayBuffer(bytes);
        const buffer = device.createBuffer({
            label: "primitive default vec4f buffer",
            size: bytes,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
        });
        device.queue.writeBuffer(buffer, 0, bufferData);
        this.webgpu.defaultVec4FloatBuffer = buffer;
        return buffer;
    }

    getDefaultVec3FloatGPUBuffer(device: GPUDevice): GPUBuffer {
        if (this.webgpu.defaultVec3FloatBuffer != null) {
            return this.webgpu.defaultVec3FloatBuffer;
        }
        const count = this.getVertexCount();
        const bytes = 3 * 4 * count;
        const bufferData = new ArrayBuffer(bytes);
        const buffer = device.createBuffer({
            label: "primitive default vec3f buffer",
            size: bytes,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
        });
        device.queue.writeBuffer(buffer, 0, bufferData);
        this.webgpu.defaultVec3FloatBuffer = buffer;
        return buffer;
    }

    getDefaultVec2FloatGPUBuffer(device: GPUDevice): GPUBuffer {
        if (this.webgpu.defaultVec2FloatBuffer != null) {
            return this.webgpu.defaultVec2FloatBuffer;
        }
        const count = this.getVertexCount();
        const bytes = 2 * 4 * count;
        const bufferData = new ArrayBuffer(bytes);
        const buffer = device.createBuffer({
            label: "primitive default vec2f buffer",
            size: bytes,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
        });
        device.queue.writeBuffer(buffer, 0, bufferData);
        this.webgpu.defaultVec2FloatBuffer = buffer;
        return buffer;
    }
}

const SamplerMinFilters: { [key: string]: TGLTF.TextureMinFilter } = {
    NEAREST: 9728,
    LINEAR: 9729,
    NEAREST_MIPMAP_NEAREST: 9984,
    LINEAR_MIPMAP_NEAREST: 9985,
    NEAREST_MIPMAP_LINEAR: 9986,
    LINEAR_MIPMAP_LINEAR: 9987
}

const SamplerMagFilters: { [key: string]: TGLTF.TextureMagFilter } = {
    NEAREST: 9728,
    LINEAR: 9729
}

const SamplerWrapModes: { [key: string]: TGLTF.TextureWrapMode } = {
    REPEAT: 10497,
    CLAMP_TO_EDGE: 33071,
    MIRRORED_REPEAT: 33648
}

const DefaultGPUSamplerDescriptor: GPUSamplerDescriptor = {
    label: "gltf default sampler",
    minFilter: 'linear',
    magFilter: 'linear',
    addressModeU: 'repeat',
    addressModeV: 'repeat'
}

export class GLTFTexutre {
    gltf: GLTF
    ref: GLTFRef
    json: TGLTF.ITexture

    webgpu: {
        texture?: GPUTexture
        sampler?: GPUSampler
    } = {}

    getImage(): GLTFImage | null {
        return this.gltf.images[this.json.source] ?? null;
    }

    constructor(gltf: GLTF, ref: GLTFRef, json: TGLTF.ITexture) {
        this.gltf = gltf;
        this.ref = ref;
        this.json = json;
    }

    getGPUTexture(device: GPUDevice): GPUTexture | null {
        if (this.webgpu.texture != null) {
            return this.webgpu.texture;
        }
        const image = this.gltf.images[this.json.source];
        if (image == null) {
            return null;
        }
        image.loadImage();
        if (image.status === GLTFImageStatus.READY) {

            const bitmap = image.image;

            const texture = createTextureFromSource(device, bitmap, {
                mips: this.needMipmap(),
                format: 'rgba8unorm',
                size: [bitmap.width, bitmap.height, 1]
            });

            // const texture = createTexture2D(device, bitmap);

            // const texture = createTexture2DFromTypedArray(device, image.data.data, image.data.width, image.data.height);

            this.webgpu.texture = texture;

        } else {
            return null;
        }
    }

    needMipmap(): boolean {
        const sampler = this.gltf.samplers[this.json.sampler];
        if (sampler == null) {
            return false;
        } else {
            return sampler.needMipmap();
        }
    }

    getGPUSampler(device: GPUDevice): GPUSampler | null {
        if (this.webgpu.sampler != null) {
            return this.webgpu.sampler;
        } else {
            const sampler = this.gltf.samplers[this.json.sampler];
            if (sampler == null) {
                this.webgpu.sampler = device.createSampler(DefaultGPUSamplerDescriptor);
            } else {
                this.webgpu.sampler = sampler.getGPUSampler(device);
            }
            return this.webgpu.sampler;
        }
    }

    destroy() {
        this.webgpu.texture?.destroy();
        this.webgpu.texture = null;
    }
}

export class GLTFSampler {
    gltf: GLTF
    ref: GLTFRef
    json: TGLTF.ISampler
    minFilter: TGLTF.TextureMinFilter
    magFilter: TGLTF.TextureMagFilter
    wrapS: TGLTF.TextureWrapMode
    wrapT: TGLTF.TextureWrapMode

    webgpu: {
        sampler?: GPUSampler;
    } = {};

    constructor(gltf: GLTF, ref: GLTFRef, json: TGLTF.ISampler) {
        this.gltf = gltf;
        this.ref = ref;
        this.json = json;
        this.minFilter = this.json.minFilter ?? SamplerMinFilters.LINEAR;
        this.magFilter = this.json.magFilter ?? SamplerMagFilters.LINEAR;
        this.wrapS = this.json.wrapS ?? SamplerWrapModes.REPEAT;
        this.wrapT = this.json.wrapT ?? SamplerWrapModes.REPEAT;
    }

    needMipmap(): boolean {
        if (this.minFilter === SamplerMinFilters.NEAREST_MIPMAP_NEAREST ||
            this.minFilter === SamplerMinFilters.LINEAR_MIPMAP_NEAREST ||
            this.minFilter === SamplerMinFilters.NEAREST_MIPMAP_LINEAR ||
            this.minFilter === SamplerMinFilters.LINEAR_MIPMAP_LINEAR
        ) {
            return true;
        } else {
            return false;
        }
    }

    getGPUSamplerDescriptor() {
        const descriptor: GPUSamplerDescriptor = {
            label: "gltf sampler"
        };

        switch (this.minFilter) {
            case SamplerMinFilters.NEAREST:
                descriptor.minFilter = 'nearest';
                break;
            case SamplerMinFilters.LINEAR:
                descriptor.minFilter = 'linear';
                break;
            case SamplerMinFilters.NEAREST_MIPMAP_NEAREST:
                descriptor.minFilter = 'nearest';
                descriptor.mipmapFilter = 'nearest';
                break;
            case SamplerMinFilters.LINEAR_MIPMAP_NEAREST:
                descriptor.minFilter = 'linear';
                descriptor.mipmapFilter = 'nearest';
                break;
            case SamplerMinFilters.NEAREST_MIPMAP_LINEAR:
                descriptor.minFilter = 'nearest';
                descriptor.mipmapFilter = 'linear';
                break;
            case SamplerMinFilters.LINEAR_MIPMAP_LINEAR:
                descriptor.minFilter = 'linear';
                descriptor.mipmapFilter = 'linear';
                break;
        }

        switch (this.magFilter) {
            case SamplerMagFilters.NEAREST:
                descriptor.magFilter = 'nearest';
                break;
            case SamplerMagFilters.LINEAR:
                descriptor.magFilter = 'linear';
                break;
        }

        switch (this.wrapS) {
            case SamplerWrapModes.REPEAT:
                descriptor.addressModeU = 'repeat';
                break;
            case SamplerWrapModes.CLAMP_TO_EDGE:
                descriptor.addressModeU = 'clamp-to-edge';
                break;
            case SamplerWrapModes.MIRRORED_REPEAT:
                descriptor.addressModeU = 'mirror-repeat';
        }

        switch (this.wrapT) {
            case SamplerWrapModes.REPEAT:
                descriptor.addressModeV = 'repeat';
                break;
            case SamplerWrapModes.CLAMP_TO_EDGE:
                descriptor.addressModeV = 'clamp-to-edge';
                break;
            case SamplerWrapModes.MIRRORED_REPEAT:
                descriptor.addressModeV = 'mirror-repeat';
        }

        return descriptor;
    }

    getGPUSampler(device: GPUDevice): GPUSampler {
        if (this.webgpu.sampler == null) {
            const descriptor = this.getGPUSamplerDescriptor();
            this.webgpu.sampler = device.createSampler(descriptor);
        }
        return this.webgpu.sampler;
    }
}

export class GLTFTextureInfo {
    textureRef: number = 0
    texcoordRef?: number
    textureTransform?: GLTFKNRTextureTransform;
    ready: boolean = false;

    constructor(info?: TGLTF.ITextureInfo) {
        if (info != null) {
            this.textureRef = info.index;
            this.texcoordRef = info.texCoord ?? 0;
            if (info.extensions != null) {
                if (GLTFExtensions.KHR_texture_transform in info.extensions) {
                    this.textureTransform = new GLTFKNRTextureTransform(info.extensions.KHR_texture_transform);
                    if (this.textureTransform.texcoord != null) {
                        this.texcoordRef = this.textureTransform.texcoord;
                    }
                }
            }
        }
    }
}

export const GLTFMaterialTextures = {
    BaseColor: "BaseColor",
    MetallicRoughness: "MetallicRoughness",
    Normal: "Normal",
    Emmissive: "Emmissive",
    Occlusion: "Occlusion"
} as const;
export type GLTFMaterialTextures = typeof GLTFMaterialTextures[keyof typeof GLTFMaterialTextures];

export class GLTFMaterial {
    gltf: GLTF
    ref?: GLTFRef
    json?: TGLTF.IMaterial

    alphaMode: TGLTF.MaterialAlphaMode = "OPAQUE"
    alphaCutoff: number = 0.5;
    doubleSided: boolean = false;

    baseColor: {
        factor: number[];
        texture?: GLTFTextureInfo;
    } = { factor: [1.0, 1.0, 1.0, 1.0] }

    pbr: {
        metallic: number;
        roughness: number;
        texture?: GLTFTextureInfo;
    } = { metallic: 1.0, roughness: 1.0 }

    normal: {
        scale: number;
        texture?: GLTFTextureInfo;
    } = { scale: 1.0 };

    emmissive: {
        factor: number[];
        texture?: GLTFTextureInfo;
    } = { factor: [0, 0, 0] }

    occlusion: {
        strength: number;
        texture?: GLTFTextureInfo;
    } = { strength: 1.0 }

    webgpu: {
        material?: GLTFGPUMaterial
    } = {};

    transmission?: GLTFKNRMaterialsTransmission

    constructor(gltf: GLTF, ref?: GLTFRef, json?: TGLTF.IMaterial) {
        this.gltf = gltf;
        this.ref = ref;
        this.json = json;
        if (this.json) {
            const pbrJson = this.json.pbrMetallicRoughness;
            if (pbrJson) {

                this.baseColor.factor = pbrJson.baseColorFactor ?? [1.0, 1.0, 1.0, 1.0];
                this.baseColor.texture = this.getTextureInfo(pbrJson.baseColorTexture);

                this.pbr.metallic = pbrJson.metallicFactor ?? 1.0;
                this.pbr.roughness = pbrJson.roughnessFactor ?? 1.0;
                this.pbr.texture = this.getTextureInfo(pbrJson.metallicRoughnessTexture);
            }

            this.normal.scale = this.json.normalTexture?.scale ?? 1.0;
            this.normal.texture = this.getTextureInfo(this.json.normalTexture);

            this.emmissive.factor = this.json.emissiveFactor ?? [0, 0, 0];
            this.emmissive.texture = this.getTextureInfo(this.json.emissiveTexture);

            this.occlusion.strength = this.json.occlusionTexture?.strength ?? 1.0;
            this.occlusion.texture = this.getTextureInfo(this.json.occlusionTexture);

            this.alphaMode = this.json.alphaMode ?? "OPAQUE";
            this.alphaCutoff = this.json.alphaCutoff ?? 0.5;
            this.doubleSided = this.json.doubleSided ?? false;

            if (this.json.extensions != null && GLTFExtensions.KHR_materials_transmission in this.json.extensions) {
                this.transmission = new GLTFKNRMaterialsTransmission(
                    json.extensions[GLTFExtensions.KHR_materials_transmission] as GLTFKNRMaterialsTransmissionProps);
                this.alphaMode = 'BLEND'; // TODO transmission 先临时用blend实现
            }

        }
    }

    getTextureInfo(info?: TGLTF.ITextureInfo) {
        if (info == null) {
            return null;
        }
        return new GLTFTextureInfo(info);
    }

    getAlphaMode(): TGLTF.MaterialAlphaMode {
        return this.alphaMode;
    }

    getAlphaCutoff(): number {
        return this.alphaCutoff;
    }

    getDoubleSided(): boolean {
        return this.doubleSided;
    }

    hasTexture(texture: GLTFMaterialTextures): boolean {
        switch (texture) {
            case 'BaseColor':
                return this.baseColor.texture != null;
            case 'MetallicRoughness':
                return this.pbr.texture != null;
            case 'Normal':
                return this.normal.texture != null;
            case 'Emmissive':
                return this.emmissive.texture != null;
            case 'Occlusion':
                return this.occlusion.texture != null;
            default:
                return false;
        }
    }

    hasTextureTransform(texture: GLTFMaterialTextures): boolean {
        if (!this.hasTexture(texture)) {
            return false;
        }
        switch (texture) {
            case 'BaseColor':
                return this.baseColor.texture.textureTransform != null;
            case 'MetallicRoughness':
                return this.pbr.texture.textureTransform != null;
            case 'Normal':
                return this.normal.texture.textureTransform != null;
            case 'Emmissive':
                return this.emmissive.texture.textureTransform != null;
            case 'Occlusion':
                return this.occlusion.texture.textureTransform != null;
            default:
                return false;
        }
    }

    getTextureTransformData(texture: GLTFMaterialTextures) {
        if (!this.hasTexture(texture)) {
            return GLTFKNRTextureTransform.getDefaultData();
        }
        if (!this.hasTextureTransform(texture)) {
            return GLTFKNRTextureTransform.getDefaultData();
        }
        switch (texture) {
            case 'BaseColor':
                return this.baseColor.texture.textureTransform.data;
            case 'MetallicRoughness':
                return this.pbr.texture.textureTransform.data;
            case 'Normal':
                return this.normal.texture.textureTransform.data;
            case 'Emmissive':
                return this.emmissive.texture.textureTransform.data;
            case 'Occlusion':
                return this.occlusion.texture.textureTransform.data;
            default:
                return GLTFKNRTextureTransform.getDefaultData();
        }
    }

    getTexcoordIndexMap() {
        const idxmap: GLTFMaterialTexCoordIndexMap = {
            baseColor: this.baseColor.texture?.texcoordRef,
            metallicRoughness: this.pbr.texture?.texcoordRef,
            normal: this.normal.texture?.texcoordRef,
            emmissive: this.emmissive.texture?.texcoordRef,
            occlusion: this.occlusion.texture?.texcoordRef
        }
        return idxmap;
    }

    isTextureReady() {
        const baseColorReady = this.baseColor.texture == null || this.baseColor.texture.ready;
        const pbrReady = this.pbr.texture == null || this.pbr.texture.ready;
        const normalReady = this.normal.texture == null || this.normal.texture.ready;
        const emmissiveReady = this.emmissive.texture == null || this.emmissive.texture.ready;
        const occlusionReady = this.occlusion.texture == null || this.occlusion.texture.ready;
        return baseColorReady && pbrReady && normalReady && emmissiveReady && occlusionReady;
    }

    getGPUTexture(device: GPUDevice, info?: GLTFTextureInfo): GPUTexture {

        if (info == null) {
            return this.gltf.getDefaultTexture(device);
        }

        const gltfTexture = this.gltf.textures[info.textureRef];

        const texture = gltfTexture.getGPUTexture(device);

        if (texture == null) {
            return this.gltf.getDefaultTexture(device);
        } else {
            info.ready = true;
            return texture;
        }

    }

    getGPUSampler(device: GPUDevice, info?: GLTFTextureInfo): GPUSampler {
        if (info == null) {
            return this.gltf.getDefaultSampler(device);
        }

        const gltfTexture = this.gltf.textures[info.textureRef];

        const sampler = gltfTexture.getGPUSampler(device);

        if (sampler == null) {
            return this.gltf.getDefaultSampler(device);
        } else {
            return sampler;
        }
    }

    getGPUMaterial(device: GPUDevice): GLTFGPUMaterial {
        if (this.webgpu.material == null) {

            const material = new GLTFGPUMaterial(this);

            this.webgpu.material = material;

        }
        return this.webgpu.material;
    }

    destroy() {
        this.webgpu.material?.destroy();
        this.webgpu.material = null;
    }


};

export const GLTFImageStatus = {
    NONE: 0,
    LOADING: 1,
    READY: 2,
    FAILED: 3
} as const;
export type GLTFImageStatus = typeof GLTFImageStatus[keyof typeof GLTFImageStatus];

const GLTFImageFormat = {
    JPG: 0,
    PNG: 1
} as const;
export type GLTFImageFormat = typeof GLTFImageFormat[keyof typeof GLTFImageFormat];

export class GLTFImage {
    gltf: GLTF
    ref: GLTFRef
    json: TGLTF.IImage
    image: ImageBitmap | null = null;
    // data: ImageDataInfo | null = null;
    status: GLTFImageStatus = GLTFImageStatus.NONE;
    constructor(gltf: GLTF, ref: GLTFRef, json: TGLTF.IImage) {
        this.gltf = gltf;
        this.ref = ref;
        this.json = json;
    }

    async loadImage() {

        if (this.status !== GLTFImageStatus.NONE) {
            return;
        }

        this.status = GLTFImageStatus.LOADING;

        let image: ImageBitmap | null = null;
        if (this.json.uri) {
            let absUri: string = "";
            if (this.json.uri.startsWith("data:")) {
                absUri = this.json.uri;
            } else {
                absUri = `${this.gltf.url}/${this.json.uri}`;
            }
            const res = await fetch(absUri);
            const blob = await res.blob();
            image = await createImageBitmap(blob, {
                colorSpaceConversion: 'none',
                imageOrientation: 'from-image',
                premultiplyAlpha: 'none'
            });

        } else if (this.json.bufferView) {

            const bufferView = this.gltf.bufferViews[this.json.bufferView];
            if (!bufferView) {
                this.status = GLTFImageStatus.FAILED;
                throw new Error("GLTFImage loadImage get bufferView Failed");
            }
            const viewoffset = bufferView.byteOffset;
            const viewlength = bufferView.byteLength;
            const data = await bufferView.loadData();
            const mimeType = this.json.mimeType;
            const buf = new ArrayBuffer(viewlength);
            new Uint8Array(buf).set(data.slice(viewoffset, viewoffset + viewlength))
            image = await arrayBufferToImageBitmap(buf, mimeType);

        }
        this.image = image;
        this.status = GLTFImageStatus.READY;
        return this.image;
    }

    destroy() {}
};

export class GLTFCamera {
    gltf: GLTF
    ref: GLTFRef
    json: TGLTF.ICamera
    constructor(gltf: GLTF, ref: GLTFRef, json: TGLTF.ICamera) {
        this.gltf = gltf;
        this.ref = ref;
        this.json = json;
    }
};

export class GLTFSkin {
    gltf: GLTF
    ref: GLTFRef
    json: TGLTF.ISkin
    constructor(gltf: GLTF, ref: GLTFRef, json: TGLTF.ISkin) {
        this.gltf = gltf;
        this.ref = ref;
        this.json = json;
    }
};

export class GLTFAnimation {
    gltf: GLTF
    ref: GLTFRef
    json: TGLTF.IAnimation
    constructor(gltf: GLTF, ref: GLTFRef, json: TGLTF.IAnimation) {
        this.gltf = gltf;
        this.ref = ref;
        this.json = json;
    }
};

export const GLTFAccessorType = {
    SCALA: "SCALA",
    VEC2: "VEC2",
    VEC3: "VEC3",
    VEC4: "VEC4",
    MAT2: "MAT2",
    MAT3: "MAT3",
    MAT4: "MAT4",
} as const;
export type GLTFAccessorType = typeof GLTFAccessorType[keyof typeof GLTFAccessorType];

export const GLTFAccessorTypeNumComps = {
    SCALA: 1,
    VEC2: 2,
    VEC3: 3,
    VEC4: 4,
    MAT2: 4,
    MAT3: 9,
    MAT4: 16,
};

export const GLTFAccessorCompType = {
    BYTE: 5120,
    UNSIGNED_BYTE: 5121,
    SHORT: 5122,
    UNSIGNED_SHORT: 5123,
    UNSIGNED_INT: 5125,
    FLOAT: 5126
} as const;
export type GLTFAccessorCompType = typeof GLTFAccessorCompType[keyof typeof GLTFAccessorCompType];

const CompCode2String = Object.fromEntries(
    Object.entries(GLTFAccessorCompType).map(([k, v]) => [v, k])
);

export const GLTFAccessorCompBytes = {
    BYTE: 1,
    UNSIGNED_BYTE: 1,
    SHORT: 2,
    UNSIGNED_SHORT: 2,
    UNSIGNED_INT: 4,
    FLOAT: 4
} as const;

export class GLTFAccessor {
    gltf: GLTF;
    ref: GLTFRef;
    json: TGLTF.IAccessor;
    count: number;
    byteOffset: number;
    constructor(gltf: GLTF, ref: GLTFRef, json: TGLTF.IAccessor) {
        this.gltf = gltf;
        this.ref = ref;
        this.json = json;
        this.byteOffset = this.json.byteOffset ?? 0;
        this.count = this.json.count ?? 0;
    }

    async loadData() {
        const bufferView = this.gltf.bufferViews[this.json.bufferView];
        return bufferView.loadData();
    }

    getElementBytes(): number {
        const type = this.json.type;
        const compTyp = this.json.componentType;
        const numComps = GLTFAccessorTypeNumComps[type];
        const compbytes = GLTFAccessorCompBytes[CompCode2String[compTyp]];
        return numComps * compbytes;
    }
};

export class GLTFBufferView {
    gltf: GLTF
    ref: GLTFRef
    json: TGLTF.IBufferView;
    byteLength: number;
    byteOffset: number;
    byteStride?: number;
    constructor(gltf: GLTF, ref: GLTFRef, json: TGLTF.IBufferView) {
        this.gltf = gltf;
        this.ref = ref;
        this.json = json;
        this.byteLength = this.json.byteLength;
        this.byteOffset = this.json.byteOffset ?? 0;
        this.byteStride = this.json.byteStride;
    }

    async loadData(): Promise<Uint8Array> {
        const buffer = this.gltf.buffers[this.json.buffer];
        return buffer.loadData();
    }
};

export const GLTFBufferStatus = {
    NONE: 0,
    LOADING: 1,
    READY: 2
};
export type GLTFBufferStatus = typeof GLTFBufferStatus[keyof typeof GLTFBufferStatus];

export class GLTFBuffer {
    gltf: GLTF
    ref: GLTFRef
    json: TGLTF.IBuffer
    byteLength: number;
    uri?: string;
    data: Uint8Array | null = null;


    status: GLTFBufferStatus = GLTFBufferStatus.NONE;

    webgpu: {
        buffers: { [key: number]: GPUBuffer } /*usage:buffer*/
    } = {
            buffers: {}
        }

    constructor(gltf: GLTF, ref: GLTFRef, json: TGLTF.IBuffer) {
        this.gltf = gltf;
        this.ref = ref;
        this.json = json;
        this.byteLength = this.json.byteLength;
        this.uri = this.json.uri;
    }

    loadData(): Promise<Uint8Array> {

        this.status = GLTFBufferStatus.LOADING;

        return (async () => {
            let data: ArrayBuffer | null = null;

            if (!this.uri) {
                //TODO glb
            } else {
                let absUri: string = this.json.uri;
                if (!this.uri.startsWith("data:")) {
                    absUri = `${this.gltf.url}/${this.uri}`
                }
                const res = await fetch(absUri);
                if (!res.ok) {
                    throw new Error(`Failed to load buffer data: ${res.status}`);
                }
                data = await res.arrayBuffer();
            }

            this.data = new Uint8Array(data);

            this.status = GLTFBufferStatus.READY;

            return this.data;


        })();

    }

    getGPUBuffer(device: GPUDevice, usage: number): GPUBuffer | null {
        if (this.status === GLTFBufferStatus.NONE) {
            this.loadData();
            return null;
        } else if (this.status === GLTFBufferStatus.LOADING) {
            return null;
        } else {
            if (this.webgpu.buffers[usage] != null) {
                return this.webgpu.buffers[usage];
            } else {
                const buffer = device.createBuffer({
                    label: this.json.name ?? "gltf buffer",
                    size: this.json.byteLength,
                    usage
                });
                device.queue.writeBuffer(buffer, 0, this.data.buffer, 0, this.byteLength);
                this.webgpu.buffers[usage] = buffer;
            }
        }
    }

    destroy() {
        for (const buffer of Object.values(this.webgpu.buffers)) {
            buffer.destroy();
        }
        this.webgpu.buffers = {};
    }
};

export default class GLTF {

    name: string = "glTF";

    #uri: string;
    #url: string;
    #json: TGLTF.IGLTF;
    #version: string;


    #ready: boolean = false;
    #readyQueue: ((gltf?: GLTF) => void)[] = [];

    scenes?: GLTFScene[];
    nodes?: GLTFNode[];
    meshes?: GLTFMesh[];
    camera?: GLTFCamera[];
    textures?: GLTFTexutre[];
    samplers?: GLTFSampler[];
    materials?: GLTFMaterial[];
    images?: GLTFImage[];
    skins?: GLTFSkin[];
    animations?: GLTFAnimation[];
    assessors?: GLTFAccessor[];
    bufferViews?: GLTFBufferView[];
    buffers?: GLTFBuffer[];

    #defaultMaterial?: GLTFMaterial;

    webgpu: {
        defaultTexture?: GPUTexture;
        defaultSampler?: GPUSampler;
    } = {};

    constructor(options: GLTFDataOptions) {

        this.#uri = options.uri;
        this.#url = this.#uri.replace(/\/[^\/]*$/, '/');
        this.name = options.name ?? "gltf";

        this.#loadFromURI(this.#uri).then(json => {

            this.#json = json;

            const asset = json.asset;

            const version = asset.version;

            this.#version = version;

            if (version !== "2.0") {
                throw Error("only supports glTF 2.0 currently.");
            }

            this.build();

            this.#ready = true;

            for (const f of this.#readyQueue) {
                f(this);
            }

        });
    }

    get ready() {
        return this.#ready;
    }

    get uri() {
        return this.#uri;
    }

    get url() {
        return this.#url;
    }

    get json() {
        return this.#json;
    }

    get version() {
        return this.#version;
    }

    get defaultMaterial(): GLTFMaterial {
        if (!this.#defaultMaterial) {
            this.#defaultMaterial = new GLTFMaterial(this);
        }
        return this.#defaultMaterial;
    }

    getMaterial(ref?: GLTFRef) {
        if (ref == null) {
            return this.defaultMaterial;
        } else {
            return this.materials[ref];
        }
    }

    onReady(f: (gltf?: GLTF) => void) {
        if (this.ready) {
            f(this);
        } else {
            this.#readyQueue.push(f);
        }
    }

    async #loadFromURI(uri: string) {

        const response = await fetch(uri);

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const json: TGLTF.IGLTF = await response.json();

        this.#json = json;

        return this.#json;

    }

    build() {

        this.scenes = this.json.scenes?.map((j, i) => new GLTFScene(this, i, j));
        this.nodes = this.json.nodes?.map((j, i) => new GLTFNode(this, i, j));
        this.meshes = this.json.meshes?.map((j, i) => new GLTFMesh(this, i, j));
        this.camera = this.json.cameras?.map((j, i) => new GLTFCamera(this, i, j));
        this.textures = this.json.textures?.map((j, i) => new GLTFTexutre(this, i, j));
        this.samplers = this.json.samplers?.map((j, i) => new GLTFSampler(this, i, j));
        this.materials = this.json.materials?.map((j, i) => new GLTFMaterial(this, i, j));
        this.images = this.json.images?.map((j, i) => new GLTFImage(this, i, j));
        this.skins = this.json.skins?.map((j, i) => new GLTFSkin(this, i, j));
        this.animations = this.json.animations?.map((j, i) => new GLTFAnimation(this, i, j));
        this.assessors = this.json.accessors?.map((j, i) => new GLTFAccessor(this, i, j));
        this.bufferViews = this.json.bufferViews?.map((j, i) => new GLTFBufferView(this, i, j));
        this.buffers = this.json.buffers?.map((j, i) => new GLTFBuffer(this, i, j));
    }

    getDefaultTexture(device: GPUDevice): GPUTexture {
        if (this.webgpu.defaultTexture == null) {
            const texture = device.createTexture({
                label: "pbrMaterial default texture",
                size: [1, 1, 1],
                format: 'rgba8unorm',
                usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
            });
            device.queue.writeTexture(
                { texture: texture },
                new Uint8Array([0, 0, 0, 0]),
                { bytesPerRow: 4 },
                { width: 1, height: 1 }
            );
            this.webgpu.defaultTexture = texture;
        }
        return this.webgpu.defaultTexture;
    }

    getDefaultSampler(device: GPUDevice): GPUSampler {
        if (this.webgpu.defaultSampler == null) {
            const sampler = device.createSampler({
                label: "pbrMaterial default sampler",
                minFilter: 'linear',
                magFilter: 'linear',
                addressModeU: 'repeat',
                addressModeV: 'repeat'
            });
            this.webgpu.defaultSampler = sampler;
        }
        return this.webgpu.defaultSampler;
    }

    destroy(): void {
        for (const buffer of this.buffers) {
            buffer.destroy();
        }
        for (const image of this.images) {
            image.destroy();
        }
        for (const texutre of this.textures) {
            texutre.destroy();
        }
        for (const material of this.materials) {
            material.destroy();
        }
        if (this.webgpu.defaultTexture != null) {
            this.webgpu.defaultTexture.destroy();
            this.webgpu.defaultTexture = null;
        }
    }

}