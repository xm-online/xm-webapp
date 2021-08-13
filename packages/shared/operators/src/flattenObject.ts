export function flattenObject(object: Record<string, unknown>, separator: string = '.'): Record<string, unknown> {
    return Object.assign({}, ...(function _deep(_object: Record<string, unknown>, _path: string[] = []) {
        return [].concat(
            ...Object.keys(_object).map((key) => {
                if (typeof _object[key] === 'object' && _object[key] !== null && _object[key] !== undefined) {
                    return _deep(_object[key] as Record<string, unknown>, [..._path, ...[key]]);
                }
                return { [[..._path, ...[key]].join(separator)]: _object[key] };
            }),
        );
    })(object));
}
