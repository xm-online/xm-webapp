import { EventEmitter, Type } from '@angular/core';

export interface IValue<V> {
    value: V;
}

export interface IOptions<O> {
    options: O;
}

export interface IComponent<V, O> extends IValue<V>, IOptions<O> {
    value: V;
    options: O;
}

export interface IControl<V, O> extends IComponent<V, O> {
    valueChange: EventEmitter<V>;
    disabled: boolean;

    // Implement angular ngModel
    registerOnChange(fn: any): void;

    registerOnTouched?(fn: any): void;

    setDisabledState?(isDisabled: boolean): void;
}

export type IComponentFn<V = unknown, O = unknown> = Type<IComponent<V, O>>;

export interface IControlFn {
    new(...args: any[]): IControl<any, any>;
}
