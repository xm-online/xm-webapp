import { EventEmitter } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

export abstract class NgModelWrapper<T> implements ControlValueAccessor {

    public disabled: boolean;
    public value: T;
    public valueChange: EventEmitter<T> = new EventEmitter<T>();

    public writeValue(obj: T): void {
        this.value = obj;
    }

    public registerOnChange(fn: () => void): void {
        this._onChange = fn;
    }

    public registerOnTouched(fn: () => void): void {
        this._onTouched = fn;
    }

    public setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    public change(v: T): void {
        this._onChange(v);
        this.value = v;
        this.valueChange.next(v);
    }

    public touche(v?: T): void {
        this._onTouched(v);
    }

    protected _onChange: (v: T) => void = () => undefined;

    protected _onTouched: (v: T) => void = () => undefined;

}
