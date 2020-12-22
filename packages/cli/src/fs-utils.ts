import * as fs from 'fs';
import * as glob from 'glob';

export const isDirectory = (source: string): boolean => fs.lstatSync(source).isDirectory();

export const getDirectories = (source: string): string[] => glob.sync(source).filter(isDirectory);

export function readAsJson<R = object>(file: string): R {
    let json = {};
    try {
        json = JSON.parse(fs.readFileSync(file).toString());
    } catch (e) {
        console.warn('Problem with: %o; \n %o', file, e);
    }
    return json as R;
}

export function saveAsJson(path: string, data: unknown): void {
    fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\r\n', { encoding: 'utf8' });
}
