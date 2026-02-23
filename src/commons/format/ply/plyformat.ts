import { type IntArray, type TypedArray, type TypedArrayConstructor } from "../../arraybuffer";
import { logger } from "../../logger";
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

export interface PLYDataTypeInfo {
    ctor: TypedArrayConstructor,
    elemBytes: number,
    read: (bin: PLYBinaryInfo) => number
}

export const PLYDataTypeInfos: Record<string, PLYDataTypeInfo> = {
    char: { ctor: Int8Array, elemBytes: 1, read: (b) => b.data.getInt8(b.cursor) },
    uchar: { ctor: Uint8Array, elemBytes: 1, read: (b) => b.data.getUint8(b.cursor) },
    short: { ctor: Int16Array, elemBytes: 2, read: (b) => b.data.getInt16(b.cursor, b.littleEndian) },
    ushort: { ctor: Uint16Array, elemBytes: 2, read: (b) => b.data.getUint16(b.cursor, b.littleEndian) },
    int: { ctor: Int32Array, elemBytes: 4, read: (b) => b.data.getInt32(b.cursor, b.littleEndian) },
    uint: { ctor: Uint32Array, elemBytes: 4, read: (b) => b.data.getUint32(b.cursor, b.littleEndian) },
    float: { ctor: Float32Array, elemBytes: 4, read: (b) => b.data.getFloat32(b.cursor, b.littleEndian) },
    double: { ctor: Float32Array, elemBytes: 8, read: (b) => b.data.getFloat64(b.cursor, b.littleEndian) }
} as const;

export interface PLYProperty {
    index: number,
    name: string,
    list?: boolean,
    lentype?: PLYDataTypes,
    listLenData?: TypedArray,
    listidx?: number,
    offsetData?: Int32Array,
    elmtype?: PLYDataTypes,
    data?: TypedArray
};

export interface PLYElement {
    index: number,
    name: string,
    count: number,
    properties: Record<string, PLYProperty>
    propindex: Record<number, string>
};

export default class PLYMeshData {

    formatName?: string;

    formatVersion?: string;

    elements: Record<string, PLYElement> = {}
    elemindex: Record<number, string> = {}

    getElementByIndex(idx: number) {
        return this.elements[this.elemindex[idx]];
    }

    getElementByName(name: string) {
        return this.elements[name];
    }

    getPropertyByIndex(elemIdx, propIdx: number) {
        const element = this.getElementByIndex(elemIdx);
        return element.properties[element.propindex[propIdx]];
    }

    getPropertyByName(elem: string, prop: string) {
        const element = this.getElementByName(elem);
        return element.properties[prop];
    }

    constructor() {}

    toMesh(): Mesh | null {

        const mesh = new Mesh();

        const vertexData = this.elements["vertex"];

        const xData = vertexData.properties["x"].data;
        const yData = vertexData.properties["y"].data;
        const zData = vertexData.properties["z"].data;

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
        const indexData = faceData.properties["vertex_indices"].data;

        //TODO 这里假设都为三角形，考虑face为四边形的情况
        //TODO 考虑类型
        mesh.vertexIndices = indexData as IntArray;

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
                name: element,
                count,
                properties: {},
                propindex: {}

            }
            ply.elemindex[index] = element;
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
                    listidx: 0,
                }
                ply.elements[info.curElement]!.propindex[index] = name;

            } else {
                const elmtype = words[1] as PLYDataTypes;
                const name = words[2];
                const index = Object.keys(ply.elements[info.curElement]!.properties).length;
                ply.elements[info.curElement]!.properties[name] = {
                    index,
                    name,
                    list: false,
                    elmtype,
                    listidx: 0,
                }
                ply.elements[info.curElement]!.propindex[index] = name;
            }
            return;
        }

        if (line.startsWith("end_header")) {
            info.curElement = "";
            return;
        }
    }

    static initPropertyData(ply: PLYMeshData) {
        const nElements = Object.keys(ply.elements).length;

        // for each element
        for (let e = 0; e < nElements; ++e) {
            const element = ply.getElementByIndex(e);
            const propertyNames = Object.keys(element.properties);

            //init buffer
            for (const propName of propertyNames) {
                const property = element.properties[propName];
                if (property.list) {
                    property.listLenData = new PLYDataTypeInfos[property.lentype].ctor(element.count);
                    property.offsetData = new Int32Array(element.count);
                } else {
                    const data: TypedArray = new PLYDataTypeInfos[property.elmtype].ctor(element.count);
                    property.data = data;
                }
            }
        }
    }

    static initListPropertyData(ply: PLYMeshData) {
        const nElements = Object.keys(ply.elements).length;

        // for each element
        for (let e = 0; e < nElements; ++e) {
            const element = ply.getElementByIndex(e);
            const propertyNames = Object.keys(element.properties);

            //init buffer
            for (const propName of propertyNames) {
                const property = element.properties[propName];
                if (property.list) {
                    let totlen = 0;
                    for (let i = 0; i < element.count; ++i) {
                        totlen += property.listLenData[i];
                    }
                    const data: TypedArray = new PLYDataTypeInfos[property.elmtype].ctor(totlen);
                    property.data = data;
                }
            }
        }
    }

    static parseAsciiBody(ply: PLYMeshData, body: string) {

        logger.info("start ply parseAsciiBody");

        this.initPropertyData(ply);

        const lines = body.split("\n");
        let praseInfo: PLYParseInfo = {
            curElement: "",
            curElementIdx: -1,
            curCount: 0,
            curNumProperties: 0
        }

        for (const line of lines) {
            if (line.trim().length === 0) {
                continue;
            }
            this.parseAsciiBodyLine(ply, praseInfo, line, false);
        }

        this.initListPropertyData(ply);

        praseInfo = {
            curElement: "",
            curElementIdx: -1,
            curCount: 0,
            curNumProperties: 0
        }

        for (const line of lines) {
            if (line.trim().length === 0) {
                continue;
            }
            this.parseAsciiBodyLine(ply, praseInfo, line, true);
        }

    }

    static parseAsciiBodyLine(ply: PLYMeshData, info: PLYParseInfo, line: string, forListData: boolean) {
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
            const property = ply.elements[info.curElement].properties[name];
            if (forListData) {
                if (property.list) {
                    const len = property.listLenData[info.curCount];
                    const p = property.offsetData[info.curCount];
                    for (let v = 0; v < len; ++v) {
                        property.data[property.listidx++] = parseFloat(words[p + 1 + v]);
                    }
                }
            } else {
                if (property.list) {
                    const len = parseInt(words[p]);
                    property.listLenData[info.curCount] = len;
                    property.offsetData[info.curCount] = p;
                    p += len + 1;
                } else {
                    property.data[info.curCount] = parseFloat(words[p]);
                    p += 1;
                }
            }

        }
        info.curCount++;
    }

    static readNumber(bin: PLYBinaryInfo, typ: PLYDataTypes, move: boolean = true): number {
        const num = PLYDataTypeInfos[typ].read(bin);
        if (move) {
            bin.cursor += PLYDataTypeInfos[typ].elemBytes;
        }
        return num;
    }

    static readProperty(bin: PLYBinaryInfo, n: number, element: PLYElement, property: PLYProperty) {
        if (property.list) {
            property.offsetData[n] = bin.cursor;
            const listLen = this.readNumber(bin, property.lentype);
            property.listLenData[n] = listLen;
            const numBytes = listLen * PLYDataTypeInfos[property.elmtype].elemBytes;
            // skip list data read
            bin.cursor += numBytes;
        } else {
            property.data[n] = this.readNumber(bin, property.elmtype);
        }
    }


    static readListProperty(bin: PLYBinaryInfo, n: number, property: PLYProperty) {
        bin.cursor = property.offsetData[n];
        const listLen = this.readNumber(bin, property.lentype);
        property.listLenData[n] = listLen;
        for (let i = 0; i < listLen; ++i) {
            property.data[property.listidx++] = this.readNumber(bin, property.elmtype);
        }
    }

    static parseBinBody(ply: PLYMeshData, bin: PLYBinaryInfo) {

        logger.info("ply parseBinBody start");

        const nElements = Object.keys(ply.elements).length;

        this.initPropertyData(ply);

        // for each element
        for (let e = 0; e < nElements; ++e) {
            const element = ply.getElementByIndex(e);
            const propertyNames = Object.keys(element.properties);

            const count = element.count;
            const step = count / 10;

            // read single property buffer
            logger.info("read single property buffer");
            for (let v = 0; v < element.count; ++v) {

                if (v % step === 0) {
                    const t = v / step * 10;
                    logger.info(`Element: ${element.name}, Progress: ${t}%`);
                }

                for (let p = 0; p < propertyNames.length; ++p) {
                    const property = ply.getPropertyByIndex(e, p);
                    this.readProperty(bin, v, element, property);
                }
            }

            this.initListPropertyData(ply);

            // read list property buffer
            logger.info("read list property buffer");
            for (let v = 0; v < element.count; ++v) {

                if (v % step == 0) {
                    const t = v / step * 10;
                    logger.info(`Element: ${element.name}, Progress: ${t}%`);
                }

                for (let p = 0; p < propertyNames.length; ++p) {
                    const property = ply.getPropertyByIndex(e, p);
                    if (property.list) {
                        console.log("here");
                        logger.info("read list property buffer");
                        this.readListProperty(bin, v, property);
                    }
                }
            }
        }

        logger.info("ply parseBinBody finish");
    }

    static async load(uri: string) {

        logger.info(`ply load start ${uri}`);

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

        logger.info(`ply load finish`);

        return ply;
    }

    static loadByWorker(uri: string, callback: (ply: PLYMeshData) => void): string {
        logger.info("start ply loadByWorker");
        const worker = new PLYWorker();
        worker.onmessage = (e) => {
            callback(e.data.ply);
        }
        const taskId = crypto.randomUUID();
        worker.postMessage({ taskId, uri });
        return taskId;
    }
}