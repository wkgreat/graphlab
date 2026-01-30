export function objectNumKeys(obj: object): number {
    return Object.keys(obj).length;
}

export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
} 