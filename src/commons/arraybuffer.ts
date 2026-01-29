export type ArrayBuffer = Uint16Array | Int16Array | Uint32Array | Int32Array | Float32Array;

export default class ArrayBufferUtils {
    static concat<T extends ArrayBuffer>(arr0: T, arr1: T): T {

        const len0 = arr0.length;
        const len1 = arr1.length;
        const ctor = arr0.constructor as new (length: number) => T;
        const out = new ctor(len0 + len1);
        out.set(arr0);
        out.set(arr1, len0);
        return out;
    }
};