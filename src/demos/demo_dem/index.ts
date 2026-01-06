import { visualizeDEM } from './dem';
import { loadGeoTiff } from './geotiff';
import './styles.css';
import { createCanvasGPUInfo, createGPUInfo } from './webgpuUtils';
import demFileUrl from '/data/dem/dem_bh29_2021.tif?url';

async function main() {

    const gpuinfo = await createGPUInfo();
    if (gpuinfo === null) {
        console.error("GPU INFO is NULL");
        return;
    }
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

    const dem = await loadGeoTiff(demFileUrl);

    visualizeDEM(gpuinfo, canvasInfo, dem);

}

main();