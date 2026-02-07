import Camera, { CameraMouseControl } from '../../commons/camera';
import { type GLTFRef } from '../../commons/format/gltf';
import PointLight from '../../commons/light';
import Axis from '../../commons/mesh/axis';
import { Ground } from '../../commons/objects';
import Projection from '../../commons/projection';
import Scene from '../../commons/scene';
import { createCanvasGPUInfo, createDepthTexture, createGPUInfo, createRenderPassDescriptor, type CanvasGPUInfo, type GPUInfo } from '../../commons/webgpuUtils';
import './styles.css';

import { mat4 } from 'gl-matrix';
import GLTF from '../../commons/format/gltf';
import GLTFRender from '../../commons/format/gltfrender';
import DamagedHelmetGLTFURL from '/data/mesh/gltf/DamagedHelmet/DamagedHelmet.gltf?url';
import ChronographWatchGLTFURL from '/data/mesh/gltf/ChronographWatch/ChronographWatch.gltf?url';
import CarConceptGLTFURL from '/data/mesh/gltf/CarConcept/CarConcept.gltf?url';
import DiffuseTransmissionTeacupGLTFURL from '/data/mesh/gltf/DiffuseTransmissionTeacup/DiffuseTransmissionTeacup.gltf?url';
import type { NumArr3 } from '../../commons/defines';
import { random, randomSign } from '../../commons/utils';
import { Pane } from 'tweakpane';

class GLTFDemo {

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

    axis: Axis | null = null;

    gltfs: { gltf: GLTF, scene: GLTFRef, matrix: mat4 }[] = [];

    gltfRender: GLTFRender;

    readyCallbacks: ((MeshDemo) => void)[] = []

    pane = new Pane({ title: "参数控制" });

    paneParams = {
        rotate: {
            x: 0,
            y: 0,
            z: 0
        }
    }

    matrix: mat4 = mat4.create();

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

            const from = [2, 2, 4, 1];
            const to = [0, 0, 0, 1];
            const up = [0, 0, 1, 0];

            this.camera = new Camera(from, to, up);

            this.projection = new Projection(Math.PI / 2, width / height, 0.1, 1000);

            this.scene = new Scene(this.camera, this.projection);

            for (let i = 0; i < 10; ++i) {
                const pos: NumArr3 = [
                    random(100, 200) * randomSign(),
                    random(100, 200) * randomSign(),
                    random(100, 200) * randomSign()]
                this.scene.addLight(new PointLight(pos, [1, 1, 1, 1]));
            }

            this.scene.initWebGPU(this.gpuInfo, this.canvasInfo);
            this.scene.refreshViewport(this.canvasInfo.canvas.width, this.canvasInfo.canvas.height);

            this.cameraMouseCtrl = new CameraMouseControl(this.camera, this.canvasInfo.canvas);

            this.cameraMouseCtrl.enable();

            //gltf
            this.gltfRender = new GLTFRender(this.gpuInfo, this.canvasInfo, this.scene);

            //objects
            // this.ground = new Ground({
            //     xsize: 100,
            //     ysize: 100,
            //     density: 2
            // });
            // this.ground.initWebGPU(this.gpuInfo, this.canvasInfo);

            this.axis = new Axis({
                xlim: [0, 50],
                ylim: [0, 50],
                zlim: [0, 50],
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

            this.setPane();

            this.ready = true;

            this.readyCallbacks.forEach(f => f(this));

        }).catch(e => {
            this.ready = false;
            console.error(e);
        })
    }

    onReady(f: (MeshDemo) => void) {
        if (this.ready) {
            f(this);
        } else {
            this.readyCallbacks.push(f);
        }
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

    addGLTF(info: { gltf: GLTF, scene: GLTFRef, matrix: mat4 }) {
        this.gltfs.push(info);
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

            for (const gltf of this.gltfs) {
                const mtx = mat4.multiply(mat4.create(), this.matrix, gltf.matrix);
                this.gltfRender.render({
                    pass,
                    gltf: gltf.gltf,
                    sceneRef: gltf.scene,
                    matrix: mtx
                });
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
        this.pane.addBinding(this.paneParams.rotate, "x", {
            min: 0, max: 360, step: 1,
        }).on("change", (e) => {
            const matrix = mat4.create();
            mat4.rotateX(matrix, matrix, e.value * Math.PI / 180);
            mat4.rotateY(matrix, matrix, this.paneParams.rotate.y * Math.PI / 180);
            mat4.rotateZ(matrix, matrix, this.paneParams.rotate.z * Math.PI / 180);
            this.matrix = matrix;
        });
        this.pane.addBinding(this.paneParams.rotate, "y", {
            min: 0, max: 360, step: 1,
        }).on("change", (e) => {
            const matrix = mat4.create();
            mat4.rotateX(matrix, matrix, this.paneParams.rotate.x * Math.PI / 180);
            mat4.rotateY(matrix, matrix, e.value * Math.PI / 180);
            mat4.rotateZ(matrix, matrix, this.paneParams.rotate.z * Math.PI / 180);
            this.matrix = matrix;
        });
        this.pane.addBinding(this.paneParams.rotate, "z", {
            min: 0, max: 360, step: 1,
        }).on("change", (e) => {
            const matrix = mat4.create();
            mat4.rotateX(matrix, matrix, this.paneParams.rotate.x * Math.PI / 180);
            mat4.rotateY(matrix, matrix, this.paneParams.rotate.y * Math.PI / 180);
            mat4.rotateZ(matrix, matrix, e.value * Math.PI / 180);
            this.matrix = matrix;
        });
    }


}

interface GLTFSource {
    name: string
    gltf: GLTF
    scene: GLTFRef
    matrix: mat4
}

const GLTFResources: { [key: string]: GLTFSource } = {
    DamagedHelmet: {
        name: "DamagedHelmet",
        gltf: new GLTF({ uri: DamagedHelmetGLTFURL }),
        scene: 0,
        matrix: (() => {
            const m = mat4.create();
            mat4.rotateX(m, m, Math.PI / 2);
            mat4.rotateY(m, m, Math.PI);
            return m;
        })()
    },
    ChronographWatch: {
        name: "ChronographWatch",
        gltf: new GLTF({ uri: ChronographWatchGLTFURL }),
        scene: 0,
        matrix: mat4.create()
    },
    CarConcept: {
        name: "CarConcept",
        gltf: new GLTF({ uri: CarConceptGLTFURL }),
        scene: 0,
        matrix: mat4.create()
    },
    DiffuseTransmissionTeacup: {
        name: "DiffuseTransmissionTeacup",
        gltf: new GLTF({ uri: DiffuseTransmissionTeacupGLTFURL }),
        scene: 0,
        matrix: (() => {
            const m = mat4.create();
            // mat4.rotateX(m, m, Math.PI / 2);
            return m;
        })()
    }
}

function main() {

    const demo = new GLTFDemo();

    demo.onReady(() => {
        demo.draw();

        const gltfSource = GLTFResources.DiffuseTransmissionTeacup;

        gltfSource.gltf.onReady(() => {

            demo.addGLTF(gltfSource);

        });

    })

}

main();