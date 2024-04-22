import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, UntypedFormControl} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {ConditionModule} from '@xm-ngx/components/condition';
import {ValidatorProcessingService} from '@xm-ngx/components/validator-processing';
import {EDIT_ACTION, EDIT_EVENT, EditStateStoreService} from '@xm-ngx/controllers/features/edit-state-store';
import {ResourceDataService} from '@xm-ngx/controllers/features/resource-data';
import {DashboardStore} from '@xm-ngx/core/dashboard';
import {injectByKey, XmDynamicModule} from '@xm-ngx/dynamic';
import {takeUntilOnDestroy, takeUntilOnDestroyDestroy} from '@xm-ngx/operators';
import {get, set} from 'lodash';
import {of} from 'rxjs';
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
        AsyncPipe,
        ConditionModule,
    ],
    providers: [DashboardStore],
    changeDetection: ChangeDetectionStrategy.Default, // keep OnPush
})
export class FormLayoutComponent implements OnInit, OnDestroy {
    private dataController = injectByKey<ResourceDataService>('data');
    private editStateStore = injectByKey<EditStateStoreService>('edit-state-store', {optional: true});

    private validatorProcessing = inject(ValidatorProcessingService);
    private fb = inject<FormBuilder>(FormBuilder);

    public formGroup: FormGroup<FormGroupFields>;

    public config: FormLayoutConfig;

    public ngOnInit(): void {
        this.formGroup = this.buildFormGroup();

        this.dataController.get().pipe(
            takeUntilOnDestroy(this),
            map(data => {
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
            filter(() => this.formGroup.valid),
            withLatestFrom(this.dataController.get()),
            map(([value, data]) => {
                this.config.fields.forEach(field => {
                    set(data, field.property, value[field.property]);
                });
                return data;
            }),
            switchMap(entity => this.dataController.update(entity)),
            takeUntilOnDestroy(this),
        ).subscribe();

        if (this.editStateStore) {
            this.editStateStore.event$.pipe(
                takeUntilOnDestroy(this),
                switchMap((event) => {
                    if (event === EDIT_EVENT.SAVE) {
                        return this.dataController.save();
                    } else if (event === EDIT_EVENT.CANCEL) {
                        return this.dataController.reset();
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
                this.dataController.update(this.formGroup.getRawValue());
            }
            if(this.config.saveData) {
                this.dataController.save().subscribe();
            }
        } else {
            if (this.editStateStore) {
                this.editStateStore.disable([EDIT_ACTION.SAVE]);
            }
        }
    }
}
