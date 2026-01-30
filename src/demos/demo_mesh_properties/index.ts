import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
import { Pane } from 'tweakpane';
import Camera, { CameraMouseControl } from '../../commons/camera';
import { Ground } from '../../commons/objects';
import Projection from '../../commons/projection';
import { createDepthTexture, createRenderPassDescriptor, type CanvasGPUInfo } from '../../commons/webgpuUtils';
import { createCanvasGPUInfo, createGPUInfo, type GPUInfo } from '../demo_dem/webgpuUtils';
import './styles.css';

import bunnyURL from '/data/mesh/bun_zipper.ply?url';
import bunnyRes2URL from '/data/mesh/bun_zipper_res2.ply?url';
import bunnyRes3URL from '/data/mesh/bun_zipper_res3.ply?url';
import bunnyRes4URL from '/data/mesh/bun_zipper_res4.ply?url';

import { mat4, vec3 } from 'gl-matrix';
import PointLight from '../../commons/light';
import Axis from '../../commons/mesh/axis';
import Mesh, { MeshSelectMode } from '../../commons/mesh/mesh';
import { RenderSpace } from '../../commons/mesh/object';
import PLYMeshData from '../../commons/mesh/plyformat';
import type SimpleLine from '../../commons/mesh/simpleline';
import Scene from '../../commons/scene';

class MeshDemo {

    gpuInfo: GPUInfo | null = null

    canvasInfo: CanvasGPUInfo | null = null

    colorTexture: GPUTexture | null = null;

    depthFormat: GPUTextureFormat = 'depth32float'

    depthTexture: GPUTexture | null = null;

    camera: Camera | null = null;

    projection: Projection | null = null;

    scene: Scene | null = null;

    cameraMouseCtrl: CameraMouseControl | null = null;

    firstpass: boolean = true;

    ready: boolean = false;

    resizeObserver: ResizeObserver | null = null;

    ground: Ground | null = null;

    meshes: Mesh[] = [];

    axis: Axis | null = null;

    normalLine: SimpleLine | null = null;

    pane: Pane;

    readyCallbacks: ((MeshDemo) => void)[] = []

    paneParams = {
        wireframe: {
            enable: true,
            color: { r: 0, g: 0, b: 0, a: 0.1 }
        },
        lighting: false,
        mesh: "bunny",
        selectMode: MeshSelectMode.VERTEX,
        nring: 1
    }

    constructor() {

        createGPUInfo().then(gpuinfo => {
            if (gpuinfo === null) {
                console.error("GPU INFO is NULL");
                return;
            }
            this.gpuInfo = gpuinfo;
            const canvasId = 'webgpu-canvas';
            const canvasInfo = createCanvasGPUInfo({
                canvasId: canvasId,
                config: {
                    device: gpuinfo.device,
                    format: gpuinfo.gpu.getPreferredCanvasFormat()
                }
            });
            if (canvasInfo === null) {
                console.error("canvasInfo is NULL");
                return;
            }
            this.canvasInfo = canvasInfo;

            const width = this.canvasInfo.canvas.width;

            const height = this.canvasInfo.canvas.height;

            this.canvasInfo = canvasInfo;

            this.refreshDepthTexture();

            const from = [-15.161893, -102.341178, 161.866607, 1];
            const to = [-38.193603, 44.828018, 76.714302, 1];
            const up = [0, 0, 1, 0];

            this.camera = new Camera(from, to, up);

            this.projection = new Projection(Math.PI / 2, width / height, 1, 10000);

            this.scene = new Scene(this.camera, this.projection);
            this.scene.addLight(new PointLight([500, -500, 500], [1, 1, 1, 0.5]));
            this.scene.initWebGPU(this.gpuInfo, this.canvasInfo);
            this.scene.refreshViewport(this.canvasInfo.canvas.width, this.canvasInfo.canvas.height);

            this.cameraMouseCtrl = new CameraMouseControl(this.camera, this.canvasInfo.canvas);

            this.cameraMouseCtrl.enable();

            //objects
            this.ground = new Ground(1000, 1000);
            this.ground.initWebGPU(this.gpuInfo, this.canvasInfo);

            this.axis = new Axis({
                xlim: [0, 500],
                ylim: [0, 500],
                zlim: [0, 500],
            });
            this.axis.initWebGPU(this.gpuInfo, this.canvasInfo, this.scene);

            this.resizeObserver = new ResizeObserver(entries => {
                for (const entry of entries) {
                    const canvas = entry.target as HTMLCanvasElement;
                    const width = entry.contentBoxSize[0].inlineSize;
                    const height = entry.contentBoxSize[0].blockSize;
                    canvas.width = Math.max(1, Math.min(width, this.gpuInfo.device.limits.maxTextureDimension2D));
                    canvas.height = Math.max(1, Math.min(height, this.gpuInfo.device.limits.maxTextureDimension2D));
                    this.projection.aspect = canvas.width / canvas.height;
                    this.scene.refreshViewport(canvas.width, canvas.height);
                    this.refreshDepthTexture();
                }
            });

            this.resizeObserver.observe(canvasInfo.canvas);

            this.canvasInfo.canvas.addEventListener("click", (e) => {

                const pixel = this.getPixelOfMouse(e);
                const ray = this.scene.getRayOfPixel(pixel[0], pixel[1]);
                for (const mesh of this.meshes) {
                    mesh.halfedge?.selectByRay(ray);
                }

            });

            this.pane = new Pane({
                title: '参数控制',
                expanded: true, // 默认展开
            });
            this.pane.registerPlugin(EssentialsPlugin);

            this.setPane();

            this.ready = true;

            this.readyCallbacks.forEach(f => f(this));

        }).catch(e => {
            this.ready = false;
            console.error(e);
        })
    }

    getPixelOfMouse(event: MouseEvent) {
        const canvas = this.canvasInfo.canvas;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;
        return [x, y];
    }

    loadMesh(meshinfo: MeshInfo) {
        if (this.ready) {
            PLYMeshData.loadFromURL(meshinfo.url).then(data => {
                const mesh = data.toMesh();
                mesh.setModelMatrix(meshinfo.modelmtx);
                mesh.lighting = this.paneParams.lighting;
                mesh.wireframe = this.paneParams.wireframe.enable;
                const wireframeColor = this.paneParams.wireframe.color;
                mesh.setWireframeColor([
                    wireframeColor.r / 255,
                    wireframeColor.g / 255,
                    wireframeColor.b / 255,
                    wireframeColor.a
                ]);
                mesh.selectMode = MeshSelectMode.VERTEX;
                mesh.selectVertexNRing = this.paneParams.nring;
                mesh.initWebGPU(this.gpuInfo, this.canvasInfo, this.scene, {
                    depth: {
                        depthBias: 1,
                        depthBiasSlopeScale: 1
                    },
                    frontFace: meshinfo.frontFace,
                    space: RenderSpace.WORLD
                });

                mesh.createHalfEdge();
                mesh.halfedge.addVertexSelectCallback((vertices) => {
                    const contentdiv = document.getElementById("content-div");
                    if (vertices.length === 0) {
                        contentdiv.innerText = "";
                    } else {
                        const vertex = vertices[0];
                        const text = `
                            当前选中的Vertex: 
                            Vertex编号: ${vertex.ref}
                            关联HalfEdge编号: ${vertex.vertex.halfedge}
                        `
                        contentdiv.innerText = text;
                    }
                })
                mesh.halfedge.addFaceSelectCallback((faces) => {
                    const contentdiv = document.getElementById("content-div");
                    if (faces.length === 0) {
                        contentdiv.innerText = "";
                    } else {
                        const face = faces[0];
                        const vertices = face.face.vertices;
                        const text = `
                            当前选中的Face: 
                            Face编号: ${face.ref}
                            Vertiecs: ${vertices[0]},${vertices[1]},${vertices[2]}
                        `
                        contentdiv.innerText = text;
                    }

                });
                mesh.halfedge.renderMeanCurvature();

                this.meshes.push(mesh);
            });
        }
    }

    addMesh(mesh: Mesh) {

        mesh.initWebGPU(this.gpuInfo, this.canvasInfo, this.scene, {
            depth: {
                depthBias: 0,
                depthBiasSlopeScale: 0
            },
            space: RenderSpace.WORLD
        });
        this.meshes.push(mesh);

    }

    refreshDepthTexture() {
        const newDepthTexture = createDepthTexture(this.gpuInfo, this.canvasInfo.canvas.width, this.canvasInfo.canvas.height, this.depthFormat);
        if (this.depthTexture) {
            this.depthTexture.destroy();
        }
        this.depthTexture = newDepthTexture;
        return this.depthTexture;
    }

    getRenderPassDescriptor() {

        let descriptor: GPURenderPassDescriptor | null = null;

        if (this.ready) {
            if (!this.depthTexture) {
                return null;
            }
            descriptor = createRenderPassDescriptor({
                label: "demo",
                first: this.firstpass,
                colorTexture: this.canvasInfo.context.getCurrentTexture().createView(),
                depthTexture: this.depthTexture,
                clearColor: [0, 0, 0, 1],
                clearDepth: 1.0
            })
        }
        return descriptor;
    }

    render() {

        if (this.ready) {

            const encoder = this.gpuInfo.device.createCommandEncoder();
            this.firstpass = true;
            const pass = encoder.beginRenderPass(this.getRenderPassDescriptor());
            this.firstpass = false;

            if (this.ground) {
                this.ground.draw(this.gpuInfo, this.camera, this.projection, pass);
            }

            if (this.axis) {
                this.axis.draw(pass);
            }

            for (const mesh of this.meshes) {
                mesh.wireframe = false;
                mesh.draw(pass);
                if (this.paneParams.wireframe.enable) {
                    mesh.wireframe = true;
                    mesh.draw(pass);
                }
                if (mesh.halfedge) {
                    mesh.halfedge.selectedVertexMeshes.forEach(m => m.draw(pass));
                }
                if (mesh.halfedge) {
                    mesh.halfedge.selectedFaceMeshes.forEach(m => {
                        m.wireframe = false;
                        m.draw(pass);
                        if (this.paneParams.wireframe) {
                            m.wireframe = true;
                            m.draw(pass);
                        }
                    })
                }
            }

            if (this.normalLine) {
                this.normalLine.draw(pass);
            }

            pass.end();

            const commandBuffer = encoder.finish();

            this.gpuInfo.device.queue.submit([commandBuffer]);
        }

        requestAnimationFrame(this.render.bind(this));
    }

    draw() {

        requestAnimationFrame(this.render.bind(this));

    }

    setPane() {


        const lightingFolder = this.pane.addFolder({
            title: "Lighting",
            expanded: false,
        });

        lightingFolder.addBinding(this.paneParams, "lighting", {
            label: "lighting"
        }).on("change", (e) => {
            for (const mesh of this.meshes) {
                mesh.lighting = e.value;
            }
        })

        for (let i = 0; i < this.scene.lights.length; ++i) {
            this.scene.lights[i].addHelper(lightingFolder, {
                create: true,
                title: `PointLight ${i}`,
                expanded: false
            });
        }

        const meshFolder = this.pane.addFolder({
            title: "Mesh",
            expanded: true,
        });

        meshFolder.addBinding(this.paneParams.wireframe, "enable", {
            label: "wireframe"
        }).on("change", (e) => {
            for (const mesh of this.meshes) {
                mesh.wireframe = e.value;
            }
        })


        meshFolder.addBinding(this.paneParams.wireframe, "color", {
            label: "wireframe color"
        }).on("change", (e) => {
            for (const mesh of this.meshes) {
                const c = e.value;
                mesh.setWireframeColor([
                    c.r / 255,
                    c.g / 255,
                    c.b / 255,
                    c.a
                ]);
            }
        })

        const meshOptions = {};
        for (const key of Object.keys(MeshSources)) {
            meshOptions[key] = key;
        }

        meshFolder.addBinding(this.paneParams, 'mesh', {
            label: "Mesh",
            options: meshOptions
        }).on("change", (e) => {
            while (this.meshes.length > 0) {
                const m = this.meshes.pop();
                m.destroy();
            }
            if (this.normalLine) {
                this.normalLine.destroy();
                this.normalLine = null;
            }
            const key = e.value;
            const meshInfo = MeshSources[key];
            this.loadMesh(meshInfo);
        })

        meshFolder.addBinding(this.paneParams, 'selectMode', {
            label: "Select Mode",
            options: {
                none: MeshSelectMode.NONE,
                vertex: MeshSelectMode.VERTEX,
                face: MeshSelectMode.FACE
            }
        }).on("change", (e) => {
            for (const mesh of this.meshes) {
                mesh.selectMode = e.value;
            }
        });

        meshFolder.addBinding(this.paneParams, 'nring', {
            label: "vertex ring",
            options: {
                0: 0,
                1: 1
            }
        }).on("change", (e) => {
            for (const mesh of this.meshes) {
                mesh.selectVertexNRing = e.value;
            }
        });

        const normalBlade = meshFolder.addBlade({
            view: 'buttongrid',
            size: [2, 1],
            cells: (x, y) => ({
                title: ['生成法向量', '清除法向量'][x],
            }),
        });
        (normalBlade as any).on("click", (ev) => {
            if (ev.index[0] === 0) {
                for (const mesh of this.meshes) {
                    if (mesh.halfedge) {
                        mesh.halfedge.computeNormals();
                        this.normalLine = mesh.createNormalLine(1);
                        this.normalLine.initWebGPU(this.gpuInfo, this.canvasInfo, this.scene);
                    }
                }
            } else {
                if (this.normalLine) {
                    this.normalLine.destroy();
                }
                this.normalLine = null;
            }
        });

        meshFolder.addButton({
            title: "计算平均域面积"
        }).on("click", () => {
            for (const mesh of this.meshes) {
                if (mesh.halfedge) {
                    mesh.halfedge.renderAveraginRegionArea();
                }
            }
        });

        const curvatureBlade = meshFolder.addBlade({
            view: 'buttongrid',
            size: [2, 2],
            cells: (x, y) => ({
                title: [
                    ['平均曲率', '高斯曲率'],
                    ['主曲率1', '主曲率2'],
                ][y][x],
            }),
        });
        (curvatureBlade as any).on("click", (ev) => {
            const [x, y] = ev.index;
            const funcs = [
                [
                    (mesh: Mesh) => { console.log("平均曲率"); mesh.halfedge.renderMeanCurvature() },
                    (mesh: Mesh) => { console.log("高斯曲率"); mesh.halfedge.renderGaussianCurvature() },
                ],
                [
                    (mesh: Mesh) => { console.log("主曲率1"); mesh.halfedge.renderPrincipalCurvature(0) },
                    (mesh: Mesh) => { console.log("主曲率2"); mesh.halfedge.renderPrincipalCurvature(1) },
                ]
            ];
            for (const mesh of this.meshes) {
                if (mesh.halfedge) {
                    funcs[y][x](mesh);
                }
            }
        });
    }

    onReady(f: (MeshDemo) => void) {
        if (this.ready) {
            f(this);
        } else {
            this.readyCallbacks.push(f);
        }
    }

}

interface MeshInfo {
    url: string;
    frontFace: GPUFrontFace,
    modelmtx: mat4
}

const bunnyMatrix = mat4.create();
mat4.rotateX(bunnyMatrix, bunnyMatrix, Math.PI / 2);
mat4.scale(bunnyMatrix, bunnyMatrix, vec3.fromValues(1000, 1000, 1000));

const MeshSources: { [key: string]: MeshInfo } = {
    bunny: {
        url: bunnyURL,
        frontFace: 'cw',
        modelmtx: bunnyMatrix
    },
    bunny_res2: {
        url: bunnyRes2URL,
        frontFace: 'cw',
        modelmtx: bunnyMatrix
    },
    bunny_res3: {
        url: bunnyRes3URL,
        frontFace: 'cw',
        modelmtx: bunnyMatrix
    },
    bunny_res4: {
        url: bunnyRes4URL,
        frontFace: 'cw',
        modelmtx: bunnyMatrix
    }
}

function main() {

    const demo = new MeshDemo();

    demo.onReady(() => {

        const meshInfo = MeshSources[demo.paneParams.mesh];
        demo.loadMesh(meshInfo);
        demo.draw();
    });
}

main();