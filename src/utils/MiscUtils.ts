export function isEmpty(obj): boolean {
    return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
}