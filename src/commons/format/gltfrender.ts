import { mat4 } from "gl-matrix";
import { makeShaderDataDefinitions, makeStructuredView, type ShaderDataDefinitions, type StructuredView } from "webgpu-utils";
import { PbrMaterial } from "../material";
import { normalMatrix } from "../matrix";
import type Scene from "../scene";
import code from '../shader/gltf.wgsl';
import { assertNotNull } from "../utils";
import type { CanvasGPUInfo, GPUInfo } from "../webgpuUtils";
import type GLTF from "./gltf";
import { GLTFAccessor, GLTFAccessorCompType, GLTFAttributres, type GLTFMesh, type GLTFNode, type GLTFPrimitive, type GLTFScene, type TGLTF } from "./gltf";

interface GLTFPipelineAttributeOptions {
    exists: boolean;
    stride: number;
    offset: number;
}

export interface GLTFPipelineOptions {

    mode: TGLTF.MeshPrimitiveMode;
    indices: boolean;
    position: GLTFPipelineAttributeOptions
    normal: GLTFPipelineAttributeOptions;
    tangent: GLTFPipelineAttributeOptions;
    texoord: GLTFPipelineAttributeOptions[];
    joints: GLTFPipelineAttributeOptions[];
    weights: GLTFPipelineAttributeOptions[];
    morph: boolean;
    colorTexutre: boolean;
    metalTexture: boolean;
    normalTexture: boolean;
    emmissiveTexture: boolean;
    occlusionTexture: boolean;
    alphaMode: TGLTF.MaterialAlphaMode;
    doubleSided: boolean;

}

class GLTFPipeline {

    options: GLTFPipelineOptions

    gpuinfo: GPUInfo;
    canvasinfo: CanvasGPUInfo;
    scene: Scene;
    definition?: ShaderDataDefinitions;
    pipeline?: GPURenderPipeline;

    constructor(options: GLTFPipelineOptions) {
        this.options = options;
    }

    static getAttributeOptions(gltf: GLTF, primitive: GLTFPrimitive, attr: GLTFAttributres): GLTFPipelineAttributeOptions {
        const exists = attr in primitive.json.attributes;
        let offset: number = 0;
        let stride: number = 0;
        if (exists) {
            const accessor = primitive.getAssessor(attr);
            const bufferView = primitive.getBufferView(attr);
            stride = bufferView.byteStride ?? accessor.getElementBytes()
            offset = 0;
        } else {
            stride = 0;
            offset = 0;
        }

        return {
            exists,
            stride,
            offset
        }
    }

    static getMultiAttributeOptions(gltf: GLTF, primitive: GLTFPrimitive, attr: GLTFAttributres): GLTFPipelineAttributeOptions[] {
        return Object.keys(primitive.json.attributes).filter(a => a.startsWith(attr)).map(a => {
            const ref = primitive.json.attributes[a];
            const accessor = gltf.assessors[ref];
            const bufferView = gltf.bufferViews[accessor.json.bufferView]; //TODO sparse
            const stride = bufferView.byteStride ?? accessor.getElementBytes()
            return {
                exists: true,
                stride,
                offset: 0
            }
        });
    }

    static attributeKey(name: string, options: GLTFPipelineAttributeOptions) {
        if (options.exists) {
            return `${name}:T:${options.stride}:${options.offset}`;
        } else {
            return `${name}:F`
        }
    }

    static multiAttributeKey(name: string, options: GLTFPipelineAttributeOptions[]) {
        return options.map(opt => this.attributeKey(name, opt)).join(",");
    }

    static getPipelineOptionsOfPrimitive(gltf: GLTF, primitive: GLTFPrimitive): GLTFPipelineOptions {
        const material = primitive.getMeterial();

        const options: GLTFPipelineOptions = {
            mode: primitive.getMode(),
            indices: primitive.hasIndicies(),
            position: this.getAttributeOptions(gltf, primitive, GLTFAttributres.POSITION),
            normal: this.getAttributeOptions(gltf, primitive, GLTFAttributres.NORMAL),
            tangent: this.getAttributeOptions(gltf, primitive, GLTFAttributres.TANGENT),
            texoord: this.getMultiAttributeOptions(gltf, primitive, GLTFAttributres.TEXCOORD),
            joints: this.getMultiAttributeOptions(gltf, primitive, GLTFAttributres.JOINTS),
            weights: this.getMultiAttributeOptions(gltf, primitive, GLTFAttributres.WEIGHTS),
            morph: primitive.hasMorph(),
            colorTexutre: material.hasBaseColorTexture(),
            metalTexture: material.hasMetallicRoughnessTexture(),
            normalTexture: material.hasNormalTexture(),
            emmissiveTexture: material.hasEmissiveTexture(),
            occlusionTexture: material.hasOcclusionTexture(),
            alphaMode: material.getAlphaMode(),
            doubleSided: material.getDoubleSided(),
        }

        return options;
    }

    static getPipelineKeyOfOptions(options: GLTFPipelineOptions): string {
        function boolstr(p: string, b: boolean): string {
            return b ? `${p}:T` : `${p}:F`;
        }

        const s = [
            options.mode,
            this.attributeKey("pos", options.position),
            this.attributeKey("nor", options.normal),
            this.attributeKey("tan", options.tangent),
            this.multiAttributeKey("tex", options.texoord),
            this.multiAttributeKey("jot", options.joints),
            this.multiAttributeKey("wgt", options.weights),
            boolstr("mor", options.morph),
            options.alphaMode,
            boolstr("dbs", options.doubleSided),
        ]

        const key = s.join("|");

        return key;
    }


    getBlend(): GPUBlendState {
        if (this.options.alphaMode === 'BLEND') {
            return {
                color: {
                    srcFactor: 'src-alpha',       // SrcAlpha
                    dstFactor: 'one-minus-src-alpha', // 1 - SrcAlpha
                    operation: 'add'
                },
                alpha: {
                    srcFactor: 'one',             // 对 alpha 通道一般用 1
                    dstFactor: 'one-minus-src-alpha',
                    operation: 'add'
                }
            };
        } else return undefined;
    }

    getCullMode(): GPUCullMode {
        if (this.options.doubleSided) {
            return 'none';
        } else {
            return 'front';
        }
    }

    getDepthWriteEnabled(): boolean {
        if (this.options.alphaMode === 'BLEND') {
            return false;
        } else {
            return true;
        }
    }

    createPipeline(gpuinfo: GPUInfo, canvasinfo: CanvasGPUInfo, scene: Scene) {
        this.gpuinfo = gpuinfo
        this.canvasinfo = canvasinfo
        this.scene = scene;

        const label = "gltf";

        const device = gpuinfo.device;

        this.definition = makeShaderDataDefinitions(code);

        const module = device.createShaderModule({
            label,
            code
        });

        const gltfModelLayout = device.createBindGroupLayout({
            label,
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                    buffer: {
                        type: 'uniform'
                    }
                }
            ]
        });

        const pipelineLayout = device.createPipelineLayout({
            label,
            bindGroupLayouts: [
                this.scene.bindGroupLayout,
                PbrMaterial.getBindGroupLayout(device),
                gltfModelLayout
            ]
        });

        /*
            //TODO 将公用bufferView的属性合并成一个vertexBuffer
            position
            normal
            tagent
            texcoord 0,
            texcoord 1,
            ...
            texcoord n,
            joints 0,
            ...
            joints n,
            weights 0,
            ...,
            weights n
        */
        let location: number = 0;
        const vertexBufferLayouts: GPUVertexBufferLayout[] = [];
        vertexBufferLayouts.push({
            arrayStride: this.options.position.stride,
            attributes: [
                { shaderLocation: location++, offset: 0, format: 'float32x3' } //TODO format
            ]
        });
        vertexBufferLayouts.push({
            arrayStride: this.options.normal.stride,
            attributes: [
                { shaderLocation: location++, offset: 0, format: 'float32x3' }
            ]
        });
        vertexBufferLayouts.push({
            arrayStride: this.options.tangent.stride,
            attributes: [
                { shaderLocation: location++, offset: 0, format: 'float32x3' }
            ]
        });
        for (let i = 0; i < 5; ++i) {
            const texcoord = this.options.texoord[i];
            vertexBufferLayouts.push({
                arrayStride: texcoord?.stride ?? 8,
                attributes: [
                    { shaderLocation: location++, offset: 0, format: 'float32x2' }
                ]
            });
        }


        const pipeline = device.createRenderPipeline({
            label,
            layout: pipelineLayout,
            vertex: {
                module,
                buffers: vertexBufferLayouts
            },
            fragment: {
                module,
                targets: [
                    {
                        format: canvasinfo.context.getConfiguration().format,
                        blend: this.getBlend()
                    }
                ],
            },
            primitive: {
                topology: 'triangle-list', //TODO
                cullMode: this.getCullMode(),
                frontFace: 'cw', //TODO 自动判断
            },
            depthStencil: {
                depthWriteEnabled: this.getDepthWriteEnabled(),
                format: 'depth32float', //TODO
                depthCompare: 'less-equal'
            }
        });

        this.pipeline = pipeline;
    }
}


// TODO define common pipelins for similar primitives
export interface GLTFPrimitiveRenderOptions {

    gpuinfo: GPUInfo,
    canvasinfo: CanvasGPUInfo,
    scene: Scene;

    gltf: GLTF;
    primitive: GLTFPrimitive;

}

interface GLTFPrimitiveIndexBufferInfo {
    buffer: GPUBuffer
    format: GPUIndexFormat
    offset: number
    size: number
    count: number
}

interface GLTFPrimitiveVertexBufferInfo {
    buffer: GPUBuffer
    offset: number
    size: number
    count: number
}

export interface GLTRRenderParams {
    pass: GPURenderPassEncoder
    gltf: GLTF,
    sceneRef?: number,
    matrix?: mat4
};

export default class GLTFRender {

    static pipelines: { [key: string]: GLTFPipeline } = {};

    webgpu: {
        gpuinfo: GPUInfo;
        canvasinfo: CanvasGPUInfo;
        scene: Scene;
    };

    constructor(gpuinfo: GPUInfo, canvasinfo: CanvasGPUInfo, scene: Scene) {
        this.webgpu = {
            gpuinfo,
            canvasinfo,
            scene
        };
    }

    render(params: GLTRRenderParams) {
        const sref = params.sceneRef ?? params.gltf.json.scene;
        const scene = params.gltf.scenes[sref];
        this.renderScene(scene, params);
    }

    renderScene(scene: GLTFScene, params: GLTRRenderParams) {
        for (const ref of scene.nodes) {
            const node = params.gltf.nodes[ref];
            this.renderNode(node, params.matrix ?? mat4.create(), params);
        }
    }

    renderNode(node: GLTFNode, mtx: mat4, params: GLTRRenderParams) {

        const curMtx = mat4.multiply(mat4.create(), mtx, node.matrix);

        if (node.children != null) {
            for (const ref of node.children) {
                const child = params.gltf.nodes[ref];
                this.renderNode(child, curMtx, params);
            }
        }

        if (node.camera != null) {
            //TODO
        }

        if (node.skin != null) {
            //TODO
        }

        if (node.mesh != null) {
            const mesh = params.gltf.meshes[node.mesh];
            this.renderMesh(mesh, curMtx, params);
        }

    }

    renderMesh(mesh: GLTFMesh, mtx: mat4, params: GLTRRenderParams) {
        for (const p of mesh.primitives) {
            this.renderPrimitive(mesh, mtx, p, params);
        }
    }

    renderPrimitive(mesh: GLTFMesh, mtx: mat4, primitive: GLTFPrimitive, params: GLTRRenderParams) {

        const opts = GLTFPipeline.getPipelineOptionsOfPrimitive(params.gltf, primitive);
        const key = GLTFPipeline.getPipelineKeyOfOptions(opts);

        let gltfPipeline: GLTFPipeline;

        if (key in GLTFRender.pipelines) {
            gltfPipeline = GLTFRender.pipelines[key];
            if (gltfPipeline.pipeline == null) {
                gltfPipeline.createPipeline(this.webgpu.gpuinfo, this.webgpu.canvasinfo, this.webgpu.scene);
            }
        } else {
            console.log(key);
            console.log(opts);
            gltfPipeline = new GLTFPipeline(opts);
            gltfPipeline.createPipeline(this.webgpu.gpuinfo, this.webgpu.canvasinfo, this.webgpu.scene);
            GLTFRender.pipelines[key] = gltfPipeline;
        }

        const device = this.webgpu.gpuinfo.device;

        //uniform
        const modelView = makeStructuredView(gltfPipeline.definition.uniforms.model);
        const texcoordOrderMap = primitive.getGPUMaterialTexCoordMap();
        if (primitive.webgpu.uniform == null) {
            primitive.webgpu.uniform = this.createModelUniform(device, modelView);
        }
        modelView.set({
            modelmtx: mtx,
            normalmtx: normalMatrix(mtx),
            tangentmtx: normalMatrix(mtx),
            hasTangent: primitive.hasTangent() ? 1 : 0,
            texcoordOrder: {
                baseColor: texcoordOrderMap.baseColor ?? 0,
                metallicRoughness: texcoordOrderMap.metallicRoughness ?? 0,
                normal: texcoordOrderMap.normal ?? 0,
                emmissive: texcoordOrderMap.emmissive ?? 0,
                occlusion: texcoordOrderMap.occlusion ?? 0
            }
        });
        // TODO 动静分离
        device.queue.writeBuffer(primitive.webgpu.uniform, 0, modelView.arrayBuffer);


        // bindgroup
        const bindgroup = device.createBindGroup({
            label: "primitive",
            layout: gltfPipeline.pipeline.getBindGroupLayout(2),
            entries: [
                { binding: 0, resource: { buffer: primitive.webgpu.uniform } }
            ]
        });

        let indexBufferInfo: GLTFPrimitiveIndexBufferInfo = null;

        if (primitive.hasIndicies()) {
            indexBufferInfo = this.getPrimitiveIndexBuffer(device, primitive);
            if (indexBufferInfo == null) {
                return;
            }
        }

        let positionBufferInfo: GLTFPrimitiveVertexBufferInfo = null;
        if (primitive.hasPosition()) {
            positionBufferInfo = this.getPrimitiveAttributeBuffer(device, primitive, GLTFAttributres.POSITION);
            if (positionBufferInfo == null) {
                return;
            }
        }

        let normalBufferInfo: GLTFPrimitiveVertexBufferInfo = null;
        if (primitive.hasNormal()) {
            normalBufferInfo = this.getPrimitiveAttributeBuffer(device, primitive, GLTFAttributres.NORMAL);
        }

        let tangentBufferInfo: GLTFPrimitiveVertexBufferInfo = null;
        if (primitive.hasTangent()) {
            tangentBufferInfo = this.getPrimitiveAttributeBuffer(device, primitive, GLTFAttributres.TANGENT);
        }

        const texcoordAttrNames = primitive.getOrderedTexcoordAttrName();
        const texcoordBufferInfos = [];
        for (let i = 0; i < 5; ++i) {
            const name = texcoordAttrNames[i];
            if (name != null) {
                const idx = parseInt(name.split("_")[1]);
                texcoordBufferInfos.push(this.getPrimitiveAttributeBuffer(device, primitive, GLTFAttributres.TEXCOORD, idx));
            } else {
                texcoordBufferInfos.push(null);
            }
        }

        params.pass.setPipeline(gltfPipeline.pipeline);
        params.pass.setVertexBuffer(0, positionBufferInfo.buffer, positionBufferInfo.offset, positionBufferInfo.size);
        if (normalBufferInfo != null) {
            params.pass.setVertexBuffer(1, normalBufferInfo.buffer, normalBufferInfo.offset, normalBufferInfo.size);
        } else {
            params.pass.setVertexBuffer(1, primitive.getDefaultVec3FloatGPUBuffer(device));
        }
        if (tangentBufferInfo != null) {
            params.pass.setVertexBuffer(2, tangentBufferInfo.buffer, tangentBufferInfo.offset, tangentBufferInfo.size);
        } else {
            params.pass.setVertexBuffer(2, primitive.getDefaultVec4FloatGPUBuffer(device));
        }
        for (let i = 0; i < 5; ++i) {
            const info = texcoordBufferInfos[i];
            if (info != null) {
                params.pass.setVertexBuffer(3 + i, info.buffer, info.offset, info.size);
            } else {
                params.pass.setVertexBuffer(3 + i, primitive.getDefaultVec2FloatGPUBuffer(device));
            }
        }

        params.pass.setBindGroup(0, this.webgpu.scene.bindGroup);
        params.pass.setBindGroup(1, primitive.getMeterial().getGPUMaterial(device).getBindGroup(device));
        params.pass.setBindGroup(2, bindgroup);
        if (primitive.hasIndicies()) {
            params.pass.setIndexBuffer(indexBufferInfo.buffer, indexBufferInfo.format, indexBufferInfo.offset, indexBufferInfo.size);
            params.pass.drawIndexed(indexBufferInfo.count);
        } else {
            params.pass.draw(positionBufferInfo.count);
        }

    }

    getGPUIndexFormat(accessor: GLTFAccessor): GPUIndexFormat {
        switch (accessor.json.componentType) {
            case GLTFAccessorCompType.UNSIGNED_BYTE:
                return 'uint16'; // webgpu index格式不支持uint8，所以升级成uint16
            case GLTFAccessorCompType.UNSIGNED_SHORT:
                return 'uint16';
            case GLTFAccessorCompType.UNSIGNED_INT:
                return 'uint32';
        }
    }

    getPrimitiveIndexBuffer(device: GPUDevice, primitive: GLTFPrimitive): GLTFPrimitiveIndexBufferInfo | null {
        const accessor = primitive.gltf.assessors[primitive.json.indices];
        const bufferView = primitive.gltf.bufferViews[accessor.json.bufferView] //TODO sparse
        const buffer = primitive.gltf.buffers[bufferView.json.buffer];
        const comtyp = accessor.json.componentType;
        const format = this.getGPUIndexFormat(accessor);

        if (comtyp !== GLTFAccessorCompType.UNSIGNED_BYTE) {

            const accOffset = accessor.json.byteOffset ?? 0;
            const viewOffset = bufferView.json.byteOffset ?? 0;
            const viewlength = bufferView.byteLength;
            const offset = accOffset + viewOffset;
            const size = viewlength - accOffset;
            const count = accessor.json.count;
            const gpubuffer = buffer.getGPUBuffer(device, GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST);
            if (gpubuffer == null) {
                return null;
            } else {
                return {
                    buffer: gpubuffer,
                    format: format,
                    offset: offset,
                    size: size,
                    count
                }
            }

        } else {
            //TODO 处理 UNSIGNED_BYTE 的情况
            throw Error("Index Format 当前不支持uint8");
        }
    }

    getPrimitiveAttributeBuffer(device: GPUDevice, primitive: GLTFPrimitive, attr: GLTFAttributres, idx?: number): GLTFPrimitiveVertexBufferInfo | null {

        let key: string;
        if (idx != null) {
            key = `${attr}_${idx}`;
        } else {
            key = attr;
        }

        const ref = primitive.json.attributes[key];
        assertNotNull(ref);
        const accessor = primitive.gltf.assessors[ref];
        assertNotNull(accessor);
        const bufferView = primitive.gltf.bufferViews[accessor.json.bufferView]; //TODO sparse?
        assertNotNull(bufferView);
        const buffer = primitive.gltf.buffers[bufferView.json.buffer];
        assertNotNull(buffer);

        const accOffset = accessor.json.byteOffset ?? 0;
        const viewOffset = bufferView.json.byteOffset ?? 0;
        const viewlength = bufferView.byteLength;
        const offset = accOffset + viewOffset;
        const size = viewlength - accOffset;
        const count = accessor.json.count;

        const gpubuffer = buffer.getGPUBuffer(device, GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST);

        // const data = buffer.data;

        // if(data!=null) {
        //     const stride = bufferView.byteStride

        // }

        if (gpubuffer == null) {
            return null;
        } else {
            return {
                buffer: gpubuffer,
                offset,
                size,
                count
            }
        }
    }

    createModelUniform(device: GPUDevice, view: StructuredView): GPUBuffer {
        const uniform = device.createBuffer({
            label: "model uniform",
            size: view.arrayBuffer.byteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
        return uniform;
    }

}