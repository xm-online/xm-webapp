import { OnChanges, OnDestroy, OnInit, SimpleChanges, Directive } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgControlAccessor } from './ng-control-accessor';

@Directive()
export abstract class NgFormAccessor<T> extends NgControlAccessor<T> implements OnInit, OnChanges, OnDestroy {
    public control: FormControl = new FormControl();
    private valueSubscription: Subscription;

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
        if (this.control) {
            if (this.disabled) {
                this.control.disable();
            } else {
                this.control.enable();
            }
        }
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
            this.change(this.control.value);
            this.valueSubscription = this.control.valueChanges
                .subscribe((value) => this.change(value));
        }
    }

}
