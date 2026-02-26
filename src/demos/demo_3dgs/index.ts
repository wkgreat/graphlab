import { Pane } from 'tweakpane';
import Camera, { CameraMouseControl } from '../../commons/camera';
import Projection from '../../commons/projection';
import { createDepthTexture, createRenderPassDescriptor, createWebGPUContext, type WebGPUContext } from '../../commons/webgpuUtils';
import './styles.css';
import plyuri from '/data/3dgs/cactus_splat3_30kSteps_142k_splats.ply?url';
import GaussianSplat from '../../commons/mesh/gsplat';
import { PLYLoader } from '../../commons/format/ply/plyformat';
import { logger } from '../../commons/logger';
import Scene from '../../commons/scene';
import Axis from '../../commons/mesh/axis';
import { mat4 } from 'gl-matrix';

class GaussianSplatDemo {

    context?: WebGPUContext;

    colorTexture: GPUTexture | null = null;

    depthTexture: GPUTexture | null = null;

    camera: Camera | null = null;

    projection: Projection | null = null;

    scene: Scene | null = null;

    cameraMouseCtrl: CameraMouseControl | null = null;

    gaussianSplat: GaussianSplat | null = null;

    axis: Axis | null = null;

    firstpass: boolean = true;

    ready: boolean = false;

    resizeObserver: ResizeObserver | null = null;

    readyCallbacks: ((GaussianSplatDemo) => void)[] = [];

    pane: Pane;

    paneParams = {}

    constructor() {

        const canvas = document.getElementById("webgpu-canvas") as HTMLCanvasElement | null;

        if (canvas == null) {
            return;
        }

        createWebGPUContext(canvas).then(context => {

            this.context = context;

            if (context == null) {
                return null;
            }

            const width = this.context.canvas.element.width;

            const height = this.context.canvas.element.height;

            this.refreshDepthTexture();

            this.camera = new Camera([-2, 2, 2, 1], [0, 0, 0, 1], [0, 1, 0, 0]);

            this.projection = new Projection(Math.PI / 2, width / height, 0.1, 1000);

            this.scene = new Scene(this.camera, this.projection);
            this.scene.initWebGPU(this.context);
            this.scene.refreshViewport(width, height);

            this.cameraMouseCtrl = new CameraMouseControl(this.camera, this.context.canvas.element);

            this.cameraMouseCtrl.enable();

            this.resizeObserver = new ResizeObserver(entries => {
                for (const entry of entries) {
                    const canvas = entry.target as HTMLCanvasElement;
                    const width = entry.contentBoxSize[0].inlineSize;
                    const height = entry.contentBoxSize[0].blockSize;
                    canvas.width = Math.max(1, Math.min(width, this.context.device.limits.maxTextureDimension2D));
                    canvas.height = Math.max(1, Math.min(height, this.context.device.limits.maxTextureDimension2D));
                    this.projection.aspect = canvas.width / canvas.height;
                    this.scene.refreshViewport(width, height);
                    this.refreshDepthTexture();
                }
            });

            this.resizeObserver.observe(this.context.canvas.element);

            this.axis = new Axis({
                xlim: [0, 50],
                ylim: [0, 50],
                zlim: [0, 50],
            });
            this.axis.initWebGPU(this.context, this.scene);

            this.pane = new Pane({
                title: '参数控制',
                expanded: true, // 默认展开
            });

            this.setPane();

            this.ready = true;

            while (this.readyCallbacks.length > 0) {
                const f = this.readyCallbacks.pop();
                f(this);
            }

        }).catch(e => {
            this.ready = false;
            console.error(e);
        })
    }

    onReady(f: (demo: GaussianSplatDemo) => void) {
        if (this.ready) {
            f(this);
        } else {
            this.readyCallbacks.push(f);
        }
    }

    setGaussianSplat(splat: GaussianSplat) {
        splat.initWebGPU(this.context, this.scene);
        this.gaussianSplat = splat;
    }

    refreshDepthTexture() {
        const newDepthTexture = createDepthTexture(this.context);
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
                colorTexture: this.context.canvas.context.getCurrentTexture().createView(),
                depthTexture: this.depthTexture,
                clearColor: [0, 0, 0, 1],
                clearDepth: 1.0
            })
        }
        return descriptor;
    }

    render() {

        if (this.ready) {

            const encoder = this.context.device.createCommandEncoder();
            this.firstpass = true;
            const pass = encoder.beginRenderPass(this.getRenderPassDescriptor());
            this.firstpass = false;

            if (this.axis) {
                this.axis.draw(pass);
            }

            if (this.gaussianSplat) {
                this.gaussianSplat.draw(pass);
            }

            pass.end();

            const commandBuffer = encoder.finish();

            this.context.device.queue.submit([commandBuffer]);
        }

        requestAnimationFrame(this.render.bind(this));
    }

    draw() {

        requestAnimationFrame(this.render.bind(this));

    }

    setPane() {

    }

}

function main() {

    const demo = new GaussianSplatDemo();

    demo.onReady((d) => {
        logger.info("GaussianSplatDemo ready");
        const modelmtx = mat4.rotateX(mat4.create(), mat4.create(), Math.PI);
        // const modelmtx = mat4.create();
        PLYLoader.loadByWorker(plyuri, (ply) => {
            const splat = GaussianSplat.fromPLY(ply, modelmtx);
            demo.setGaussianSplat(splat);
        })
        demo.draw();
    });

}

main();