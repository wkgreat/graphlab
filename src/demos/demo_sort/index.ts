import { makeShaderDataDefinitions, makeStructuredView } from "webgpu-utils";
import { random } from "../../commons/utils";
import { createWebGPUContext, type WebGPUContext } from "../../commons/webgpuUtils";
import bitonicShaderCode from './bitonicsort.wgsl';
import './styles.css'

class GPUSortDemo {

    context?: WebGPUContext;

    ready: boolean = false;

    readyFuncs: (() => void)[] = [];

    constructor() {

        createWebGPUContext().then(context => {
            this.context = context;
            this.ready = true;
            for (const f of this.readyFuncs) {
                f();
            }
        })

    }

    onReady(f: () => void) {
        if (this.ready) {
            f();
        } else {
            this.readyFuncs.push(f);
        }
    }

}

class BitonicSort {

    context: WebGPUContext;
    device: GPUDevice;
    module?: GPUShaderModule;
    pipeline?: GPUComputePipeline;
    stageBuffers?: GPUBuffer[] = [];
    numbersBuffer?: GPUBuffer;
    outputBuffer?: GPUBuffer;
    bindgroup?: GPUBindGroup;

    constructor(context: WebGPUContext) {
        this.context = context;
        this.device = this.context.device;
    }

    async sort(nums: number[]): Promise<number[]> {

        this.module = this.device.createShaderModule({
            code: bitonicShaderCode
        });

        this.pipeline = this.device.createComputePipeline({
            layout: this.device.createPipelineLayout({
                bindGroupLayouts: [
                    this.device.createBindGroupLayout({
                        entries: [
                            {
                                binding: 0,
                                visibility: GPUShaderStage.COMPUTE,
                                buffer: {
                                    type: 'uniform',
                                    hasDynamicOffset: true
                                }
                            },
                            {
                                binding: 1,
                                visibility: GPUShaderStage.COMPUTE,
                                buffer: { type: 'storage' }
                            }
                        ]
                    })
                ]
            }),
            compute: {
                module: this.module,
                constants: {
                    workGroupSizeX: 128
                }
            }
        });

        const length = nums.length;
        const n = Math.pow(2, Math.ceil(Math.log2(length)));
        const numsdata = new Uint32Array(n);
        for (let i = 0; i < n; ++i) {
            if (i < length) {
                numsdata[i] = Math.ceil(nums[i]);
            } else {
                numsdata[i] = 0xffffffff;
            }
        }

        const defs = makeShaderDataDefinitions(bitonicShaderCode);
        const stageView = makeStructuredView(defs.uniforms.stage);

        this.numbersBuffer = this.device.createBuffer({
            size: numsdata.byteLength,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC
        });
        this.device.queue.writeBuffer(this.numbersBuffer, 0, numsdata);

        this.outputBuffer = this.device.createBuffer({
            size: numsdata.byteLength,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
        });

        const encoder = this.device.createCommandEncoder();
        const pass = encoder.beginComputePass();

        const uniformDynamicByteStride = 256;

        let stageCount = 0;
        for (let k = 2; k <= n; k <<= 1) {
            for (let j = k >> 1; j > 0; j >>= 1) {
                stageCount++;
            }
        }
        const uniformByteLength = uniformDynamicByteStride * stageCount;
        const uniform = this.device.createBuffer({
            size: uniformByteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });

        const uniformData = new Uint32Array(uniformByteLength / 4);
        let cursor = 0;
        for (let k = 2; k <= n; k <<= 1) {
            for (let j = k >> 1; j > 0; j >>= 1) {
                uniformData[cursor++] = k;
                uniformData[cursor++] = j;
                cursor += (uniformDynamicByteStride / 4 - 2);
            }
        }

        this.device.queue.writeBuffer(uniform, 0, uniformData);
        this.stageBuffers.push(uniform);

        let curStage = 0;
        for (let k = 2; k <= n; k <<= 1) {
            for (let j = k >> 1; j > 0; j >>= 1) {
                stageView.set({ k, j });

                this.device.queue.writeBuffer(uniform, 0, stageView.arrayBuffer);
                this.stageBuffers.push(uniform);
                const bindgroup = this.device.createBindGroup({
                    layout: this.pipeline.getBindGroupLayout(0),
                    entries: [
                        { binding: 0, resource: { buffer: uniform, size: uniformDynamicByteStride } },
                        { binding: 1, resource: { buffer: this.numbersBuffer } }
                    ]
                })

                pass.setPipeline(this.pipeline);
                pass.setBindGroup(0, bindgroup, [curStage * uniformDynamicByteStride]);
                pass.dispatchWorkgroups(Math.ceil(n / 128));

                curStage++;
            }
        }

        pass.end();
        encoder.copyBufferToBuffer(this.numbersBuffer, 0, this.outputBuffer, 0, numsdata.byteLength);
        this.device.queue.submit([encoder.finish()]);

        await this.outputBuffer.mapAsync(GPUMapMode.READ);

        const output = new Uint32Array(this.outputBuffer.getMappedRange());

        const sortedNums = Array.from(output);

        this.outputBuffer.unmap();

        return sortedNums;
    }

    destroy() {

        for (const b of this.stageBuffers) {
            b.destroy();
        }
        this.numbersBuffer.destroy();
        this.outputBuffer.destroy();

    }


}

function main() {
    const demo = new GPUSortDemo();
    demo.onReady(() => {

        const length = 8;
        // const nums = [17, 46, 20, 30];

        const nums = Array(length).fill(0).map(x => Math.ceil(random(0, 100)));

        console.log(nums);
        const bitonicSort = new BitonicSort(demo.context);
        bitonicSort.sort(nums).then(result => {
            console.log(result);
            bitonicSort.destroy();
        });

    });
}

main();