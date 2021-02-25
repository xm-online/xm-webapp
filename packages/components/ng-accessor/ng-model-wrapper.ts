import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

@Directive()
/**
 * The NgModelWrapper is used to implement ControlValueAccessor and
 * provides input and output for derived classes.
 *
 * @public
 */
export class NgModelWrapper<T> implements ControlValueAccessor {
    /**
     * Returns event every time when the value changes from the inside e.g.
     * {@link change} event.
     *
     * @public
     */
    @Output() public valueChange: EventEmitter<T> = new EventEmitter<T>();

    protected _value: T;

    public get value(): T {
        return this._value;
    }

    @Input()
    /**
     * Sets value value
     * @param value - the value
     *
     * @public
     */
    public set value(value: T) {
        this._value = value;
    }

    protected _disabled: boolean;

    public get disabled(): boolean {
        return this._disabled;
    }

    @Input()
    /**
     * Sets value value
     * @param value - the value
     *
     * @public
     */
    public set disabled(value: boolean) {
        this._disabled = value;
    }

    /**
     * Sets the value property
     * @public
     */
    public writeValue(value: T): void {
        this.value = value;
    }

    /**
     * Sets onChange callback
     * @public
     */
    public registerOnChange(fn: () => void): void {
        this._onChange = fn;
    }

    /**
     * Sets onTouched callback
     * @public
     */
    public registerOnTouched(fn: () => void): void {
        this._onTouched = fn;
    }

    /**
     * Sets the disabled property
     * @public
     */
    public setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    /**
     * Sets value and emits event
     * @param value - value
     * @public
     */
    public change(value: T): void {
        this._onChange(value);
        this.value = value;
        this.valueChange.next(value);
    }

    /**
     * Emits onTouched callback
     * @public
     */
    public touch(v?: T): void {
        this._onTouched(v);
    }

    protected _onChange: (v: T) => void = () => undefined;

    protected _onTouched: (v: T) => void = () => undefined;

}
