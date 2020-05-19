export function setToObject(obj: {}, prop: string, value: string): string {
    const index = prop.indexOf('.');
    if (index > -1) {
        return setToObject(obj[prop.substring(0, index)], prop.substr(index + 1), value);
    }

    return obj[prop] = value;
}

export function fromStringToObject(string: string, lastValue: {} = {}): { [p: string]: {} } {
    return string.split('.').reduceRight((acc, currentValue) => {
        return { [currentValue]: acc }
    }, lastValue)
}

export function flatten(obj: {}, roots: any[] = [], sep: string = '.'): {} {
    return Object
        .keys(obj)
        .reduce((memo, prop) => Object.assign(
            {},
            memo,
            Object.prototype.toString.call(obj[prop]) === '[object Object]'
                ? flatten(obj[prop], roots.concat([prop]))
                : {[roots.concat([prop]).join(sep)]: obj[prop]},
        ), {})
}