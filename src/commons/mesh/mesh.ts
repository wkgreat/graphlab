import { mat4, vec3, vec4 } from 'gl-matrix';
import { createBuffersAndAttributesFromArrays, makeShaderDataDefinitions, makeStructuredView } from 'webgpu-utils';
import { Colors } from '../color';
import type { NumArr4 } from '../defines';
import { BlinnPhongMaterial } from '../material';
import { normalMatrix, vec4t3 } from '../matrix';
import type Scene from '../scene';
import code from '../shader/mesh.wgsl';
import type { CanvasGPUInfo, GPUInfo } from '../webgpuUtils';
import HalfEdgeInfo from './halfedge';
import RenderObject, { type RenderObjectOptions, type RenderOptions } from './object';
import SimpleLine from './simpleline';

export type MeshColorMode = 'vertex' | 'face' | 'mesh'

export const MeshSelectMode = {
    NONE: 0,
    VERTEX: 1,
    FACE: 2,
    MESH: 3
} as const;

export type MeshSelectMode = typeof MeshSelectMode[keyof typeof MeshSelectMode];

export interface MeshOptions extends RenderObjectOptions {};

export default class Mesh extends RenderObject {

    render: MeshRender | null = null;

    positions?: Float32Array
    normals?: Float32Array
    texcoords?: Float32Array

    vertexIndices?: Uint32Array
    wireframeVertexIndices?: Uint32Array

    textureIndices?: Uint32Array
    textures?: string[]

    colors?: Float32Array
    colorMode?: MeshColorMode
    wireframeColors?: Float32Array

    #material: BlinnPhongMaterial;
    #lighting: boolean = true;

    modelmtx: mat4 = mat4.create();

    halfedge?: HalfEdgeInfo;

    #wireframe: boolean = false;

    selectMode: number = MeshSelectMode.NONE;
    selectVertexNRing: number = 0;

    constructor(options: MeshOptions = {}) {
        options.label = options.label ?? "Mesh";
        super(options);
        this.webgpu.uniforms = {};
        this.webgpu.pipelines = {};
        this.webgpu.buffers = {};
        this.webgpu.textures = {};
        this.webgpu.samplers = {};
        this.modelmtx = mat4.create();

        this.#material = new BlinnPhongMaterial({
            ka: 0.1,
            ambient: [1, 1, 1, 1],
            kd: 1,
            diffuse: [0.1, 0.1, 0.1, 0],
            ks: 0.1,
            specular: [1, 1, 1, 1],
            phong: 1.5
        });
    }

    set wireframe(w: boolean) {
        this.#wireframe = w;
        this.refreshVertexBuffers();
    }

    set lighting(lighting: boolean) {
        this.#lighting = lighting;
    }

    get lighting(): boolean {
        return this.#lighting;
    }

    get vertexCount(): number {
        return this.positions.length / 3;
    }

    transform(mtx: mat4) {

        const cnt = this.positions.length / 3;

        //positions
        for (let i = 0; i < cnt; ++i) {
            const p = this.positions.subarray(i * 3, i * 3 + 3);
            const v = vec4.fromValues(p[0], p[1], p[2], 1);
            vec4.transformMat4(v, v, mtx);
            p[0] = v[0];
            p[1] = v[1];
            p[2] = v[2];

        }
        if (this.normals) {
            for (let i = 0; i < cnt; ++i) {
                const normalmtx = normalMatrix(mtx);
                const n = this.normals.subarray(i * 3, i * 3 + 3);
                const v = vec4.fromValues(n[0], n[1], n[2], 1);
                vec4.transformMat4(v, v, normalmtx);
                n[0] = v[0];
                n[1] = v[1];
                n[2] = v[2];
            }
        }

        this.refreshVertexBuffers(true);
    }

    createDefaultColors() {
        const vertexCount = this.positions.length / 3;
        const color = [0, 1, 0, 1];
        this.colors = new Float32Array(Array(vertexCount).fill(color).flat());
    }

    setColor(color: NumArr4) {
        const vertexCount = this.positions.length / 3;
        if (Math.max(...color) > 1) {
            color = color.map(c => c / 255) as NumArr4;
        }
        this.colors = new Float32Array(Array(vertexCount).fill(color).flat());
        this.refreshDefaultVertexBuffer(true);
    }

    setColors(colors: NumArr4[]) {
        const vertexCount = this.positions.length / 3;
        const colorCount = colors.length;
        const colorData = new Float32Array(vertexCount * 4);
        for (let i = 0; i < vertexCount; ++i) {

            const color = colors[i % colorCount];
            colorData[i * 4] = color[0];
            colorData[i * 4 + 1] = color[1];
            colorData[i * 4 + 2] = color[2];
            colorData[i * 4 + 3] = color[3];

        }

        this.colors = colorData;
        this.refreshDefaultVertexBuffer(true);
    }

    createDefaultWireframeColors() {
        const vertexCount = this.positions.length / 3;
        const color = [0, 0, 0, 0.1];
        this.wireframeColors = new Float32Array(Array(vertexCount).fill(color).flat());
    }

    setWireframeColor(color: NumArr4) {
        const vertexCount = this.positions.length / 3;
        if (Math.max(...color) > 1) {
            color = color.map(c => c / 255) as NumArr4;
        }
        this.wireframeColors = new Float32Array(Array(vertexCount).fill(color).flat());
        this.refreshWireframeVertexBuffer(true);
    }

    get wireframe() {
        return this.#wireframe;
    }

    get frontFace() {
        return this.renderOptions.frontFace;
    }

    createHalfEdge() {
        this.halfedge = new HalfEdgeInfo(this);
    }

    override initWebGPU(gpuinfo: GPUInfo, canvasinfo: CanvasGPUInfo, scene: Scene, options?: RenderOptions) {
        this.webgpu.gpuinfo = gpuinfo;
        this.webgpu.canvasinfo = canvasinfo;
        this.webgpu.definition = makeShaderDataDefinitions(code);

        this.render = new MeshRender(gpuinfo, canvasinfo, scene);

        this.refreshRenderOptions(options);

        this.refreshVertexBuffers();

        this.refreshUniforms();

        this.createPipeline();
    }

    createWireFrameVertexIndices() {

        if (this.vertexIndices) {
            if (!this.wireframeVertexIndices) {
                const vertexIndexLen = this.vertexIndices.length;
                this.wireframeVertexIndices = new Uint32Array(vertexIndexLen / 3 * 5);
                for (let i = 0; i < this.vertexIndices.length / 3; ++i) {

                    this.wireframeVertexIndices[i * 5] = this.vertexIndices[i * 3];
                    this.wireframeVertexIndices[i * 5 + 1] = this.vertexIndices[i * 3 + 1];
                    this.wireframeVertexIndices[i * 5 + 2] = this.vertexIndices[i * 3 + 2];
                    this.wireframeVertexIndices[i * 5 + 3] = this.vertexIndices[i * 3];
                    this.wireframeVertexIndices[i * 5 + 4] = 0xFFFFFFFF;

                }
            }
        }
    }

    setModelMatrix(modelmtx: mat4) {
        this.modelmtx = modelmtx;
    }

    refreshDefaultVertexBuffer(force: boolean = false) {
        if (!this.webgpu.gpuinfo) {
            return;
        }

        const device = this.webgpu.gpuinfo.device;

        if (force || !("default" in this.webgpu.buffers)) {
            if (!this.colors) {
                this.createDefaultColors();
            }
            const oldBuffer = this.webgpu.buffers.default;

            if (this.vertexIndices) {
                const newBuffer = createBuffersAndAttributesFromArrays(device, {
                    position: { data: this.positions, numComponents: 3 },
                    normal: { data: this.normals, numComponents: 3 },
                    texcoord: { data: this.texcoords, numComponents: 2 },
                    colors: { data: this.colors, numComponents: 4 },
                    indices: this.vertexIndices
                });
                this.webgpu.buffers.default = newBuffer;
            } else {
                const newBuffer = createBuffersAndAttributesFromArrays(device, {
                    position: { data: this.positions, numComponents: 3 },
                    normal: { data: this.normals, numComponents: 3 },
                    texcoord: { data: this.texcoords, numComponents: 2 },
                    colors: { data: this.colors, numComponents: 4 }
                });
                this.webgpu.buffers.default = newBuffer;
            }

            if (oldBuffer) {
                oldBuffer.buffers.forEach(b => b.destroy());
                if (oldBuffer.indexBuffer) {
                    oldBuffer.indexBuffer.destroy();
                }
            }
        }
    }

    refreshWireframeVertexBuffer(force: boolean = false) {
        if (!this.webgpu.gpuinfo) {
            return;
        }

        const device = this.webgpu.gpuinfo.device;

        if (force || !("wireframe" in this.webgpu.buffers)) {

            this.createWireFrameVertexIndices();
            if (!this.wireframeColors) {
                this.createDefaultWireframeColors();
            }
            const oldBuffer = this.webgpu.buffers.wireframe

            if (this.vertexIndices) {
                const newBuffer = createBuffersAndAttributesFromArrays(device, {
                    position: { data: this.positions, numComponents: 3 },
                    normal: { data: this.normals, numComponents: 3 },
                    texcoord: { data: this.texcoords, numComponents: 2 },
                    colors: { data: this.wireframeColors, numComponents: 4 },
                    indices: this.wireframeVertexIndices
                });
                this.webgpu.buffers.wireframe = newBuffer;
            } else {
                const newBuffer = createBuffersAndAttributesFromArrays(device, {
                    position: { data: this.positions, numComponents: 3 },
                    normal: { data: this.normals, numComponents: 3 },
                    texcoord: { data: this.texcoords, numComponents: 2 },
                    colors: { data: this.wireframeColors, numComponents: 4 }
                });
                this.webgpu.buffers.wireframe = newBuffer;
            }

            if (oldBuffer) {
                oldBuffer.buffers.forEach(b => b.destroy());
                if (oldBuffer.indexBuffer) {
                    oldBuffer.indexBuffer.destroy();
                }

            }
        }
    }

    refreshVertexBuffers(force: boolean = false) {

        this.refreshDefaultVertexBuffer(force);
        this.refreshWireframeVertexBuffer(force);
    }

    refreshUniforms() {

        const device = this.webgpu.gpuinfo.device;

        this.render.scene.refreshUniform();

        //material
        const materialView = makeStructuredView(this.webgpu.definition.uniforms.material);
        if (!("material" in this.webgpu.uniforms)) {
            this.webgpu.uniforms.material = device.createBuffer({
                label: `${this.label} material uniform`,
                size: materialView.arrayBuffer.byteLength,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
            });
        }
        materialView.set({
            blinnPhong: {
                ka: this.#material.ka,
                kd: this.#material.kd,
                ks: this.#material.ks,
                phong: this.#material.phong,
                ambient: this.#material.ambient,
                diffuse: this.#material.diffuse,
                specular: this.#material.specular
            }
        })

        device.queue.writeBuffer(this.webgpu.uniforms.material, 0, materialView.arrayBuffer);

        //model
        const modelView = makeStructuredView(this.webgpu.definition.uniforms.model);

        if (!("model" in this.webgpu.uniforms)) {
            this.webgpu.uniforms.model = device.createBuffer({
                label: `${this.label} model uniform`,
                size: modelView.arrayBuffer.byteLength,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
            });
        }
        modelView.set({
            hasnormal: this.normals ? 1 : 0,
            hastexcoord: this.texcoords ? 1 : 0,
            lighting: this.#lighting ? 1 : 0,
            space: this.renderOptions.space,
            modelmtx: this.modelmtx,
            normalmtx: normalMatrix(this.modelmtx)
        });

        device.queue.writeBuffer(this.webgpu.uniforms.model, 0, modelView.arrayBuffer);


    }

    createPipeline() {

        const device = this.webgpu.gpuinfo.device;

        this.webgpu.module = device.createShaderModule({
            label: this.label,
            code
        });

        const bindGroupLayout = device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                    buffer: { type: 'uniform' }
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                    buffer: { type: 'uniform' }
                }
            ]
        });

        const layout = device.createPipelineLayout({
            bindGroupLayouts: [
                this.render.scene.bindGroupLayout,
                bindGroupLayout
            ]
        });

        const descriptor: GPURenderPipelineDescriptor = {
            label: this.label,
            layout: layout,
            vertex: {
                module: this.webgpu.module,
                buffers: this.webgpu.buffers.default.bufferLayouts
            },
            fragment: {
                module: this.webgpu.module,
                targets: [
                    {
                        format: this.webgpu.canvasinfo.context.getConfiguration().format,
                        blend: {
                            color: {
                                operation: 'add',
                                srcFactor: 'src-alpha',
                                dstFactor: 'one-minus-src-alpha',
                            },
                            alpha: {
                                operation: 'add',
                                srcFactor: 'one',
                                dstFactor: 'one-minus-src-alpha',
                            }
                        }
                    }
                ]
            },
            primitive: {
                topology: 'triangle-list',
                cullMode: 'none',
                frontFace: this.renderOptions.frontFace
            },
            depthStencil: {
                format: 'depth32float',
                depthWriteEnabled: true,
                depthCompare: 'less-equal',
            }
        };

        descriptor.depthStencil.depthBias = this.renderOptions.depth.depthBias;
        descriptor.depthStencil.depthBiasSlopeScale = this.renderOptions.depth.depthBiasSlopeScale;
        this.webgpu.pipelines["default"] = device.createRenderPipeline(descriptor);

        descriptor.vertex.buffers = this.webgpu.buffers.wireframe.bufferLayouts;
        descriptor.primitive.topology = 'line-strip';
        descriptor.primitive.stripIndexFormat = 'uint32';
        descriptor.depthStencil.depthBias = 0;
        descriptor.depthStencil.depthBiasSlopeScale = 0;
        this.webgpu.pipelines["wireframe"] = device.createRenderPipeline(descriptor);

    }

    draw(pass: GPURenderPassEncoder) {

        const device = this.render.gpuinfo.device;
        this.refreshUniforms();

        const bindGroup = device.createBindGroup({
            layout: this.webgpu.pipelines["default"].getBindGroupLayout(1),
            entries: [
                { binding: 0, resource: { buffer: this.webgpu.uniforms.material } },
                { binding: 1, resource: { buffer: this.webgpu.uniforms.model } }
            ]
        });

        if (this.wireframe) {
            const bufferInfo = this.webgpu.buffers.wireframe;
            pass.setPipeline(this.webgpu.pipelines["wireframe"]);
            pass.setBindGroup(0, this.render.scene.bindGroup);
            pass.setBindGroup(1, bindGroup);
            pass.setVertexBuffer(0, bufferInfo.buffers[0]);
            if (this.vertexIndices) {
                pass.setIndexBuffer(bufferInfo.indexBuffer, bufferInfo.indexFormat);
                pass.drawIndexed(bufferInfo.numElements);
            } else {
                pass.draw(this.vertexCount);
            }

        } else {
            const bufferInfo = this.webgpu.buffers.default;
            pass.setPipeline(this.webgpu.pipelines["default"]);
            pass.setBindGroup(0, this.render.scene.bindGroup);
            pass.setBindGroup(1, bindGroup);
            pass.setVertexBuffer(0, bufferInfo.buffers[0]);
            if (this.vertexIndices) {
                pass.setIndexBuffer(bufferInfo.indexBuffer, bufferInfo.indexFormat);
                pass.drawIndexed(bufferInfo.numElements);
            } else {
                pass.draw(this.vertexCount);
            }
        }

    }

    destroy() {
        Object.values(this.webgpu.buffers).forEach(info => {
            info.buffers.forEach(b => b.destroy());
            if (info.indexBuffer) {
                info.indexBuffer.destroy();
            }
        })
        Object.values(this.webgpu.uniforms).forEach(u => {
            u.destroy();
        })
        Object.values(this.webgpu.textures).forEach(t => {
            t.destroy();
        })
    }

    createNormalLine(length: number = 1): SimpleLine | null {
        if (!this.normals) {
            return null;
        } else {
            const cnt = this.vertexCount;
            const linePositions = new Float32Array(cnt * 2 * 3);
            const lineColors = new Float32Array(cnt * 2 * 4);
            for (let i = 0; i < cnt; ++i) {
                const ap = this.positions.subarray(i * 3, i * 3 + 3);
                const an = this.normals.subarray(i * 3, i * 3 + 3);

                const v4p0 = vec4.fromValues(ap[0], ap[1], ap[2], 1);
                vec4.transformMat4(v4p0, v4p0, this.modelmtx);
                const vp0 = vec4t3(v4p0);
                const vn = vec3.fromValues(an[0], an[1], an[2]);
                vec3.normalize(vn, vn);
                vec3.scale(vn, vn, length);
                const vp1 = vec3.add(vec3.create(), vp0, vn);

                linePositions.subarray(i * 6, i * 6 + 6).set([
                    ...vp0,
                    ...vp1
                ]);

                lineColors.subarray(i * 8, i * 8 + 8).set([
                    ...Colors.green,
                    ...Colors.red
                ])
            }
            const line = new SimpleLine({
                topology: 'line-list',
                positions: linePositions,
                colors: lineColors,
                indices: null
            });

            return line;
        }


    }

}

class MeshRender {
    gpuinfo: GPUInfo
    canvasInfo: CanvasGPUInfo
    scene: Scene

    constructor(gpuinfo: GPUInfo, canvasinfo: CanvasGPUInfo, scene: Scene) {
        this.gpuinfo = gpuinfo;
        this.canvasInfo = canvasinfo;
        this.scene = scene;
    }
}