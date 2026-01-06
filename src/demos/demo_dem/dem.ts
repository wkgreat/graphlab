import { GeoTIFFImage } from "geotiff";
import { mat4, vec4 } from "gl-matrix";
import { Pane } from "tweakpane";
import { makeShaderDataDefinitions, makeStructuredView, type ShaderDataDefinitions } from "webgpu-utils";
import Camera, { CameraMouseControl } from "./camera";
import { createGeoTiffTexture } from "./texture";
import { type CanvasGPUInfo, type GPUInfo, type Mesh } from "./webgpuUtils";

async function createDemRegularMesh(dem: GeoTIFFImage, options: { level: number } = { level: 4 }): Promise<Mesh> {

    const bbox = dem.getBoundingBox();
    const width = dem.getWidth();
    const height = dem.getHeight();
    const geokeys = dem.geoKeys;
    const srid: number = geokeys.ProjectedCSTypeGeoKey || geokeys.GeographicTypeGeoKey;
    //TODO transform to projection coordinator system.

    const positions: number[] = [];
    const texcoords: number[] = [];

    const rasters = await dem.readRasters();
    const data = rasters[0] as Float32Array;

    function uv(x: number, y: number): number[] {
        return [
            (x - bbox[0]) / (bbox[2] - bbox[0]),
            (y - bbox[1]) / (bbox[3] - bbox[1])
        ];
    }

    function val(x: number, y: number): number {

        const [xmin, ymin, xmax, ymax] = bbox;

        let col = Math.floor(((x - xmin) / (xmax - xmin)) * width);
        let row = Math.floor(((ymax - y) / (ymax - ymin)) * height);
        col = Math.max(0, Math.min(width - 1, col));
        row = Math.max(0, Math.min(height - 1, row));
        const idx = row * width + col;
        return data[idx];
    }

    function subdivision([xmin, ymin, xmax, ymax]: number[], curlev: number = 0) {

        if (curlev < options.level) {
            const mx = (xmin + xmax) / 2.0;
            const my = (ymin + ymax) / 2.0;
            const b0 = [xmin, ymin, mx, my];
            const b1 = [mx, ymin, xmax, my];
            const b2 = [xmin, my, mx, ymax];
            const b3 = [mx, my, xmax, ymax];
            subdivision(b0, curlev + 1);
            subdivision(b1, curlev + 1);
            subdivision(b2, curlev + 1);
            subdivision(b3, curlev + 1);
        } else {
            positions.push(
                xmin, ymin, val(xmin, ymin), xmax, ymax, val(xmax, ymax), xmin, ymax, val(xmin, ymax),
                xmin, ymin, val(xmin, ymin), xmax, ymin, val(xmax, ymin), xmax, ymax, val(xmax, ymax)
            );

            texcoords.push(
                ...uv(xmin, ymin), ...uv(xmax, ymax), ...uv(xmin, ymax),
                ...uv(xmin, ymin), ...uv(xmax, ymin), ...uv(xmax, ymax)
            );
        }
    }

    subdivision(bbox, 0);

    return {
        positions: new Float32Array(positions),
        texcoords: new Float32Array(texcoords),
        vertexCount: positions.length / 3
    }

}


export async function visualizeDEM(gpuinfo: GPUInfo, canvasInfo: CanvasGPUInfo, dem: GeoTIFFImage) {

    const label = "visualizeDEM";

    const { device } = gpuinfo;

    const demComputer = new DEMCompute(gpuinfo);

    const demMesh = await createDemRegularMesh(dem, { level: 4 });

    const paneOptions = {
        exaggeration: 2.0,
        derivative: 'none'
    };

    const dummyTexture: GPUTexture = device.createTexture({
        size: [1, 1, 1],
        format: 'r32float',
        usage: GPUTextureUsage.TEXTURE_BINDING
    });

    let slopeTexture: GPUTexture | null = null;
    let aspectTexture: GPUTexture | null = null;
    let pixelRange: [number, number] = [0, Math.PI / 2];

    let hmin = Infinity;
    let hmax = -Infinity;
    for (let i = 2; i < demMesh.positions.length; i += 3) {
        const h = demMesh.positions[i];
        if (h < hmin) hmin = h;
        if (h > hmax) hmax = h;
    }

    const code = /*WGSL*/`

        struct Camemra {
            eye: vec3f,
            to: vec3f,
            up: vec3f,
            viewmtx : mat4x4<f32>,
            relViewmtx : mat4x4<f32>
        };

        struct Projection {
            projmtx : mat4x4<f32>
        };

        struct Scene {
            camera : Camemra,
            projection: Projection,
        };

        @group(0) @binding(0) var<uniform> scene : Scene;
        @group(0) @binding(1) var<uniform> hrange : vec2f;
        @group(0) @binding(2) var<uniform> exaggeration : f32;
        @group(1) @binding(0) var<uniform> hasTexture : u32;
        @group(1) @binding(1) var demTexture: texture_2d<f32>;
        @group(1) @binding(2) var<uniform> pixelRange: vec2f;

        struct VSInput {
            @location(0) position : vec4f,
            @location(1) texcoord : vec2f
        };
        struct VSOutput {
            @builtin(position) position : vec4f,
            @location(0) height: f32,
            @location(1) texcoord : vec2f
        };

        @vertex fn vs(input: VSInput) -> VSOutput {
            var output : VSOutput;
            var worldpos = input.position.xyz;
            worldpos.z = (worldpos.z - hrange.x) * exaggeration + hrange.x;
            let relpos = vec4f((worldpos - scene.camera.eye.xyz), 1.0);
            output.position = scene.projection.projmtx * scene.camera.relViewmtx * relpos;
            output.height = worldpos.z;
            output.texcoord = input.texcoord;
            return output;
        }

        fn demColor(h: f32) -> vec3<f32> {
            let c0 = vec3(0.0, 0.0, 0.5); // low
            let c1 = vec3(0.0, 0.6, 0.6);
            let c2 = vec3(0.2, 0.7, 0.2);
            let c3 = vec3(0.8, 0.8, 0.2);
            let c4 = vec3(0.8, 0.4, 0.1);
            let c5 = vec3(1.0, 1.0, 1.0); // high

            let t = clamp(h, 0.0, 1.0) * 5.0;

            var col = mix(c0, c1, clamp(t, 0.0, 1.0));
            col = mix(col, c2, clamp(t - 1.0, 0.0, 1.0));
            col = mix(col, c3, clamp(t - 2.0, 0.0, 1.0));
            col = mix(col, c4, clamp(t - 3.0, 0.0, 1.0));
            col = mix(col, c5, clamp(t - 4.0, 0.0, 1.0));

            return col;
        }

        @fragment fn fs(input: VSOutput) -> @location(0) vec4f {
            if(hasTexture != 0u) {
                let vmin = pixelRange[0];
                let vmax = pixelRange[1];
                let texcoord = input.texcoord;
                let size = textureDimensions(demTexture);
                let x = u32(f32(size.x) * texcoord.x);
                let y = u32(f32(size.y) * (1-texcoord.y));
                let v = textureLoad(demTexture, vec2<u32>(x,y), 0).r;
                let nv = (v-vmin)/vmax;
                let color = vec4f(demColor(nv), 1.0);
                return color;
            } else {
                let hmin = hrange.x;
                let hmax = (hrange.y-hrange.x) * exaggeration + hrange.x;
                let r = (input.height - hmin) / hmax;
                let color = vec4f(demColor(r),1.0);
                return color;
            }
        }
    `;

    const module = device.createShaderModule({
        label,
        code
    });

    const bindgroupLayout0 = device.createBindGroupLayout({
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
            },
            {
                binding: 2,
                visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                buffer: { type: 'uniform' }
            }
        ]
    });

    const bindgroupLayout1 = device.createBindGroupLayout({
        entries: [
            {
                binding: 0,
                visibility: GPUShaderStage.FRAGMENT,
                buffer: { type: 'uniform' }
            },
            {
                binding: 1,
                visibility: GPUShaderStage.FRAGMENT,
                texture: {
                    sampleType: 'unfilterable-float',
                    viewDimension: '2d',
                    multisampled: false
                }
            },
            {
                binding: 2,
                visibility: GPUShaderStage.FRAGMENT,
                buffer: { type: 'uniform' }
            },
        ]
    })

    const piplelineLayout = device.createPipelineLayout({
        bindGroupLayouts: [
            bindgroupLayout0,
            bindgroupLayout1
        ]
    });

    const pipeline = device.createRenderPipeline({
        label,
        layout: piplelineLayout,
        vertex: {
            module,
            buffers: [
                { arrayStride: 3 * 4, attributes: [{ shaderLocation: 0, offset: 0, format: 'float32x3' }] },
                { arrayStride: 2 * 4, attributes: [{ shaderLocation: 1, offset: 0, format: 'float32x2' }] }
            ]
        },
        fragment: {
            module,
            targets: [{
                format: canvasInfo.context.getConfiguration()!.format
            }]
        },
        primitive: {
            topology: 'triangle-list',
            cullMode: 'none'
        },
        depthStencil: {
            depthWriteEnabled: true,
            depthCompare: 'less',
            format: 'depth24plus',
        },
    });

    const positionBuffer = device.createBuffer({
        label: `${label} positionBuffer`,
        size: demMesh.positions.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    })
    device.queue.writeBuffer(positionBuffer, 0, demMesh.positions.buffer);

    const texcoordBuffer = device.createBuffer({
        label: `${label} texcoordBuffer`,
        size: demMesh.texcoords!.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    });
    device.queue.writeBuffer(texcoordBuffer, 0, demMesh.texcoords!.buffer);


    //uniform
    const demBBox = dem.getBoundingBox();
    const demCenter = [(demBBox[0] + demBBox[2]) / 2.0, (demBBox[1] + demBBox[3]) / 2.0]
    const cameraTo = vec4.fromValues(demCenter[0], demCenter[1], 0, 1);
    const cameraFrom = vec4.fromValues(demCenter[0] + 200, demCenter[1] + 800, 1000, 1);
    const cameraUp = vec4.fromValues(0, 0, 1, 1);
    const camera = new Camera(cameraFrom, cameraTo, cameraUp);
    const control = new CameraMouseControl(camera, canvasInfo.canvas);
    control.enable();

    const shaderDefs = makeShaderDataDefinitions(code);
    const sceneUniformView = makeStructuredView(shaderDefs.uniforms.scene);
    const hrangeUniformView = makeStructuredView(shaderDefs.uniforms.hrange);
    const exaggerationUniformView = makeStructuredView(shaderDefs.uniforms.exaggeration);
    const hasTextureUniformView = makeStructuredView(shaderDefs.uniforms.hasTexture);
    const pixcelRangeUniformView = makeStructuredView(shaderDefs.uniforms.pixelRange);

    const sceneUniform = device.createBuffer({
        label: `${label} sceneUniform`,
        size: sceneUniformView.arrayBuffer.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    const hrangeUniform = device.createBuffer({
        label: `${label} hrangeUniform`,
        size: hrangeUniformView.arrayBuffer.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    hrangeUniformView.set([hmin, hmax]);
    device.queue.writeBuffer(hrangeUniform, 0, hrangeUniformView.arrayBuffer);

    const exaggerationUniform = device.createBuffer({
        label: `${label} exaggerationUniform`,
        size: hrangeUniformView.arrayBuffer.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    const hasTextureUniform = device.createBuffer({
        label: `${label} hasTextureUniform`,
        size: hasTextureUniformView.arrayBuffer.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    const pixelRangeUniform = device.createBuffer({
        label: `${label} pixelRangeUniform`,
        size: hrangeUniformView.arrayBuffer.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    const bindGroup0 = device.createBindGroup({
        label,
        layout: pipeline.getBindGroupLayout(0),
        entries: [
            { binding: 0, resource: { buffer: sceneUniform } },
            { binding: 1, resource: { buffer: hrangeUniform } },
            { binding: 2, resource: { buffer: exaggerationUniform } }
        ]
    });

    const theTexture = dummyTexture;

    let bindGroup1 = device.createBindGroup({
        label,
        layout: pipeline.getBindGroupLayout(1),
        entries: [
            { binding: 0, resource: hasTextureUniform },
            { binding: 1, resource: theTexture },
            { binding: 2, resource: { buffer: pixelRangeUniform } }
        ]
    })


    let depthTexture = device.createTexture({
        size: [canvasInfo.canvas.width, canvasInfo.canvas.height],
        format: 'depth24plus',
        usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });


    function render() {

        const viewmtx = camera.getViewMatrix();
        const projmtx = mat4.perspective(mat4.create(), Math.PI / 2, canvasInfo.canvas.width / canvasInfo.canvas.height, 0.1, 10000);
        sceneUniformView.set({
            camera: {
                eye: [camera.from[0], camera.from[1], camera.from[2]],
                to: [camera.to[0], camera.to[1], camera.to[2]],
                up: [camera.up[0], camera.up[1], camera.up[2]],
                viewmtx,
                relViewmtx: camera.getRelViewMatrix()
            },
            projection: {
                projmtx
            }
        });
        device.queue.writeBuffer(sceneUniform, 0, sceneUniformView.arrayBuffer);

        exaggerationUniformView.set(paneOptions.exaggeration);
        device.queue.writeBuffer(exaggerationUniform, 0, exaggerationUniformView.arrayBuffer);

        hasTextureUniformView.set(paneOptions.derivative === 'none' ? 0 : 1);
        device.queue.writeBuffer(hasTextureUniform, 0, hasTextureUniformView.arrayBuffer);

        pixcelRangeUniformView.set(pixelRange);
        device.queue.writeBuffer(pixelRangeUniform, 0, pixcelRangeUniformView.arrayBuffer);

        if (depthTexture.height !== canvasInfo.canvas.height || depthTexture.width !== canvasInfo.canvas.width) {
            depthTexture.destroy();
            depthTexture = device.createTexture({
                size: [canvasInfo.canvas.width, canvasInfo.canvas.height],
                format: 'depth24plus',
                usage: GPUTextureUsage.RENDER_ATTACHMENT,
            });
        }

        const encoder = device.createCommandEncoder({ label });
        const pass = encoder.beginRenderPass({
            label,
            colorAttachments: [
                {
                    clearValue: [0.3, 0.3, 0.3, 1.0],
                    loadOp: 'clear',
                    storeOp: 'store',
                    view: canvasInfo.context.getCurrentTexture().createView()
                }
            ],
            depthStencilAttachment: {
                view: depthTexture.createView(),
                depthClearValue: 1.0,
                depthLoadOp: 'clear',
                depthStoreOp: 'store',
            }
        });
        pass.setPipeline(pipeline);
        pass.setBindGroup(0, bindGroup0);
        pass.setBindGroup(1, bindGroup1);
        pass.setVertexBuffer(0, positionBuffer);
        pass.setVertexBuffer(1, texcoordBuffer);
        pass.draw(demMesh.vertexCount as number);
        pass.end();

        const commandBuffer = encoder.finish({ label });

        device.queue.submit([commandBuffer]);

        requestAnimationFrame(render);

    }

    const observer = new ResizeObserver(entries => {
        for (const entry of entries) {
            const canvas = entry.target as HTMLCanvasElement;
            const width = entry.contentBoxSize[0].inlineSize;
            const height = entry.contentBoxSize[0].blockSize;

            canvas.width = Math.max(1, Math.min(width, device.limits.maxTextureDimension2D));
            canvas.height = Math.max(1, Math.min(height, device.limits.maxTextureDimension2D));
        }
    });

    observer.observe(canvasInfo.canvas);


    const pane = new Pane({
        title: '参数控制',
        expanded: true, // 默认展开
    });

    pane.addBinding(paneOptions, 'exaggeration', {
        min: 0, max: 10, step: 0.1, label: 'exaggeration'
    });
    pane.addBinding(paneOptions, 'derivative', {
        options: {
            "无": 'none',
            "坡度": 'slope',
            "坡向": 'aspect'
        }
    }).on('change', async e => {

        let theTexture: GPUTexture | null = null;

        if (e.value === 'slope') {
            if (slopeTexture === null) {
                slopeTexture = await demComputer.computeSlope(dem);
            }
            theTexture = slopeTexture;
            pixelRange = [0, Math.PI / 2];
        } else if (e.value === 'aspect') {
            if (aspectTexture === null) {
                aspectTexture = await demComputer.computeAspect(dem);
            }
            theTexture = aspectTexture;
            pixelRange = [0, 360];
        } else {
            theTexture = dummyTexture;
        }

        bindGroup1 = device.createBindGroup({
            label,
            layout: pipeline.getBindGroupLayout(1),
            entries: [
                { binding: 0, resource: hasTextureUniform },
                { binding: 1, resource: theTexture },
                { binding: 2, resource: { buffer: pixelRangeUniform } }
            ]
        });
    });

    requestAnimationFrame(render);

}

interface DEMComputeInfo {
    pipeline: GPUComputePipeline,
    definations: ShaderDataDefinitions
}

class DEMCompute {

    gpuinfo: GPUInfo;

    workGroupSizeX: number = 8;
    workGroupSizeY: number = 8;
    workGroupSizeZ: number = 1;

    slopeComputeInfo: DEMComputeInfo;
    slopeTexture: GPUTexture | null = null;

    aspectComputeInfo: DEMComputeInfo;
    aspectTexture: GPUTexture | null = null;

    slopeKernel = /*WGSL*/`
    
        fn kernel(
            z1:f32,z2:f32,z3:f32,
            z4:f32,z5:f32,z6:f32,
            z7:f32,z8:f32,z9:f32
        ) -> f32 {
            let dx = ((z3 + 2 * z6 + z9) - (z1 + 2 * z4 + z7)) * demInfo.zfactor / (8 * demInfo.resolution.x);
            let dy = ((z7 + 2*z8 + z9) - (z1 + 2*z2 + z3)) * demInfo.zfactor  / (8 * demInfo.resolution.y);
            let s = atan(sqrt(pow(dx,2)+pow(dy,2)));
            return s;
        }

    `;

    aspectKernel = /*WGSL*/`
    
        fn kernel(
            z1:f32,z2:f32,z3:f32,
            z4:f32,z5:f32,z6:f32,
            z7:f32,z8:f32,z9:f32
        ) -> f32 {
            
            let fx = ((z3+2*z6+z9)-(z1+2*z4+z7)) / (8 * demInfo.resolution.x);
            let fy = ((z1+2*z2+z3)-(z7+2*z8+z9)) / (8 * demInfo.resolution.y);
            if(fx==0.0 && fy==0.0) {
                return 0.0;
            }
            let aspect_rad = atan2(fy, -fx);
            let aspect_deg = degrees(aspect_rad);
            var aspect = 90 - aspect_deg;
            if(aspect < 0.0) {
                aspect += 360;
            }
            return aspect;
        }

    `;

    constructor(gpuinfo: GPUInfo) {

        this.gpuinfo = gpuinfo;

        const limits = gpuinfo.device.limits;

        this.workGroupSizeX = Math.min(Math.sqrt(limits.maxComputeInvocationsPerWorkgroup), limits.maxComputeWorkgroupSizeX);
        this.workGroupSizeY = Math.min(Math.sqrt(limits.maxComputeInvocationsPerWorkgroup), limits.maxComputeWorkgroupSizeY);
        this.workGroupSizeZ = 1;

        this.slopeComputeInfo = this.createCovolution3x3Pipeline(gpuinfo, "slope compute", this.slopeKernel);
        this.aspectComputeInfo = this.createCovolution3x3Pipeline(gpuinfo, "aspect compute", this.aspectKernel);
    }

    async computeSlope(dem: GeoTIFFImage): Promise<GPUTexture | null> {
        if (this.slopeTexture === null) {
            const slope = await this.convolute3x3(this.gpuinfo, this.slopeComputeInfo, dem);
            this.slopeTexture = slope;
        }
        return this.slopeTexture;
    }

    async computeAspect(dem: GeoTIFFImage): Promise<GPUTexture | null> {
        if (this.aspectTexture === null) {
            const aspect = await this.convolute3x3(this.gpuinfo, this.aspectComputeInfo, dem);
            this.aspectTexture = aspect;
        }
        return this.aspectTexture;
    }

    createCovolution3x3Pipeline(gpuinfo: GPUInfo, label: string, kernelWGSLFunction: string): DEMComputeInfo {

        const { device } = gpuinfo;

        const code = /*WGSL*/`

            override workGroupSizeX : u32 = 8u;
            override workGroupSizeY : u32 = 8u;
            override workGroupSizeZ : u32 = 1u;
            struct DEMInfo {
                resolution : vec2f,
                zfactor : f32
            }
            @group(0) @binding(0) var dem : texture_2d<f32>;
            @group(0) @binding(1) var outTexture : texture_storage_2d<r32float, read_write>;
            @group(0) @binding(2) var<uniform> demInfo : DEMInfo;
            ${kernelWGSLFunction}
            @compute @workgroup_size(workGroupSizeX, workGroupSizeY, workGroupSizeZ) fn cs(
                @builtin(workgroup_id) wid : vec3<u32>,
                @builtin(global_invocation_id) gid : vec3<u32>,
                @builtin(local_invocation_id) lid : vec3<u32>
            ) {
                let size = textureDimensions(dem);
                let w = size.x;
                let h = size.y;
                let x = gid.x;
                let y = gid.y;
                let coords = vec2<u32>(x,y);
                let cmin = vec2<u32>(0,0);
                let cmax = vec2<u32>(w-1,h-1);
                let c1 = clamp(vec2<u32>(x-1,y-1),cmin,cmax);
                let c2 = clamp(vec2<u32>(x-1,y),cmin,cmax);
                let c3 = clamp(vec2<u32>(x-1,y+1),cmin,cmax);
                let c4 = clamp(vec2<u32>(x,y-1),cmin,cmax);
                let c5 = clamp(vec2<u32>(x,y),cmin,cmax);
                let c6 = clamp(vec2<u32>(x,y+1),cmin,cmax);
                let c7 = clamp(vec2<u32>(x+1,y-1),cmin,cmax);
                let c8 = clamp(vec2<u32>(x+1,y),cmin,cmax);
                let c9 = clamp(vec2<u32>(x+1,y+1),cmin,cmax);
                let z1 = textureLoad(dem, c1, 0).r;
                let z2 = textureLoad(dem, c2, 0).r;
                let z3 = textureLoad(dem, c3, 0).r;
                let z4 = textureLoad(dem, c4, 0).r;
                let z5 = textureLoad(dem, c5, 0).r;
                let z6 = textureLoad(dem, c6, 0).r;
                let z7 = textureLoad(dem, c7, 0).r;
                let z8 = textureLoad(dem, c8, 0).r;
                let z9 = textureLoad(dem, c9, 0).r;
                let s = kernel(z1,z2,z3,z4,z5,z6,z7,z8,z9);
                textureStore(outTexture, coords, vec4f(s,0,0,0));
            }
    
        `;

        const module = device.createShaderModule({
            label,
            code
        });

        const pipeline = device.createComputePipeline({
            label,
            layout: 'auto',
            compute: {
                module,
                constants: {
                    workGroupSizeX: this.workGroupSizeX,
                    workGroupSizeY: this.workGroupSizeY,
                    workGroupSizeZ: this.workGroupSizeZ
                }
            },
        });

        return {
            pipeline,
            definations: makeShaderDataDefinitions(code)
        };
    }

    async convolute3x3(gpuinfo: GPUInfo, convolute3x3Info: DEMComputeInfo, dem: GeoTIFFImage): Promise<GPUTexture | null> {

        const { device } = gpuinfo;
        const { pipeline, definations } = convolute3x3Info;
        const label = "convolute3x3";

        const demTexture = await createGeoTiffTexture(device, dem);
        const demWidth = dem.getWidth();
        const demHeight = dem.getHeight();
        const workGroupCountX = Math.ceil(demWidth / this.workGroupSizeX);
        const workGroupCountY = Math.ceil(demHeight / this.workGroupSizeY);

        const outTexutre = device.createTexture({
            label,
            size: [demWidth, demHeight],
            format: 'r32float',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_DST
        });

        const resolution = dem.getResolution().slice(0, 2);
        const zfactor = 1.0;

        const demInfoUniformView = makeStructuredView(definations.uniforms.demInfo);
        demInfoUniformView.set({
            resolution,
            zfactor
        });

        const demInfoUniform = device.createBuffer({
            label,
            size: demInfoUniformView.arrayBuffer.byteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
        device.queue.writeBuffer(demInfoUniform, 0, demInfoUniformView.arrayBuffer);

        const bindGroup = device.createBindGroup({
            label,
            layout: pipeline.getBindGroupLayout(0),
            entries: [
                { binding: 0, resource: demTexture },
                { binding: 1, resource: outTexutre },
                { binding: 2, resource: { buffer: demInfoUniform } }
            ]
        });

        const encoder = device.createCommandEncoder();

        const pass = encoder.beginComputePass();

        pass.setPipeline(pipeline);
        pass.setBindGroup(0, bindGroup);
        pass.dispatchWorkgroups(workGroupCountX, workGroupCountY, 1);
        pass.end();

        const commandBuffer = encoder.finish();

        device.queue.submit([commandBuffer]);

        demTexture.destroy();

        return outTexutre;

    }

}