import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Optional,
    Output,
    Self,
    SimpleChanges,
} from '@angular/core';
import { NgControl, UntypedFormGroup } from '@angular/forms';
import { NgControlAccessor } from '@xm-ngx/components/ng-accessor';
import { FormGroupLayoutFactoryService, FormLayoutItem, FormLayoutModule } from '@xm-ngx/components/form-layout';
import * as _ from 'lodash';
import { isEqual, isNil, omitBy } from 'lodash';
import { BehaviorSubject, combineLatestWith, Observable, Subject, Subscription } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { AsyncPipe, NgIf } from '@angular/common';
import { QueryParams } from '@xm-ngx/repositories';
import { Primitive } from '@xm-ngx/interfaces';

export interface FiltersControlValue extends QueryParams {
    [key: string]: string | object | number | Primitive[];
}


@Component({
    selector: 'xm-quick-filters-control',
    template: `
        <ng-container *ngIf="hasFilters$ | async"></ng-container>

        <xm-form-layout [config]="options"
                        class="quick-form-layout"
                        [class]=""
                        [value]="formGroup">
        </xm-form-layout>
    `,
    standalone: true,
    styles:`
        .quick-form-layout {
            display: flex;
            flex-wrap: wrap;
        }
    `,
    imports: [
        NgIf,
        FormLayoutModule,
        AsyncPipe,
    ],
})
export class XmTableQuickFilterControl<T = FiltersControlValue> extends NgControlAccessor<T> implements OnInit, OnChanges, OnDestroy {
    public formGroup: UntypedFormGroup;

    @Input() public containerClass: string;
    @Input() public options: FormLayoutItem[];
    @Input() public submitInvalidForm: boolean = false;
    @Output() public valueChange: EventEmitter<T> = new EventEmitter<T>();
    @Output() public validStatusChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() public filtersChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

    private subscription: Subscription;

    private destroy$: Subject<void> = new Subject();
    private formValue$: BehaviorSubject<Record<string, unknown>> = new BehaviorSubject(undefined);
    private defaultFormValue$: BehaviorSubject<Record<string, unknown>> = new BehaviorSubject(undefined);

    public hasFilters$: Observable<boolean> = this.defaultFormValue$.asObservable().pipe(
        combineLatestWith(this.formValue$.asObservable()),
        map(([currentValue, defaultValue]) => (!isEqual(
            omitBy(currentValue, (v) => isNil(v) || v === ''),
            omitBy(defaultValue, (v) => isNil(v) || v === ''),
        ))),
        tap((res) => this.filtersChanged.emit(res)),
    );

    constructor(@Optional() @Self() public ngControl: NgControl | null,
                private layoutFactoryService: FormGroupLayoutFactoryService) {
        super(ngControl);
    }

    public ngOnDestroy(): void {
        this.destroyForm();
        this.destroy$.next();
        this.destroy$.complete();
    }

    public ngOnInit(): void {
        this.initForm();
        this.subscribeFormChanges();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        ///debugger on change
        if (this.formGroup && changes.disabled) {
            this.disabled ? this.formGroup.disable() : this.formGroup.enable();
        }

        if (this.formGroup && changes.value) {
            this.formGroup.setValue(this.value);
        }

        if (changes.options && !changes.options.isFirstChange()) {
            this.destroyForm();
            this.initForm();
            this.updateValue();
            this.subscribeFormChanges();
        }

    }

    public clearForm(): void {
        const form = this.layoutFactoryService.createForm(this.options);

        const value = Object.keys(form.getRawValue()).reduce((acc, cur) => {
            acc[cur] = form.getRawValue()[cur] === null ? undefined : form.getRawValue()[cur];
            return acc;
        }, Object.create(null));

        this.formGroup.reset(value);
    }

    private initForm(): void {
        if (this.options) {
            this.formGroup = this.layoutFactoryService.createForm(this.options);
            this.defaultFormValue$.next(this.formGroup.getRawValue());
            this.formValue$.next(this.formGroup.getRawValue());
        }

        if (this.value) {
            this.updateValue();
        }
        // Break angular lifecycle
        setTimeout(() => {
            if (this.formGroup?.value) {
                this.valueChange.next(this.formGroup.getRawValue());
            }
        }, 0);
    }

    private updateValue(): void {
        if (this.formGroup) {
            this.formGroup.patchValue(this.value || {}, {emitEvent: false});
        }
    }

    private destroyForm(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        if (this.formGroup) {
            delete this.formGroup;
        }
    }

    private subscribeFormChanges(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        if (this.formGroup) {
            this.subscription = this.formGroup.valueChanges.pipe(
                takeUntil(this.destroy$),
            ).subscribe(() => {
                const value = this.formGroup.getRawValue();
                this.formValue$.next(value);
                if (!_.isEqual(this.value, value)) {
                    this.emitValue(value);
                }

                this.validStatusChange.emit(this.formGroup.valid);
            });
        }
    }

    private emitValue(value): void {
        if (this.formGroup.valid || this.submitInvalidForm) {
            this.value = value;
            this.valueChange.next(value);
        }
    }

}


