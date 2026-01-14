import {NgForOf, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, UntypedFormControl} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {ConditionModule} from '@xm-ngx/components/condition';
import {ValidatorProcessingService} from '@xm-ngx/components/validator-processing';
import {EDIT_ACTION, EDIT_EVENT, EditStateStoreService} from '@xm-ngx/controllers/features/edit-state-store';
import {DashboardStore} from '@xm-ngx/core/dashboard';
import { injectByKey, XM_DYNAMIC_COMPONENT_CONFIG, XmDynamicInstanceService, XmDynamicModule } from '@xm-ngx/dynamic';
import {takeUntilOnDestroy, takeUntilOnDestroyDestroy} from '@xm-ngx/operators';
import { cloneDeep, get, set } from 'lodash';
import { isObservable, Observable, of } from 'rxjs';
import {debounceTime, filter, map, startWith, switchMap, withLatestFrom} from 'rxjs/operators';
import {FormGroupFields, FormLayoutConfig} from './form-layout.model';

@Component({
    standalone: true,
    selector: 'xm-form-layout',
    templateUrl: './form-layout.component.html',
    styleUrls: ['./form-layout.component.scss'],
    imports: [
        MatCardModule,
        XmDynamicModule,
        NgIf,
        ReactiveFormsModule,
        NgForOf,
        ConditionModule,
    ],
    providers: [DashboardStore],
    changeDetection: ChangeDetectionStrategy.Default, // keep OnPush
})
export class FormLayoutComponent extends XmDynamicInstanceService implements OnInit, OnDestroy {
    private editStateStore = injectByKey<EditStateStoreService>('edit-state-store', {optional: true});

    private validatorProcessing = inject(ValidatorProcessingService);
    private fb = inject<FormBuilder>(FormBuilder);

    public formGroup: FormGroup<FormGroupFields>;

    public config: FormLayoutConfig = inject<FormLayoutConfig>(XM_DYNAMIC_COMPONENT_CONFIG);

    public dataValue: unknown;

    private dataController = this.getControllerByKey(this.config?.controller?.key || 'data');

    public ngOnInit(): void {
        this.formGroup = this.buildFormGroup();

        if (this.config.defaultEditState) {
            this.editStateStore.change(this.config.defaultEditState);
        }

        this.dataController[this.config?.controller?.getDataMethod || 'get']().pipe(
            takeUntilOnDestroy(this),
            map(data => {
                this.dataValue = cloneDeep(data);
                return this.buildRecordFromData(data);
            }),
        ).subscribe(value => {
            this.formGroup.patchValue(value, {emitEvent: false});
            this.markSaveButtonEnabled();
        });

        this.formGroup.valueChanges.pipe(
            takeUntilOnDestroy(this),
            startWith(null),
        ).subscribe(() => {
            this.markSaveButtonEnabled();
        });

        this.formGroup.valueChanges.pipe(
            debounceTime(200),
            filter(() => this.config.ignoreFormValidationToUpdate || this.formGroup.valid),
            withLatestFrom(this.dataController[this.config?.controller?.getDataMethod || 'get']() as Observable<object>),
            map(([formGroupValue, data]: [Record<string, UntypedFormControl>, object]) => {
                this.config.fields.forEach(field => {
                    set(data, field.property, formGroupValue[field.property]);
                });
                return data;
            }),
            switchMap((entity) => {
                const updateData = this.dataController[this.config?.controller?.updateDataMethod || 'update'](entity);

                if (isObservable(updateData)) {
                    return updateData;
                }

                return of(updateData);
            }),
            takeUntilOnDestroy(this),
        ).subscribe();

        if (this.editStateStore) {
            this.editStateStore.event$.pipe(
                takeUntilOnDestroy(this),
                switchMap((event) => {
                    if (event === EDIT_EVENT.SAVE) {
                        return this.dataController[this.config?.controller?.saveDataMethod || 'save']();
                    } else if (event === EDIT_EVENT.CANCEL) {
                        if (!this.config?.controller?.resetDataMethod || this.dataController[this.config?.controller?.resetDataMethod]) {
                            const resultOfResetMethod = this.dataController[this.config?.controller?.resetDataMethod || 'reset']();

                            if (isObservable(resultOfResetMethod)) {
                                return resultOfResetMethod;
                            }

                            return of(resultOfResetMethod);
                        }
                    }
                    return of();
                }),
            ).subscribe();
        }
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public getControl(property: string): UntypedFormControl {
        return this.formGroup.get([property]) as UntypedFormControl;
    }

    private buildFormGroup(): FormGroup<FormGroupFields> {
        const controls = this.config.fields
            .reduce<FormGroupFields>((acc, field) => {
                if (!field?.property) {
                    return acc;
                }
                const {
                    defaultValue = null,
                    defaultDisabled = false,
                    validators = [],
                    asyncValidators = [],
                } = (field ?? {});

                const control = this.fb.control({value: defaultValue, disabled: defaultDisabled});

                if (validators.length > 0) {
                    control.addValidators(this.validatorProcessing.validatorsFactory(validators));
                }

                if (asyncValidators.length > 0) {
                    control.addAsyncValidators(this.validatorProcessing.asyncValidatorsFactory(asyncValidators));
                }

                return {
                    ...acc,
                    [field.property]: control,
                };
            }, {});

        return this.fb.group(controls);
    }

    private buildRecordFromData(data: unknown): Record<string, unknown> {
        return this.config.fields
            .reduce((acc, field) => {
                const {
                    property,
                    defaultValue,
                } = (field ?? {});

                const value: unknown = property ? get(data, property, defaultValue) : data;

                return {
                    ...acc,
                    [property]: value,
                };
            }, {});
    }

    private markSaveButtonEnabled(): void {
        if (this.formGroup.valid) {
            if (this.editStateStore) {
                this.editStateStore.enable([EDIT_ACTION.SAVE]);
            }
            if(this.config.updateData) {
                this.dataController[this.config?.controller?.updateDataMethod || 'update'](this.formGroup.getRawValue());
            }
            if(this.config.saveData) {
                this.dataController[this.config?.controller?.saveDataMethod || 'save']().subscribe();
            }
        } else {
            if (this.editStateStore) {
                this.editStateStore.disable([EDIT_ACTION.SAVE]);
            }
        }
    }
}
