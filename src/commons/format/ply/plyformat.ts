import Mesh from "../../mesh/mesh";
import { objectNumKeys } from "../../utils";
import PLYWorker from './plyworker.ts?worker'

export const PLYDataTypes = {
    char: "char",
    uchar: "uchar",
    short: "short",
    ushort: "ushort",
    int: "int",
    uint: "uint",
    float: "float",
    double: "double"
} as const;
export type PLYDataTypes = typeof PLYDataTypes[keyof typeof PLYDataTypes];

export const PLYDataTypeBytes = {
    char: 1,
    uchar: 1,
    short: 2,
    ushort: 2,
    int: 4,
    uint: 4,
    float: 4,
    double: 8
}

export interface PLYProperty {
    index: number,
    name: string,
    list: boolean,
    lentype?: PLYDataTypes,
    elmtype: PLYDataTypes,
    lenData: number[],
    data: (number | number[])[]
};

export interface PLYElement {
    index: number,
    count: number,
    properties: Record<string, PLYProperty>
};

export default class PLYMeshData {

    formatName?: string;

    formatVersion?: string;

    elements: Record<string, PLYElement> = {}

    constructor() {}

    toMesh(): Mesh | null {

        const mesh = new Mesh();

        const vertexData = this.elements["vertex"];

        const xData = vertexData.properties["x"].data as number[];
        const yData = vertexData.properties["y"].data as number[];
        const zData = vertexData.properties["z"].data as number[];

        //positions
        mesh.positions = new Float32Array(vertexData.count * 3);
        for (let i = 0; i < vertexData.count; i++) {
            mesh.positions[i * 3] = xData[i];
            mesh.positions[i * 3 + 1] = yData[i];
            mesh.positions[i * 3 + 2] = zData[i];
        }

        //TODO normals
        //TODO texcoords

        if (!("face" in this.elements)) {
            console.warn("this is point cloud data");
            return null;
        }

        const faceData = this.elements["face"];
        const indexData = faceData.properties["vertex_indices"].data as number[][];

        const trippleIndexData = indexData.filter(a => a.length === 3);

        if (trippleIndexData.length < faceData.count) {
            console.warn("face 存在不为三角形的情况");
        }


        //TODO 这里假设都为三角形，考虑face为四边形的情况
        //TODO 考虑类型
        mesh.vertexIndices = new Uint32Array(trippleIndexData.flat());

        return mesh;

    }

}

interface PLYParseInfo {
    curElement: string;
    curElementIdx: number;
    curCount: number;
    curNumProperties: number;
}

interface PLYBinaryInfo {
    data: DataView<ArrayBuffer>;
    cursor: number;
    littleEndian: boolean;
}

export class PLYLoader {

    static parseHeader(ply: PLYMeshData, header: string) {
        const lines = header.split("\n");
        const praseInfo: PLYParseInfo = {
            curElement: "",
            curElementIdx: -1,
            curCount: 0,
            curNumProperties: 0
        }
        for (const line of lines) {
            if (line.trim().length === 0) {
                continue;
            }
            PLYLoader.parseHeaderLine(ply, praseInfo, line);
        }
    }

    static parseHeaderLine(ply: PLYMeshData, info: PLYParseInfo, line: string) {
        if (line.startsWith("ply")) {
            return;
        }

        if (line.startsWith("format")) {
            const words = line.split(" ");
            ply.formatName = words[1];
            ply.formatVersion = words[2];
            return;
        }

        if (line.startsWith("comment")) {
            return;
        }

        if (line.startsWith("element")) {
            const words = line.split(" ");
            const element = words[1];
            const count = parseFloat(words[2]);
            const index = Object.keys(ply.elements).length;
            ply.elements[element] = {
                index,
                count,
                properties: {},

            }
            info.curElement = element;
            return;
        }

        if (line.startsWith("property")) {
            const words = line.split(" ");
            if (line.startsWith("property list")) {
                const lentype = words[2] as PLYDataTypes;
                const elmtype = words[3] as PLYDataTypes;
                const name = words[4];
                const index = Object.keys(ply.elements[info.curElement]!.properties).length;
                ply.elements[info.curElement]!.properties[name] = {
                    index,
                    name,
                    list: true,
                    lentype,
                    elmtype,
                    data: []

                }
            } else {
                const elmtype = words[1] as PLYDataTypes;
                const name = words[2];
                const index = Object.keys(ply.elements[info.curElement]!.properties).length;
                ply.elements[info.curElement]!.properties[name] = {
                    index,
                    name,
                    list: false,
                    elmtype,
                    data: []

                }
            }
            return;
        }

        if (line.startsWith("end_header")) {
            info.curElement = "";
            return;
        }
    }

    static parseAsciiBody(ply: PLYMeshData, body: string) {
        const lines = body.split("\n");
        const praseInfo: PLYParseInfo = {
            curElement: "",
            curElementIdx: -1,
            curCount: 0,
            curNumProperties: 0
        }
        for (const line of lines) {
            if (line.trim().length === 0) {
                continue;
            }
            PLYLoader.parseAsciiBodyLine(ply, praseInfo, line);
        }
    }

    static parseAsciiBodyLine(ply: PLYMeshData, info: PLYParseInfo, line: string) {
        if (info.curElement === '') {
            info.curElementIdx = 0;
            info.curElement = (Object.entries(ply.elements).filter(e => e[1].index === 0))[0][0];
            info.curCount = 0;
            info.curNumProperties = objectNumKeys(ply.elements[info.curElement].properties);
        }
        const count = ply.elements[info.curElement].count;
        if (info.curCount >= count) {
            info.curElementIdx++;
            info.curElement = (Object.entries(ply.elements).filter(e => e[1].index === info.curElementIdx))[0][0];
            info.curCount = 0;
            info.curNumProperties = objectNumKeys(ply.elements[info.curElement].properties);
        }
        const words = line.split(" ");
        for (let i = 0, p = 0; i < info.curNumProperties; ++i) {
            const entry = Object.entries(ply.elements[info.curElement].properties).filter(e => e[1].index === i)[0];
            const name = entry[0];
            if (entry[1].list) {
                const len = parseFloat(words[p]);
                // ply.elements[curElement].properties[name].data.push(...words.slice(p, p + len + 1).map(w => parseFloat(w)));
                ply.elements[info.curElement].properties[name].data.push(words.slice(p + 1, p + len + 1).map(w => parseFloat(w)));
                p += len + 1;
            } else {
                ply.elements[info.curElement].properties[name].data.push(parseFloat(words[p]));
                p += 1;
            }
        }
        info.curCount++;
    }

    private static getElement(ply: PLYMeshData, idx: number) {
        for (const entry of Object.entries(ply.elements)) {
            if (entry[1].index === idx) {
                return ply.elements[entry[0]];
            }
        }
        return null;
    }

    private static getProperty(element: PLYElement, idx: number) {
        for (const entry of Object.entries(element.properties)) {
            if (entry[1].index === idx) {
                return element.properties[entry[0]];
            }
        }
        return null;
    }

    static readNumber(bin: PLYBinaryInfo, typ: PLYDataTypes): number {
        let num = 0;
        switch (typ) {
            case PLYDataTypes.uchar:
                num = bin.data.getUint8(bin.cursor);
                break;
            case PLYDataTypes.char:
                num = bin.data.getInt8(bin.cursor);
                break;
            case PLYDataTypes.ushort:
                num = bin.data.getUint16(bin.cursor, bin.littleEndian);
                break;
            case PLYDataTypes.short:
                num = bin.data.getInt16(bin.cursor, bin.littleEndian);
                break;
            case PLYDataTypes.uint:
                num = bin.data.getUint32(bin.cursor, bin.littleEndian);
                break;
            case PLYDataTypes.int:
                num = bin.data.getInt32(bin.cursor, bin.littleEndian);
                break;
            case PLYDataTypes.float:
                num = bin.data.getFloat32(bin.cursor, bin.littleEndian);
                break;
            case PLYDataTypes.double:
                num = bin.data.getFloat64(bin.cursor, bin.littleEndian);
                break;
        }
        bin.cursor += PLYDataTypeBytes[typ];
        return num;
    }

    static readProperty(bin: PLYBinaryInfo, prop: PLYProperty) {
        if (prop.list) {
            const listLen = PLYLoader.readNumber(bin, prop.lentype);
            const values: number[] = [];
            for (let i = 0; i < listLen; ++i) {
                values.push(PLYLoader.readNumber(bin, prop.elmtype));
            }
            prop.data.push(values);
        } else {
            prop.data.push(PLYLoader.readNumber(bin, prop.elmtype));
        }
    }

    static createSinglePropertyBuffer(element: PLYElement, property: PLYProperty): ArrayBuffer {
        const propBytes = PLYDataTypeBytes[property.elmtype];
        const elemCount = element.count;
        const buffer = new ArrayBuffer(propBytes * elemCount);
        return buffer;
    }

    static parseBinBody(ply: PLYMeshData, bin: PLYBinaryInfo) {
        const nElements = Object.keys(ply.elements).length;
        for (let e = 0; e < nElements; ++e) {
            const element = PLYLoader.getElement(ply, e);
            const count = element.count;
            const nProps = Object.keys(element.properties).length;
            for (let c = 0; c < count; ++c) {
                if (c % 100 === 0) {
                    console.log(`element: ${c}/${count}`);
                }
                for (let p = 0; p < nProps; ++p) {
                    const prop = PLYLoader.getProperty(element, p);
                    PLYLoader.readProperty(bin, prop);
                }
            }
        }
    }

    static async load(uri: string) {

        console.log("start ply load");

        const response = await fetch(uri);
        const arrayBuffer = await response.arrayBuffer();

        const ply = new PLYMeshData();

        const text = new TextDecoder().decode(arrayBuffer);

        const headerEnd = text.indexOf("end_header\n") + "end_header\n".length;

        const header = text.slice(0, headerEnd);

        PLYLoader.parseHeader(ply, header);

        if (ply.formatName === 'ascii') {
            const body = text.slice(headerEnd);
            PLYLoader.parseAsciiBody(ply, body);
        } else {
            let littleEndian = false;
            if (ply.formatName === 'binary_little_endian') {
                littleEndian = true;
            } else if (ply.formatName === 'binary_big_endian') {
                littleEndian = false;
            } else {
                throw Error("invalid ply format");
            }
            const data = new DataView(arrayBuffer, headerEnd);
            const bin: PLYBinaryInfo = {
                data,
                cursor: 0,
                littleEndian
            }
            PLYLoader.parseBinBody(ply, bin);
        }

        return ply;
    }

    static loadByWorker(uri: string, callback: (ply: PLYMeshData) => void): string {
        const worker = new PLYWorker();
        worker.onmessage = (e) => {
            console.log("xxxxx", e);
            callback(e.data.ply);
        }
        const taskId = crypto.randomUUID();
        worker.postMessage({ taskId, uri });
        return taskId;
    }
}