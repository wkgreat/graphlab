export type TypedArray =
    | Int8Array
    | Uint8Array
    | Int16Array
    | Uint16Array
    | Int32Array
    | Uint32Array
    | Float32Array
    | Float64Array

export type TypedArrayConstructor =
    | Int8ArrayConstructor
    | Uint8ArrayConstructor
    | Int16ArrayConstructor
    | Uint16ArrayConstructor
    | Int32ArrayConstructor
    | Uint32ArrayConstructor
    | Float32ArrayConstructor
    | Float64ArrayConstructor

export type IntArray =
    | Int8Array
    | Uint8Array
    | Int16Array
    | Uint16Array
    | Int32Array
    | Uint32Array

export default class ArrayBufferUtils {
    static concat<T extends TypedArray>(arr0: T, arr1: T): T {

        const len0 = arr0.length;
        const len1 = arr1.length;
        const ctor = arr0.constructor as new (length: number) => T;
        const out = new ctor(len0 + len1);
        out.set(arr0);
        out.set(arr1, len0);
        return out;
    }

    static viewAtIndex<T extends ArrayBufferView>(
        arr: T,
        i: number,
        ctor: { new(buffer: ArrayBufferLike, byteOffset: number, length: number): T },
        bytesPerElement: number
    ): T {
        return new ctor(
            arr.buffer,
            arr.byteOffset + i * bytesPerElement,
            1
        )
    }

    static createTypedArray<T extends TypedArray>(
        length: number,
        ctor: { new(length: number): T },): T {
        return new ctor(length);
    }

};