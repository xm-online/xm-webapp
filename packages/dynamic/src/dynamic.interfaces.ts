import { NgModuleFactory, Type } from '@angular/core';

export interface DynamicModule<T> {
    entry?: Type<T>;
}

export type DynamicNgModuleFactory<T> = NgModuleFactory<DynamicModule<T>>;

export interface DynamicComponent<T = unknown> {
    selector?: string;
    loadChildren?: () => Type<T> | DynamicNgModuleFactory<T> | Promise<DynamicNgModuleFactory<T> | Type<T>>;
}

export type DynamicComponents = DynamicComponent[] | DynamicComponent[][];
