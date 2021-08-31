import { resolvePackageUrl } from './resolve-package-url';
import * as fs from 'fs';
import { IPackageImporterOptions } from './interface';

export function packageImporter(userOptions?: IPackageImporterOptions): any {
    const options = Object.assign({}, defaultOptions, userOptions);

    if (options.hasOwnProperty('prefix')) {
        process.emitWarning('Using the `prefix` option is not supported anymore, use `packagePrefix` instead.');
    }

    const escapedPrefix = options.packagePrefix.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const matchPackageUrl = new RegExp(`^${escapedPrefix}(?!/)`);

    return function importer(url: string) {
        if (!url.match(matchPackageUrl)) {
            return null;
        }

        const cleanedUrl = url.replace(matchPackageUrl, '');
        const file = resolvePackageUrl(
            cleanedUrl,
            options.extensions,
            options.cwd,
            options.packageKeys,
        );

        if (!file) {
            return null;
        }

        if (/\.css$/.test(file)) {
            return {contents: fs.readFileSync(file, 'utf-8')};
        }
        return {file: file.replace(/\.css$/, '')};
    };
}


export const defaultOptions: {
    cwd: string;
    extensions: string[];
    packageKeys: string[];
    packagePrefix: string;
} = {
    cwd: process.cwd(),
    extensions: [
        '.scss',
        '.sass',
        '.css',
    ],
    packageKeys: [
        'sass',
        'scss',
        'style',
        'css',
        'main.sass',
        'main.scss',
        'main.style',
        'main.css',
        'main',
    ],
    packagePrefix: '~',
};


