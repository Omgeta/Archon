export function isEmpty(obj: Record<string, unknown>): boolean {
    return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
}

export function isString(x: any): x is string {
    return typeof x === "string";
}

export function isNumber(x: any): x is number {
    return typeof x === "number";
}