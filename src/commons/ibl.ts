import { read, type KTX2Container } from "ktx-parse";
import EnvironmentMap from "./envmap";
import type Scene from "./scene";
import { createCubeTextureFromKTX2, createTexture2DFromKTX2 } from "./texture";
import type { CanvasGPUInfo, GPUInfo, WebGPUContext } from "./webgpuUtils";
import { logger } from "./logger";

export default class IBL {

    name: string;
    url: string;
    uri: string;
    json: object;

    environmentURI?: string;
    environment?: EnvironmentMap;
    prefilterURI?: string;
    prefilterKTX?: KTX2Container;
    lutURI?: string;
    lutKTX?: KTX2Container;

    sh?: {
        prescale?: boolean;
        parameters?: number[][];
    } = {};

    webgpu: {
        context?: WebGPUContext;
        scene?: Scene;
        prefilterTexture?: GPUTexture;
        prefilterSampler?: GPUSampler;
        lutTexture?: GPUTexture;
        lutSampler?: GPUSampler;
    } = {};

    private constructor() {}

    static async loadFromURI(uri: string, progressHook: (p: number, s: string) => void = () => {}) {

        progressHook(0, "IBL start loading...");
        logger.info("IBL start loading...");

        const url = uri.replace(/\/[^\/]*$/, '/');
        const res = await fetch(uri);
        const json = await res.json();

        progressHook(10, "IBL Fetch Meta Finish");

        const ibl = new IBL();
        ibl.url = url;
        ibl.uri = uri;
        ibl.json = json;
        const name = json["name"];
        ibl.name = name ?? "ibl";

        const envFile = json["environment"];

        if (envFile != null) {
            const envURI = `${url}/${envFile}`;
            ibl.environmentURI = envURI;
            logger.info("IBL enviroment data loading...");
            ibl.environment = await EnvironmentMap.fromKtx(ibl.name, envURI);
            logger.info("IBL enviroment data finish");
        }
        progressHook(40, "IBL Fetch Environment Data Finish");

        const prefilterFile = json["prefilter"];
        if (prefilterFile != null) {
            const prefilterURI = `${url}/${prefilterFile}`;
            ibl.prefilterURI = prefilterURI;
            logger.info("IBL prefilter data loading...");
            const pfres = await fetch(prefilterURI);
            const pfbuf = await pfres.arrayBuffer();
            logger.info("IBL prefilter data finish");
            const pfktx = read(new Uint8Array(pfbuf));
            ibl.prefilterKTX = pfktx;
        }

        progressHook(70, "IBL Fetch Prefilter Data Finish");

        const lutFile = json["lut"];
        if (lutFile != null) {
            const lutURI = `${url}/${lutFile}`;
            ibl.lutURI = lutURI;
            logger.info("IBL lut data loading...");
            const lutres = await fetch(lutURI);
            const lutbuf = await lutres.arrayBuffer();
            const lutktx = read(new Uint8Array(lutbuf));
            logger.info("IBL lut data finish");
            ibl.lutKTX = lutktx;
        }

        progressHook(90, "IBL Fetch LUT Data Finish");

        const sh = json["sphericalHarmonics"];
        if (sh != null) {
            ibl.sh.prescale = sh.prescale;
            ibl.sh.parameters = sh.parameters;
        }

        logger.info("IBL start finish");

        progressHook(100, "IBL Loading Finish");

        return ibl;

    }

    canEnv() {
        return this.environment != null;
    }

    canIBL() {
        return this.prefilterKTX != null &&
            this.lutKTX != null &&
            this.sh != null &&
            this.sh.prescale != null &&
            this.sh.parameters != null;
    }

    initWebGPU(context: WebGPUContext, scene: Scene) {
        this.webgpu.context = context;
        this.webgpu.scene = scene;
        if (this.environment != null) {
            this.environment.initWebGPU(context, scene);
        }
    }

    getPrefilterTexture() {
        const device = this.webgpu.context?.device;
        if (device == null) {
            return null;
        }
        if (this.webgpu.prefilterTexture == null) {
            this.webgpu.prefilterTexture = createCubeTextureFromKTX2(device, this.prefilterKTX);
        }
        return this.webgpu.prefilterTexture;
    }

    getPerfilterSampler() {
        const device = this.webgpu.context?.device;
        if (device == null) {
            return null;
        }
        if (this.webgpu.prefilterSampler == null) {
            this.webgpu.prefilterSampler = device.createSampler({
                label: this.name,
                magFilter: 'linear',
                minFilter: 'linear',
                mipmapFilter: 'linear',
                addressModeU: 'clamp-to-edge',
                addressModeV: 'clamp-to-edge',
                addressModeW: 'clamp-to-edge',
            });
        }
        return this.webgpu.prefilterSampler;
    }

    getLUTTexture() {
        const device = this.webgpu.context?.device;
        if (device == null) {
            return null;
        }
        if (this.webgpu.lutTexture == null) {
            this.webgpu.lutTexture = createTexture2DFromKTX2(device, this.lutKTX);
        }
        return this.webgpu.lutTexture;
    }
    getLUTSampler() {
        const device = this.webgpu.context?.device;
        if (device == null) {
            return null;
        }
        if (this.webgpu.prefilterSampler == null) {
            this.webgpu.prefilterSampler = device.createSampler({
                label: this.name,
                magFilter: 'linear',
                minFilter: 'linear',
                mipmapFilter: null,
                addressModeU: 'clamp-to-edge',
                addressModeV: 'clamp-to-edge'
            });
        }
        return this.webgpu.prefilterSampler;
    }

    destroy() {
        if (this.environment != null) {
            this.environment.destroy();
        }
        if (this.webgpu.prefilterTexture != null) {
            this.webgpu.prefilterTexture.destroy();
        }
    }


}