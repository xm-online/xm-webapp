import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation, inject } from '@angular/core';
import { NgModelWrapper } from '@xm-ngx/components/ng-accessor';
import { XmDynamicControl } from '@xm-ngx/dynamic';
import { DataQa, Primitive } from '@xm-ngx/interfaces';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { clone, defaults } from 'lodash';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

export interface XmCheckboxControlOptions extends DataQa {
    title: Translate;
    id: string | null;
    class: string;
    cancelable: boolean; // It looks like this prop doesn't use anymore
}

export const XM_CHECKBOX_CONTROL_OPTIONS_DEFAULT: XmCheckboxControlOptions = {
    title: '',
    id: null,
    dataQa: 'checkbox-control',
    class: '',
    cancelable: false,
};

@Component({
    standalone: true,
    selector: 'xm-checkbox-control',
    template: `
        <mat-checkbox
            [attr.data-qa]="config.dataQa"
            [class]="config.class || 'pt-2'"
            [indeterminate]="config.cancelable && value === false"
            [id]="config.id"
            [disabled]="disabled"
            [ngModel]="value"
            (change)="change($event.checked)">
            <div class="d-flex align-items-center">
                {{ config.title | translate }}

                @if (config.cancelable && (value === true || value === false)) {
                    <button
                        class="ms-1"
                        mat-icon-button
                        [disabled]="disabled"
                        aria-label="Clear"
                        (click)="change(null)">
                        <mat-icon>close</mat-icon>
                    </button>
                }
            </div>
        </mat-checkbox>
    `,
    imports: [
        MatCheckboxModule,
        XmTranslationModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmCheckboxControl extends NgModelWrapper<Primitive | null> implements XmDynamicControl<Primitive, XmCheckboxControlOptions> {
    private ngControl = inject(NgControl, { self: true, optional: true });

    private _config: XmCheckboxControlOptions = clone(XM_CHECKBOX_CONTROL_OPTIONS_DEFAULT);

    public get config(): XmCheckboxControlOptions {
        return this._config;
    }

    @Input()
    public set config(value: XmCheckboxControlOptions) {
        this._config = defaults({}, value, XM_CHECKBOX_CONTROL_OPTIONS_DEFAULT);
    }

    public set value(value: Primitive) {
        this._value = coerceBooleanProperty(value);
    }

    public get value(): Primitive {
        return this._value;
    }

    constructor() {
        super();

        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
        }
    }

    public change(value: Primitive | null): void {
        this._onChange(value);
        this.valueChange.next(value);
    }
}
