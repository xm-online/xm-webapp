import * as path from 'path';
import * as resolve from 'resolve';
import { sassUrlVariantsFactory } from './sass-url-variants';
import { resolvePackageKeyFactory } from './resolve-package-key';
import { IResolve, IResolvePackageKey, IResolvePackageUrl, ISassUrlVariants } from './interface';

export const sassUrlVariants = sassUrlVariantsFactory(path);
export const resolvePackageKey = resolvePackageKeyFactory();
export const resolvePackageUrl = resolvePackageUrlFactory(resolve, resolvePackageKey, sassUrlVariants);

export function resolvePackageUrlFactory(
    resolve: IResolve,
    resolvePackageKey: IResolvePackageKey,
    sassUrlVariants: ISassUrlVariants,
): IResolvePackageUrl {
    return (url: string, extensions: string[], cwd: string, packageKeys: any) => {
        let file: string | null = null;

        sassUrlVariants(url, extensions).some((urlVariant: string) => {
            try {
                /* istanbul ignore next: resolve.sync is mocked anyway */
                const resolvedPath = resolve.sync(urlVariant, {
                    basedir: cwd,
                    packageFilter: (packageJson) => resolvePackageKey(packageJson, packageKeys),
                    extensions,
                });
                if (resolvedPath) {
                    file = resolvedPath;
                    return true;
                }
            } catch (e) {
                // Prevent the resolve module from throwing an
                // exception if no matching package is found.
            }
            return false;
        });

        return file;
    };
}

