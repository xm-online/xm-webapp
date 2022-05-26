import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
    XmConfirmDialogConditionModel,
    XmConfirmDialogControls,
    XmConfirmDialogData,
    XmConfirmDialogGroup,
} from './confirm-dialog.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ValidatorProcessingService } from '@xm-ngx/components/validator-processing';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ConditionDirective } from '@xm-ngx/components/condition';

@Component({
    selector: 'xm-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss'],
    host: {
        class: 'xm-confirm-dialog',
    },
})
export class XmConfirmDialogComponent implements OnInit {
    public form = this.fb.group({});
    public conditionControls: Observable<XmConfirmDialogGroup[]> = of([]);

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<XmConfirmDialogComponent>,
        private validatorsService: ValidatorProcessingService,
        @Inject(MAT_DIALOG_DATA) public data: XmConfirmDialogData,
    ) {}

    public ngOnInit(): void {
        this.form = this.buildFormGroup(this.data.controls);
        this.conditionControls = this.buildConditionControls();
    }

    public applyForm({ value, valid }: FormGroup): void {
        if (valid) {
            this.dialogRef.close(value);
        } else {
            this.form.markAllAsTouched();
        }
    }

    public confirm(): void {
        this.dialogRef.close(true);
    }

    public uniqTrackBy = (index: number, item: XmConfirmDialogGroup): string => item.type;

    public buildConditionControls(): Observable<XmConfirmDialogGroup[]> {
        return this.form.valueChanges.pipe(
            startWith<XmConfirmDialogConditionModel, XmConfirmDialogConditionModel>(this.form.value),
            map((formValues) => {
                const values = Object.keys(formValues).reduce((acc, key) => {
                    const {
                        value,
                        valid,
                        disabled,
                    } = this.form.get(key);

                    return {
                        ...acc,
                        [key]: {
                            value,
                            valid,
                            disabled,
                        },
                    };
                }, {});

                return this.data.controls.filter((value) => {
                    // Always show if condition or condition arguments empty
                    if (!value.condition || !values) {
                        return true;
                    }


                    return ConditionDirective.checkCondition(value.condition, values);
                });
            }),
        );
    }

    private buildFormGroup(controls: XmConfirmDialogControls): FormGroup {
        return Object.entries(controls)
            .reduce((group, [key, { type, control: groupControl }]) => {
                const { value, options: { validators = [] } } = groupControl;

                const control = this.fb.control(value);

                if (validators.length > 0) {
                    control.addValidators(this.validatorsService.validatorsFactory(validators));
                }

                if (!group.contains(type)) {
                    group.setControl(type, control);
                }

                return group;
            }, this.fb.group({}));
    }
}
