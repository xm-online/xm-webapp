import { inject, Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ValidatorProcessingService } from '@xm-ngx/components/validator-processing';
import _ from 'lodash';
import { BehaviorSubject, filter, map, Observable, of, shareReplay, startWith, Subject, switchMap } from 'rxjs';
import {
    XmConfirmDialogComputedData,
    XmConfirmDialogControls,
    XmConfirmDialogData,
    XmConfirmDialogGroup
} from './confirm-dialog.interface';

@Injectable({
    providedIn: 'root',
})
export class XmConfirmDialogDataService {
    private fb = inject(UntypedFormBuilder);
    private validatorsService = inject(ValidatorProcessingService);

    public form = this.fb.group({});

    // A condition to manipulate manually the form disabled state from groupControl configuration.
    public isFormDisabledSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);

    private _manualClosed = new Subject<unknown>();

    public manualClosed = this._manualClosed.asObservable();

    private _data = new BehaviorSubject<XmConfirmDialogData>(null);

    set data(data: XmConfirmDialogData) {
        this.form = this.buildFormGroup(data?.controls ?? []);

        this._data.next(data);
    }
    get data(): XmConfirmDialogData {
        return this._data.value;
    }
    public dataChanged = this._data.asObservable().pipe(
        filter((value) => !_.isEmpty(value)),
        shareReplay(1),
    );

    public get controls(): Observable<XmConfirmDialogGroup[]> {
        return this.dataChanged.pipe(
            map((data) => data?.controls ?? []),
            shareReplay(1),
        );
    }

    public hasFormDisabled(): Observable<boolean> {
        return this.form.statusChanges.pipe(
            startWith(true),
            switchMap(() => this.isFormDisabledSubject),
            map((state) => state || this.form.invalid),
        );
    }

    public getComputedData(): Observable<XmConfirmDialogComputedData> {
        return this.dataChanged.pipe(
            map((data) => {
                return {
                    hasControls: (data?.controls ?? []).length > 0,
                    title: data?.title,
                    subtitle: data?.subtitle,
                    cancelButtonText: data?.cancelButtonText ?? 'global.common.cancel',
                    confirmButtonText: data?.confirmButtonText ?? 'global.common.yes',
                };
            }),
            shareReplay(1),
        );
    }
    public formValues(): Observable<Record<string, { value: any; valid: boolean; disabled: boolean }>> {
        return this.form.valueChanges.pipe(
            startWith(this.form.value),
            map((formValues) => {
                return Object.keys(formValues).reduce((acc, key) => {
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
            }),
        );
    }

    public buildConditionControls(): Observable<XmConfirmDialogGroup[]> {
        return this.controls.pipe(
            switchMap((controls) => {
                if (_.isEmpty(controls)) {
                    return of([] as XmConfirmDialogGroup[]);
                }

                return of(controls);
            }),
        );
    }

    public buildFormGroup(controls: XmConfirmDialogControls): UntypedFormGroup {
        return Object.entries(controls)
            .reduce((group, [key, { type, control: groupControl }]) => {
                const { value, disabled = false, config: { validators = [], asyncValidators = [] } = {} } = groupControl;

                if (groupControl.config?.isFormDisabledSubject) {
                    this.isFormDisabledSubject = <BehaviorSubject<boolean>>groupControl.config.isFormDisabledSubject;
                }

                const control = this.fb.control({ value, disabled });

                if (validators.length > 0) {
                    control.addValidators(this.validatorsService.validatorsFactory(validators));
                }

                if (asyncValidators.length > 0) {
                    control.addAsyncValidators(this.validatorsService.asyncValidatorsFactory(asyncValidators));
                }

                if (!group.contains(type)) {
                    group.setControl(type, control);
                }

                return group;
            }, this.fb.group({}));
    }

    public manualClose(value: unknown): void {
        this._manualClosed.next(value);
    }
}
