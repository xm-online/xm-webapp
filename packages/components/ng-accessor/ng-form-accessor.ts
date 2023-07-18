import { Directive, Input, OnDestroy, OnInit, Optional, Self } from '@angular/core';
import { UntypedFormControl, FormControlDirective, FormControlName, NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgControlAccessor } from './ng-control-accessor';
import { ArgumentException } from '@xm-ngx/exceptions';

@Directive()
/**
 * @deprecated
 * Use NgControlAccessor
 *
 * NgControlAccessor mark your component as reactive control.
 *
 * This control accessor does the same as NgControlAccessor, except has input control.
 * This means that inside the control we accept another control, it's incorrect behavior
 */
export class NgFormAccessor<T> extends NgControlAccessor<T> implements OnInit, OnDestroy {
    private valueSubscription: Subscription;

    private defaultControl: UntypedFormControl = new UntypedFormControl();

    constructor(@Optional() @Self() public ngControl: NgControl) {
        super(ngControl);
        this.control = this.defaultControl;
    }

    protected _control: UntypedFormControl;

    public get control(): UntypedFormControl {
        return this._control;
    }

    @Input()
    /**
     * @throws {@link TypeError}
     * This exception is thrown if the value is not present.
     *
     * @public
     */
    public set control(value: UntypedFormControl) {
        if (!value) {
            throw new ArgumentException('FormControl is required!');
        }
        if (value === this._control) {
            console.warn('FormControl applies twice! This control is already initialized.');
            return;
        }
        this._control = value;
        this.writeValue(this._control.value);
        this.initControlChangeListeners();
    }

    public get value(): T {
        return this.control.value;
    }

    @Input()
    public set value(value: T) {
        if (value === this.control.value) {
            return;
        }
        this.control.patchValue(value, { emitEvent: false });
    }

    public get disabled(): boolean {
        return this.control.disabled;
    }

    @Input()
    public set disabled(value: boolean) {
        if (value === this.control.disabled) {
            return;
        }

        if (value) {
            this.control.disable();
        } else {
            this.control.enable();
        }
    }

    public writeValue(obj: T): void {
        this.value = obj;
    }

    public setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    public ngOnDestroy(): void {
        this.valueSubscription?.unsubscribe();
    }

    public change(value: T): void {
        this.value = value;
        this._onChange(value);
        this.valueChange.emit(value);
    }

    /**
     * @remarks
     * FormControlDirective initialized after NgFormAccessor
     */
    public ngOnInit(): void {
        if ((this.ngControl instanceof FormControlDirective || this.ngControl instanceof FormControlName)
            && this.ngControl.control) {
            this.control = this.ngControl.control;
        }
    }

    /**
     * Emits {@link change} when the {@link control} value changes
     *
     * @throws {@link TypeError}
     * This exception is thrown if the {@link control} is not present.
     *
     * @internal
     */
    protected initControlChangeListeners(): void {
        if (!this.control) {
            throw new TypeError('FormControl is required to emit changes!');
        }
        this.valueSubscription?.unsubscribe();
        this.valueSubscription = this.control.valueChanges
            .subscribe((value) => {
                // changes comes from inside
                // and requires to emit event outside
                if (this.control === this.defaultControl) {
                    this.change(value);
                } else {
                    // changes comes from outside
                    this.writeValue(value);
                }
            });
    }
}
