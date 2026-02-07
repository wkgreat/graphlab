import { makeShaderDataDefinitions, makeStructuredView } from "webgpu-utils";
import type { ChangeCallback, NumArr3, NumArr4 } from "./defines";
import type { TGLTF } from "./format/gltf";
import code from './shader/material.wgsl';

export interface BlinnPhongMaterialOptions {
    ka: number
    ambient: NumArr4
    kd: number
    diffuse: NumArr4
    ks: number
    specular: NumArr4
    phong: number
}

export class BlinnPhongMaterial {
    #ka: number
    #ambient: NumArr4
    #kd: number
    #diffuse: NumArr4
    #ks: number
    #specular: NumArr4
    #phong: number

    #callbacks: ChangeCallback<BlinnPhongMaterial>[] = [];

    constructor(options: BlinnPhongMaterialOptions) {
        this.#ka = options.ka;
        this.#ambient = options.ambient;
        this.#kd = options.kd;
        this.#diffuse = options.diffuse;
        this.#ks = options.ks;
        this.#specular = options.specular;
        this.#phong = options.phong;
    }

    addCallback(f: ChangeCallback<BlinnPhongMaterial>) {
        this.#callbacks.push(f);
    }

    invokeChange() {
        for (const f of this.#callbacks) {
            f(this);
        }
    }

    set ka(ka) {
        this.#ka = ka;
        this.invokeChange();
    }

    set ambient(ambient) {
        this.#ambient = ambient;
        this.invokeChange();
    }

    set kd(kd) {
        this.#kd = kd;
        this.invokeChange();
    }

    set diffuse(diffuse) {
        this.#diffuse = diffuse;
        this.invokeChange();
    }

    set ks(ks) {
        this.#ks = ks;
        this.invokeChange();
    }

    set specular(specular) {
        this.#specular = specular;
        this.invokeChange();
    }

    set phong(phong) {
        this.#phong = phong;
        this.invokeChange();
    }

    get ka() {
        return this.#ka;
    }

    get ambient() {
        return this.#ambient;
    }

    get kd() {
        return this.#kd;
    }

    get diffuse() {
        return this.#diffuse;
    }

    get ks() {
        return this.#ks;
    }

    get specular() {
        return this.#specular;
    }

    get phong() {
        return this.#phong;
    }

};

const AlphaModeCodes = {
    OPAQUE: 0,
    MASK: 1,
    BLEND: 2
} as const;

export interface PbrMaterialOptions {

    /*
    * 是否引用的外部texture，如果是则texture不能直接销毁
    */
    externalTexture: boolean;

    baseColorFactor: NumArr4;
    baseColorTexture?: GPUTexture;
    baseColorSampler?: GPUSampler;
    baseColorTexCoord?: number;

    metallicFactor: number;
    roughnessFactor: number;
    metallicRoughnessTexture?: GPUTexture;
    metallicRoughnessSampler?: GPUSampler;
    metallicRoughnessTexCoord?: number;

    normalScale: number;
    normalTexture?: GPUTexture;
    normalSampler?: GPUSampler;
    normalTexCoord?: number;

    emmissiveFactor: NumArr3;
    emmissiveTexture?: GPUTexture;
    emmissiveSampler?: GPUSampler;
    emmissiveTexCoord?: number;

    occlusionStrength: number;
    occlusionTexture?: GPUTexture;
    occlusionSampler?: GPUSampler;
    occlusionTexCoord?: number;

    alphaMode: TGLTF.MaterialAlphaMode;
    alphaCutoff: number;
    doubleSided: boolean;

}

export class PbrMaterial {

    options: PbrMaterialOptions

    static bindgroupLayout?: GPUBindGroupLayout;
    bindgroup?: GPUBindGroup;
    uniform?: GPUBuffer;

    static defaultTexture?: GPUTexture;
    static defaultSampler?: GPUSampler;

    constructor(options: PbrMaterialOptions) {

        this.options = options;

    }

    static getBindGroupLayout(device: GPUDevice): GPUBindGroupLayout {
        if (!PbrMaterial.bindgroupLayout) {

            const visibility = GPUShaderStage.FRAGMENT;
            const texutreLayout: GPUTextureBindingLayout = {
                sampleType: 'float',
                viewDimension: '2d',
                multisampled: false
            }
            const samplerLayout: GPUSamplerBindingLayout = { type: 'filtering' };

            const layout = device.createBindGroupLayout({
                label: "PbrMaterial",
                entries: [
                    //pbrMaterial
                    { binding: 0, visibility, buffer: { type: 'uniform' } },
                    //baseColor
                    { binding: 1, visibility, texture: texutreLayout },
                    { binding: 2, visibility, sampler: samplerLayout },
                    //metallicRoughness
                    { binding: 3, visibility, texture: texutreLayout },
                    { binding: 4, visibility, sampler: samplerLayout },
                    //normal
                    { binding: 5, visibility, texture: texutreLayout },
                    { binding: 6, visibility, sampler: samplerLayout },
                    //emmissive
                    { binding: 7, visibility, texture: texutreLayout },
                    { binding: 8, visibility, sampler: samplerLayout },
                    //occlusion
                    { binding: 9, visibility, texture: texutreLayout },
                    { binding: 10, visibility, sampler: samplerLayout }
                ]
            });
            PbrMaterial.bindgroupLayout = layout;
        }
        return PbrMaterial.bindgroupLayout;
    }

    getDefaultTexture(device: GPUDevice): GPUTexture {
        if (PbrMaterial.defaultTexture == null) {
            const defaultTexture = device.createTexture({
                label: "pbrMaterial default texture",
                size: [1, 1, 1],
                format: 'rgba8unorm',
                usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
            });
            device.queue.writeTexture(
                { texture: defaultTexture },
                new Uint8Array([0, 0, 0, 0]),
                { bytesPerRow: 4 },
                { width: 1, height: 1 }
            );
            PbrMaterial.defaultTexture = defaultTexture;
        }
        return PbrMaterial.defaultTexture;
    }

    getDefaultSampler(device: GPUDevice): GPUSampler {
        if (PbrMaterial.defaultSampler == null) {
            const defaultSampler = device.createSampler({
                label: "pbrMaterial default sampler",
                minFilter: 'linear',
                magFilter: 'linear',
                addressModeU: 'repeat',
                addressModeV: 'repeat'
            });
            PbrMaterial.defaultSampler = defaultSampler;
        }
        return PbrMaterial.defaultSampler;
    }

    getBindGroup(device: GPUDevice): GPUBindGroup {
        if (!this.bindgroup) {
            const bindgroup = device.createBindGroup({
                label: "pbrMaterial",
                layout: PbrMaterial.getBindGroupLayout(device),
                entries: [
                    { binding: 0, resource: { buffer: this.getUniform(device) } },
                    { binding: 1, resource: this.options.baseColorTexture ?? this.getDefaultTexture(device) },
                    { binding: 2, resource: this.options.baseColorSampler ?? this.getDefaultSampler(device) },
                    { binding: 3, resource: this.options.metallicRoughnessTexture ?? this.getDefaultTexture(device) },
                    { binding: 4, resource: this.options.metallicRoughnessSampler ?? this.getDefaultSampler(device) },
                    { binding: 5, resource: this.options.normalTexture ?? this.getDefaultTexture(device) },
                    { binding: 6, resource: this.options.normalSampler ?? this.getDefaultSampler(device) },
                    { binding: 7, resource: this.options.emmissiveTexture ?? this.getDefaultTexture(device) },
                    { binding: 8, resource: this.options.emmissiveSampler ?? this.getDefaultSampler(device) },
                    { binding: 9, resource: this.options.occlusionTexture ?? this.getDefaultTexture(device) },
                    { binding: 10, resource: this.options.occlusionSampler ?? this.getDefaultSampler(device) },
                ]
            });
            this.bindgroup = bindgroup;
        }
        return this.bindgroup;
    }

    getUniform(device: GPUDevice): GPUBuffer {

        if (!this.uniform) {
            const def = makeShaderDataDefinitions(code);
            const view = makeStructuredView(def.uniforms.pbrMaterial);
            const uniform = device.createBuffer({
                label: "pbrMaterial",
                size: view.arrayBuffer.byteLength,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
            });
            const data = {
                baseColorFactor: this.options.baseColorFactor,
                hasBaseColorTexture: (this.options.baseColorTexture == null) ? 0 : 1,
                metallicFactor: this.options.metallicFactor,
                roughnessFactor: this.options.roughnessFactor,
                hasMetallicRoughnessTexture: (this.options.metallicRoughnessTexture == null) ? 0 : 1,
                normalScale: this.options.normalScale,
                hasNormalTexture: (this.options.normalTexture == null) ? 0 : 1,
                emmissiveFactor: this.options.emmissiveFactor,
                hasEmmissiveTexture: (this.options.emmissiveTexture == null) ? 0 : 1,
                occlusionStrength: this.options.occlusionStrength,
                hasOcclusionTexture: (this.options.occlusionTexture == null) ? 0 : 1,
                alphaMode: AlphaModeCodes[this.options.alphaMode],
                alphaCutoff: this.options.alphaCutoff
            };

            view.set(data);

            device.queue.writeBuffer(uniform, 0, view.arrayBuffer);

            this.uniform = uniform;
        }

        return this.uniform;

    }


    destroy() {
        if (this.options.externalTexture) {
            return;
        }

        if (this.options.baseColorTexture != null) {
            this.options.baseColorTexture.destroy();
            this.options.baseColorTexture = null;
        }

        if (this.options.metallicRoughnessTexture != null) {
            this.options.metallicRoughnessTexture.destroy();
            this.options.metallicRoughnessTexture = null;
        }

        if (this.options.normalTexture != null) {
            this.options.normalTexture.destroy();
            this.options.normalTexture = null;
        }

        if (this.options.emmissiveTexture != null) {
            this.options.emmissiveTexture.destroy();
            this.options.emmissiveTexture = null;
        }

        if (this.options.occlusionTexture != null) {
            this.options.occlusionTexture.destroy();
            this.options.occlusionTexture = null;
        }

    }

}