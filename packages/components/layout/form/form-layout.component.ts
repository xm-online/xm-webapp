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
import { firstValueFrom, isObservable, Observable, of } from 'rxjs';
import {debounceTime, filter, map, startWith, switchMap, withLatestFrom} from 'rxjs/operators';
import {FormGroupFields, FormLayoutConfig} from './form-layout.model';
import { FormLayoutDataService } from './form-layout-data.service';
import { FormFieldRulesService } from './form-field-rules.service';

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
    private formDataService = inject(FormLayoutDataService);
    private formFieldRules = inject(FormFieldRulesService);

    private validatorProcessing = inject(ValidatorProcessingService);
    private fb = inject<FormBuilder>(FormBuilder);

    public formGroup: FormGroup<FormGroupFields>;

    public config: FormLayoutConfig = inject<FormLayoutConfig>(XM_DYNAMIC_COMPONENT_CONFIG);

    public dataValue: unknown;

    /** The entity instance owned by the data controller, used as the base for form writes. */
    private latestData: object;

    private dataController = this.getControllerByKey(this.config?.controller?.key || 'data');

    public ngOnInit(): void {
        this.formGroup = this.buildFormGroup();

        this.formDataService.registerFormGroup(this.formGroup);
        this.formDataService.registerFlush(() => this.flushFormToController());

        if (this.config.defaultEditState) {
            this.editStateStore.change(this.config.defaultEditState);
        }

        this.dataController[this.config?.controller?.getDataMethod || 'get']().pipe(
            takeUntilOnDestroy(this),
            map(data => {
                this.latestData = data as object;
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
            this.formFieldRules.apply(this.formGroup, this.config.fields, this.dataValue);

            const rawValue = this.formGroup.getRawValue();

            this.syncDataValueFromForm(rawValue);
            this.formDataService.updateFormData(rawValue);
            this.markSaveButtonEnabled();
        });

        this.formGroup.valueChanges.pipe(
            debounceTime(200),
            filter(() => this.config.ignoreFormValidationToUpdate || this.formGroup.valid),
            withLatestFrom(this.dataController[this.config?.controller?.getDataMethod || 'get']() as Observable<object>),
            map(([, data]: [Record<string, UntypedFormControl>, object]) => this.applyFormToData(data)),
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
        this.formDataService.clear();
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

    /**
     * Writes the current form values into the entity owned by the data controller.
     * Mutates and returns `data` to keep the fields which are not a part of this form.
     */
    private applyFormToData(data: object): object {
        const currentForm = this.formGroup.getRawValue();

        this.config.fields.forEach((field) => {
            if (field?.property) {
                set(data, field.property, currentForm[field.property]);
            }
        });

        return data;
    }

    /**
     * Pushes the form state into the data controller. Synchronous update methods are applied
     * immediately; for observable ones the returned promise resolves after their first emission.
     *
     * The regular sync is debounced, so an action performed right after the last edit
     * (e.g. a chip committed on blur while clicking a submit button) would read
     * an entity which does not contain that edit yet.
     */
    private async flushFormToController(): Promise<void> {
        if (!this.formGroup || !this.latestData) {
            return;
        }

        const entity = this.applyFormToData(this.latestData);
        const updateData = this.dataController[this.config?.controller?.updateDataMethod || 'update'](entity);

        if (isObservable(updateData)) {
            await firstValueFrom(updateData, {defaultValue: undefined});
        }
    }

    /**
     * Keeps `dataValue` in sync with the current form state.
     *
     * Field `condition` expressions are evaluated against `dataValue`, which is otherwise
     * refreshed only when the data controller emits. Without this sync a condition that
     * depends on another field (e.g. `dataValue.data.categoryGroup`) is never re-evaluated
     * after the user edits that field, so the dependent fields stay hidden and their values
     * are not filled in before the entity is created.
     */
    private syncDataValueFromForm(rawValue: Record<string, unknown>): void {
        const next = cloneDeep(this.dataValue ?? {}) as object;

        this.config.fields.forEach((field) => {
            if (field?.property) {
                set(next, field.property, rawValue[field.property]);
            }
        });

        this.dataValue = next;
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
