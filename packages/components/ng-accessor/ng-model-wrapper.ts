import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

@Directive()
export abstract class NgModelWrapper<T> implements ControlValueAccessor {
    @Output() public valueChange: EventEmitter<T> = new EventEmitter<T>();

    protected _value: T;

    public get value(): T {
        return this._value;
    }

    @Input()
    public set value(value: T) {
        this._value = value;
    }

    protected _disabled: boolean;

    public get disabled(): boolean {
        return this._disabled;
    }

    @Input()
    public set disabled(value: boolean) {
        this._disabled = value;
    }

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
