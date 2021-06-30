export function isEmpty(obj: Record<string, unknown>): boolean {
    return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
}

export function partitionArray(array: any[], predicate: (e: any) => boolean): any[][] {
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
    return re.test(phrase);
}

export function sprintf(text: string, ...values: string[]): string {
    for (let i = 0; i < values.length; i++) {
        text = text.replace(`{${i}}`, values[i]);
    }
    return text;
}