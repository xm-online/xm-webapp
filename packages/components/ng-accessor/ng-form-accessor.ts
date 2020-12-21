import { Directive, Input, OnChanges, OnDestroy, OnInit, Optional, Self, SimpleChanges } from '@angular/core';
import { FormControl, FormControlDirective, NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgControlAccessor } from './ng-control-accessor';

@Directive()
export abstract class NgFormAccessor<T> extends NgControlAccessor<T> implements OnInit, OnChanges, OnDestroy {
    @Input() public control: FormControl = new FormControl();
    private valueSubscription: Subscription;

    constructor(@Optional() @Self() public ngControl: NgControl | null) {
        super(ngControl);
        if (this.ngControl instanceof FormControlDirective) {
            this.control = this.ngControl.control;
        }
    }

    public get value(): T {
        return this.control.value;
    }

    @Input()
    public set value(value: T) {
        this.control.patchValue(value, { emitEvent: false });
    }

    public get disabled(): boolean {
        return this.control.disabled;
    }

    @Input()
    public set disabled(value: boolean) {
        if (value) {
            this.control.disable();
        } else {
            this.control.enable();
        }
    }

    public ngOnInit(): void {
        this.initControlChangeListeners();
    }

    public writeValue(obj: T): void {
        this.value = obj;
        if (this.control) {
            this.control.patchValue(obj);
        }
    }

    public setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    public ngOnDestroy(): void {
        this.valueSubscription?.unsubscribe();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.control) {
            this.initControlChangeListeners();
        }
    }

    protected initControlChangeListeners(): void {
        this.valueSubscription?.unsubscribe();
        if (this.control) {
            this.valueSubscription = this.control.valueChanges
                .subscribe((value) => this.change(value));
        }
    }
}
