import * as resolve from 'resolve';
import * as path from 'path';

export type IPath = typeof path;
export type IResolve = typeof resolve;
export type IResolvePackageKey = (
    packageJson: object,
    packageKeys: string[],
) => object;

export type IResolvePackageUrl = (
    url: string,
    extensions: string[],
    cwd: string,
    packageKeys: any,
) => string | null;

export type ISassUrlVariants = (
    url: string,
    extensions?: string[],
) => string[];

export interface IPackageImporterOptions {
    cwd?: string;
    extensions?: string[];
    packageKeys?: string[];
    packagePrefix?: string;
}
