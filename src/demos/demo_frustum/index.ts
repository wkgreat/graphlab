import { Ground } from '../../commons/objects';
import Projection from '../../commons/projection';
import { createDepthTexture, createRenderPassDescriptor, type CanvasGPUInfo } from '../../commons/webgpuUtils';
import Camera, { CameraMouseControl } from '../../commons/camera';
import { createCanvasGPUInfo, createGPUInfo, type GPUInfo } from '../demo_dem/webgpuUtils';
import './styles.css';
import { Pane } from 'tweakpane';
import type { NumArr3 } from '../../commons/defines';
import SimpleLineProgram from '../../commons/programs/simpleline';
import { Colors } from '../../commons/color';
import { Frustum } from '../../commons/objects/frustum';

class FrustumDemo {

    gpuInfo: GPUInfo | null = null

    canvasInfo: CanvasGPUInfo | null = null

    colorTexture: GPUTexture | null = null;

    depthTexture: GPUTexture | null = null;

    camera: Camera | null = null;

    projection: Projection | null = null;

    cameraMouseCtrl: CameraMouseControl | null = null;

    firstpass: boolean = true;

    ready: boolean = false;

    resizeObserver: ResizeObserver | null = null;

    ground: Ground = new Ground(1000, 1000);

    frustum: Frustum | null = null;

    simpleLineProgram: SimpleLineProgram | null = null;

    pane: Pane;

    paneParams = {
        frustum: {
            eye: { x: -20, y: 20, z: 400 },
            target: { x: -20, y: 20, z: 10 },
            up: { x: 0, y: 1, z: 0 },
            near: 100,
            far: 300,
            aspect: 1.5,
            fovy: Math.PI / 4
        }
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

            this.camera = new Camera([-500, 500, 500, 1], [0, 0, 0, 1], [0, 0, 1, 0]);

            this.projection = new Projection(Math.PI / 2, width / height, 1, 10000);

            this.cameraMouseCtrl = new CameraMouseControl(this.camera, this.canvasInfo.canvas);

            this.cameraMouseCtrl.enable();

            //objects
            this.ground.initWebGPU(this.gpuInfo, this.canvasInfo);

            this.frustum = new Frustum({
                eye: Object.values(this.paneParams.frustum.eye) as NumArr3,
                target: Object.values(this.paneParams.frustum.target) as NumArr3,
                up: Object.values(this.paneParams.frustum.up) as NumArr3,
                near: this.paneParams.frustum.near,
                far: this.paneParams.frustum.far,
                aspect: this.paneParams.frustum.aspect,
                fovy: this.paneParams.frustum.fovy
            });

            this.frustum.initWebGPU(this.gpuInfo, this.canvasInfo, this.camera, this.projection);

            this.simpleLineProgram = new SimpleLineProgram({
                gpuinfo: this.gpuInfo,
                canvasinfo: this.canvasInfo,
                mode: 'line-list'
            });

            const theCallback = (f: Frustum) => {
                const sightlines = f.computeSightLine();
                const nvertex = sightlines.length / 3;

                const colors = new Float32Array([
                    ...Array(nvertex).fill(Colors.red).flat()
                ])
                this.simpleLineProgram.setData({
                    positions: sightlines,
                    colors: colors
                });
            }
            theCallback(this.frustum);
            this.frustum.addChangeCallbacks(theCallback);

            this.resizeObserver = new ResizeObserver(entries => {
                for (const entry of entries) {
                    const canvas = entry.target as HTMLCanvasElement;
                    const width = entry.contentBoxSize[0].inlineSize;
                    const height = entry.contentBoxSize[0].blockSize;
                    canvas.width = Math.max(1, Math.min(width, this.gpuInfo.device.limits.maxTextureDimension2D));
                    canvas.height = Math.max(1, Math.min(height, this.gpuInfo.device.limits.maxTextureDimension2D));
                    this.projection.aspect = canvas.width / canvas.height;
                    this.refreshDepthTexture();
                }
            });

            this.resizeObserver.observe(canvasInfo.canvas);

            this.pane = new Pane({
                title: '参数控制',
                expanded: true, // 默认展开
            });

            this.setPane();

            this.ready = true;
        }).catch(e => {
            this.ready = false;
            console.error(e);
        })
    }

    refreshDepthTexture() {
        const newDepthTexture = createDepthTexture(this.gpuInfo, this.canvasInfo.canvas.width, this.canvasInfo.canvas.height);
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

            this.ground.draw(this.gpuInfo, this.camera, this.projection, pass);
            this.frustum.draw(this.gpuInfo, this.camera, this.projection, pass);
            this.simpleLineProgram.draw(this.camera, this.projection, pass);
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
        const frustumFolder = this.pane.addFolder({
            title: "视锥体位置姿态",
            expanded: true,
        });
        const eyeFolder = frustumFolder.addFolder({
            title: "eye",
            expanded: false
        });
        eyeFolder.addBinding(this.paneParams.frustum.eye, "x", {
            min: -1000, max: 1000, step: 0.1, label: 'x'
        }).on('change', e => {
            const eye = this.frustum.eye;
            eye[0] = e.value;
            this.frustum.eye = eye;
        })

        eyeFolder.addBinding(this.paneParams.frustum.eye, "y", {
            min: -1000, max: 1000, step: 0.1, label: 'y'
        }).on('change', e => {
            const eye = this.frustum.eye;
            eye[1] = e.value;
            this.frustum.eye = eye;
        })

        eyeFolder.addBinding(this.paneParams.frustum.eye, "z", {
            min: -1000, max: 1000, step: 0.1, label: 'z'
        }).on('change', e => {
            const eye = this.frustum.eye;
            eye[2] = e.value;
            this.frustum.eye = eye;
        })

        const targetFolder = frustumFolder.addFolder({
            title: "target",
            expanded: false
        });
        targetFolder.addBinding(this.paneParams.frustum.target, "x", {
            min: -1000, max: 1000, step: 0.1, label: 'x'
        }).on('change', e => {
            const target = this.frustum.target;
            target[0] = e.value;
            this.frustum.target = target;
        })

        targetFolder.addBinding(this.paneParams.frustum.target, "y", {
            min: -1000, max: 1000, step: 0.1, label: 'y'
        }).on('change', e => {
            const target = this.frustum.target;
            target[1] = e.value;
            this.frustum.target = target;
        })

        targetFolder.addBinding(this.paneParams.frustum.target, "z", {
            min: -1000, max: 1000, step: 0.1, label: 'z'
        }).on('change', e => {
            const target = this.frustum.target;
            target[2] = e.value;
            this.frustum.target = target;
        })

        const upFolder = frustumFolder.addFolder({
            title: "up",
            expanded: false
        });
        upFolder.addBinding(this.paneParams.frustum.up, "x", {
            min: -1, max: 1, step: 0.01, label: 'x'
        }).on('change', e => {
            const up = this.frustum.up;
            up[0] = e.value;
            this.frustum.up = up;
        })

        upFolder.addBinding(this.paneParams.frustum.up, "y", {
            min: -1, max: 1, step: 0.01, label: 'y'
        }).on('change', e => {
            const up = this.frustum.up;
            up[1] = e.value;
            this.frustum.up = up;
        })

        upFolder.addBinding(this.paneParams.frustum.up, "z", {
            min: -1, max: 1, step: 0.01, label: 'z'
        }).on('change', e => {
            const up = this.frustum.up;
            up[2] = e.value;
            this.frustum.up = up;
        })

        frustumFolder.addBinding(this.paneParams.frustum, "near", {
            min: 1, max: 1000, step: 0.1, label: 'near'
        }).on('change', e => {
            if (e.value < this.frustum.far) {
                this.frustum.near = e.value;
            }
        })

        frustumFolder.addBinding(this.paneParams.frustum, "far", {
            min: 1, max: 1000, step: 0.1, label: 'far'
        }).on('change', e => {
            if (e.value > this.frustum.near) {
                this.frustum.far = e.value;
            }
        })

        frustumFolder.addBinding(this.paneParams.frustum, "aspect", {
            min: 0.1, max: 10, step: 0.1, label: 'aspect'
        }).on('change', e => {
            this.frustum.aspect = e.value;
        })

        frustumFolder.addBinding(this.paneParams.frustum, "fovy", {
            min: 0.1, max: Math.PI, step: 0.1, label: 'fovy'
        }).on('change', e => {
            this.frustum.fovy = e.value;
        })
    }

}

function main() {

    const demo = new FrustumDemo();

    demo.draw();
}

main();