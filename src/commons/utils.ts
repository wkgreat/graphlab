export function objectNumKeys(obj: object): number {
    return Object.keys(obj).length;
}

export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

export function assertNotNull<T>(
    value: T,
    message = 'Value must not be null or undefined'
): asserts value is NonNullable<T> {
    if (value == null) {
        throw new Error(message);
    }
}