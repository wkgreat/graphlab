import { objectNumKeys } from "../utils";
import { Mesh } from "./mesh";

export default class PLYMeshData {

    formatName?: string;

    formatVersion?: string;

    elements: {
        [key: string]: {
            index: number,
            count: number,
            properties: { [key: string]: { index: number, list: boolean, lentype?: string, elmtype: string, data: (number | number[])[] } }
        }
    } = {}

    constructor() {}

    toMesh(): Mesh | null {

        console.log(this.elements);

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

        console.log(mesh);

        return mesh;

    }

    static loadFromString(str: string): PLYMeshData | null {

        let header: boolean = true;

        let curElement: string = "";
        let curElementIdx: number = -1;
        let curCount: number = 0;
        let curNumProperties = 0;

        const ply = new PLYMeshData();

        const lines = str.split("\n");

        function parseHeaderLine(line: string) {
            if (line.startsWith("ply")) {
                return;
            }

            if (line.startsWith("format")) {
                const words = line.split(" ");
                ply.formatName = words[1];
                ply.formatVersion = words[2];
                //TODO 支持解析二进制数据
                if (ply.formatName !== 'ascii') {
                    console.error("ply当前只支持ascii格式数据解析");
                }
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
                curElement = element;
                return;
            }

            if (line.startsWith("property")) {
                const words = line.split(" ");
                if (line.startsWith("property list")) {
                    const lentype = words[2];
                    const elmtype = words[3];
                    const name = words[4];
                    const index = Object.keys(ply.elements[curElement]!.properties).length;
                    ply.elements[curElement]!.properties[name] = {
                        index,
                        list: true,
                        lentype,
                        elmtype,
                        data: []

                    }
                } else {
                    const elmtype = words[1];
                    const name = words[2];
                    const index = Object.keys(ply.elements[curElement]!.properties).length;
                    ply.elements[curElement]!.properties[name] = {
                        index,
                        list: false,
                        elmtype,
                        data: []

                    }
                }
                return;
            }

            if (line.startsWith("end_header")) {
                header = false;
                curElement = "";
                return;
            }
        }

        function parseDataLine(line: string) {

            if (curElement === '') {
                curElementIdx = 0;
                curElement = (Object.entries(ply.elements).filter(e => e[1].index === 0))[0][0];
                curCount = 0;
                curNumProperties = objectNumKeys(ply.elements[curElement].properties);
            }
            const count = ply.elements[curElement].count;
            if (curCount >= count) {
                curElementIdx++;
                curElement = (Object.entries(ply.elements).filter(e => e[1].index === curElementIdx))[0][0];
                curCount = 0;
                curNumProperties = objectNumKeys(ply.elements[curElement].properties);
            }
            const words = line.split(" ");
            for (let i = 0, p = 0; i < curNumProperties; ++i) {
                const entry = Object.entries(ply.elements[curElement].properties).filter(e => e[1].index === i)[0];
                const name = entry[0];
                if (entry[1].list) {
                    const len = parseFloat(words[p]);
                    // ply.elements[curElement].properties[name].data.push(...words.slice(p, p + len + 1).map(w => parseFloat(w)));
                    ply.elements[curElement].properties[name].data.push(words.slice(p + 1, p + len + 1).map(w => parseFloat(w)));
                    p += len + 1;
                } else {
                    ply.elements[curElement].properties[name].data.push(parseFloat(words[p]));
                    p += 1;
                }
            }
            curCount++;
        }

        for (const line of lines) {

            if (line.trim().length === 0) {
                continue;
            }
            if (header) {
                parseHeaderLine(line);
            } else {
                parseDataLine(line);
            }

        }
        return ply;

    }

    static async loadFromURL(url: string): Promise<PLYMeshData> {

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const data = await response.text();

        return PLYMeshData.loadFromString(data);

    }

}