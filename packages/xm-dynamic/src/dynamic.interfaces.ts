import { NgModuleFactory, Type } from '@angular/core';

export interface IDynamicModule<T> {
    entry?: Type<T>;
}

export type DynamicNgModuleFactory<T> = NgModuleFactory<IDynamicModule<T>>;

export interface IDynamicComponent<T = unknown> {
    selector?: string;
    loadChildren?: () => Type<T> | DynamicNgModuleFactory<T> | Promise<DynamicNgModuleFactory<T> | Type<T>>;
}

export type DynamicComponent = IDynamicComponent;
export type DynamicComponents = DynamicComponent[] | DynamicComponent[][];
