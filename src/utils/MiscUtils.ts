export function isEmpty(obj: Record<string, unknown>): boolean {
    return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
}

export function isString(x: any): x is string {
    return typeof x === "string";
}

export function isNumber(x: any): x is number {
    return typeof x === "number";
}

export function partitionArray(array: any[], predicate: (e: any) => boolean) {
    const arrTrue = [];
    const arrFalse = [];
    array.forEach(e => {
        (predicate(e) ? arrTrue : arrFalse).push(e);
    });
    return [arrTrue, arrFalse];
}

export function isURL(phrase: string): boolean {
    if (!phrase) return false;

    const re = new RegExp("^(http|https)://");
    if (re.test(phrase)) {
        return true;
    }

    return false;
}