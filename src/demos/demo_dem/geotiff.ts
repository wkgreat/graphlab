import { fromBlob, GeoTIFFImage } from "geotiff";

export async function loadGeoTiff(url: string): Promise<GeoTIFFImage> {

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
    }
    const blob = await response.blob();
    const tiff = await fromBlob(blob);
    const image = await tiff.getImage();
    return image;
}

export async function getGeoTiffPixelRange(tiff: GeoTIFFImage): Promise<[number, number]> {

    let min = Infinity;
    let max = -Infinity;
    const nodataValue = tiff.getGDALNoData();
    const rasters = await tiff.readRasters();
    const data = rasters[0] as Float32Array;

    for (let i = 0; i < data.length; ++i) {
        const v = data[i];
        if (v === nodataValue || isNaN(v)) continue;
        if (v < min) min = v;
        if (v > max) max = v;
    }

    return [min, max];
}