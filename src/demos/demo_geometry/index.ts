import { mat4 } from 'gl-matrix';
import Camera, { CameraMouseControl } from "../../commons/camera";
import Axis from '../../commons/mesh/axis';
import Mesh from '../../commons/mesh/mesh';
import { Ground } from '../../commons/objects';
import { PointLayer } from '../../commons/objects/point';
import Rectangle from '../../commons/objects/rectangle';
import Projection from "../../commons/projection";
import Scene from "../../commons/scene";
import { random } from '../../commons/utils';
import { createDepthTexture, createRenderPassDescriptor, createWebGPUContext, type WebGPUContext } from "../../commons/webgpuUtils";
import './styles.css';
import { Pane } from 'tweakpane';

class GeometryDemo {

    context?: WebGPUContext;

    ready: boolean = false;

    scene?: Scene;

    cameraMouseCtrl?: CameraMouseControl;

    ground?: Ground;

    axis?: Axis;

    resizeObserver?: ResizeObserver;

    readyCallbacks: ((GeometryDemo) => void)[] = []

    mesh?: Mesh;

    pointLayer?: PointLayer;

    pane?: Pane;

    paneParameters = {
        pointLayer: {
            minSize: 1,
            maxSize: 50
        }
    }

    webgpu: {
        firstPass: boolean;
        depthFormat: GPUTextureFormat;
        depthTexture?: GPUTexture;
    } = {
            firstPass: true,
            depthFormat: 'depth32float'
        }

    constructor() {

        const canvas = document.getElementById("webgpu-canvas") as HTMLCanvasElement | null;

        createWebGPUContext(canvas).then(context => {

            this.context = context;

            if (this.context == null) {
                return;
            }

            //scene

            const width = this.context.canvas.element.width;

            const height = this.context.canvas.element.height;

            const worldmtx = mat4.create();
            mat4.rotateX(worldmtx, worldmtx, -Math.PI / 2);
            mat4.rotateZ(worldmtx, worldmtx, -Math.PI / 2);

            const from = [500, 500, 500, 1];
            const to = [0, 0, 0, 1];
            const up = [0, 1, 0, 0];

            const camera = new Camera(from, to, up);

            const projection = new Projection(Math.PI / 2, width / height, 0.1, 10000);

            this.scene = new Scene(camera, projection);
            this.scene.setWorldMatrix(worldmtx);
            this.scene.initWebGPU(this.context);

            this.scene.refreshViewport(width, height);

            this.cameraMouseCtrl = new CameraMouseControl(camera, this.context.canvas.element);
            this.cameraMouseCtrl.enable();

            // depth texture
            this.refreshDepthTexture();

            // objects
            // ground
            this.ground = new Ground({
                xsize: 1000,
                ysize: 1000,
                density: 2,
                worldmtx
            });
            this.ground.initWebGPU(this.context);

            this.axis = new Axis({
                xlim: [0, 500],
                ylim: [0, 500],
                zlim: [0, 500],
            });
            this.axis.initWebGPU(this.context, this.scene);

            this.resizeObserver = new ResizeObserver(entries => {
                for (const entry of entries) {
                    const canvas = entry.target as HTMLCanvasElement;
                    const width = entry.contentBoxSize[0].inlineSize;
                    const height = entry.contentBoxSize[0].blockSize;
                    canvas.width = Math.max(1, Math.min(width, this.context.device.limits.maxTextureDimension2D));
                    canvas.height = Math.max(1, Math.min(height, this.context.device.limits.maxTextureDimension2D));
                    this.scene.projection.aspect = canvas.width / canvas.height;
                    this.scene.refreshViewport(canvas.width, canvas.height);
                    this.refreshDepthTexture();
                }
            });

            this.resizeObserver.observe(this.context.canvas.element);

            this.ready = true;

            this.readyCallbacks.forEach(f => f(this));

        });

    }

    getPointLayer() {

        if (this.pointLayer == null) {
            const rectangle = new Rectangle("rectangle", [-10, -10, 0], [10, 10, 0]);
            const mesh = new Mesh();
            const rectangleMeshData = rectangle.getMeshData();
            mesh.positions = rectangleMeshData.positions;
            mesh.normals = rectangleMeshData.normals;
            mesh.texcoords = rectangleMeshData.texcoords;
            mesh.setColor([1, 0, 0, 1]);
            mesh.initWebGPU(this.context, this.scene);

            const points = Array(100).fill(0).map(a => {
                return [random(-100, 100), random(-100, 100), random(0, 200)]
            }).flat();

            const pointColors = Array(100).fill(0).map(a => {
                return [random(0, 1), random(0, 1), random(0, 1), 1]
            }).flat();

            const pointSizes = Array(100).fill(0).map(a => {
                return random(this.paneParameters.pointLayer.minSize, this.paneParameters.pointLayer.maxSize);
            }).flat();

            const pointLayer = new PointLayer({
                name: "pointLayer",
                points,
                pointMesh: mesh,
                pointColors: pointColors,
                pointSizes: pointSizes,
            });
            pointLayer.initWebGPU(this.context, this.scene);

            this.pointLayer = pointLayer;
        }

        return this.pointLayer;
    }

    onReady(f: (MeshDemo) => void) {
        if (this.ready) {
            f(this);
        } else {
            this.readyCallbacks.push(f);
        }
    }

    refreshDepthTexture() {
        const newDepthTexture = createDepthTexture(this.context, this.webgpu.depthFormat);
        if (this.webgpu.depthTexture) {
            this.webgpu.depthTexture.destroy();
        }
        this.webgpu.depthTexture = newDepthTexture;
        return this.webgpu.depthTexture;
    }

    getRenderPassDescriptor() {

        let descriptor: GPURenderPassDescriptor | null = null;

        if (this.ready) {
            if (!this.webgpu.depthTexture) {
                return null;
            }
            descriptor = createRenderPassDescriptor({
                label: "demo",
                first: this.webgpu.firstPass,
                colorTexture: this.context.canvas.context.getCurrentTexture().createView(),
                depthTexture: this.webgpu.depthTexture,
                clearColor: [0, 0, 0, 1],
                clearDepth: 1.0
            })
        }
        return descriptor;
    }

    render() {

        if (this.ready) {
            const encoder = this.context.device.createCommandEncoder();
            this.webgpu.firstPass = true;
            const pass = encoder.beginRenderPass(this.getRenderPassDescriptor());
            this.webgpu.firstPass = false;

            if (this.scene.canEnv()) {
                this.scene.getEnv().draw(pass);
            }

            if (this.ground) {
                this.ground.draw(this.context, this.scene.camera, this.scene.projection, pass);
            }

            if (this.axis) {
                this.axis.draw(pass);
            }

            if (this.mesh) {
                this.mesh.draw(pass);
            }

            const pointLayer = this.getPointLayer();

            if (pointLayer) {
                pointLayer.draw(pass);
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

    destroy() {
        if (this.webgpu.depthTexture) {
            this.webgpu.depthTexture.destroy();
        }

        if (this.ground) {
            this.ground.destroy();
        }

        if (this.axis) {
            this.axis.destroy();
        }
    }

    setPane() {
        if (this.pane == null) {
            this.pane = new Pane({
                title: "几何对象绘制配置"
            });
        }
        const pointFolder = this.pane.addFolder({
            title: "点图层"
        });
        pointFolder.addBinding(this.paneParameters.pointLayer, "minSize", {
            label: "点最小尺寸(像素)",
            min: 1,
            max: 100
        });
        pointFolder.addBinding(this.paneParameters.pointLayer, "maxSize", {
            label: "点最大尺寸(像素)",
            min: 1,
            max: 100
        });
        pointFolder.addButton({
            title: "点大小随机"
        }).on("click", () => {
            if (this.pointLayer) {
                const npoints = this.pointLayer.getNumPoints();
                const minSize = this.paneParameters.pointLayer.minSize;
                const maxSize = this.paneParameters.pointLayer.maxSize;
                const sizes = Array(npoints).fill(0).map(d => random(minSize, maxSize));
                this.pointLayer.setPointSizes(sizes);
            }

        });
    }

}

function main() {

    const demo = new GeometryDemo();

    demo.onReady(demo => {
        demo.setPane();
        demo.draw();
    })

}

main();