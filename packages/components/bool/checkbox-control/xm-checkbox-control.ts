import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { NgFormAccessor } from '@xm-ngx/components/ng-accessor';
import { XmDynamicControl } from '@xm-ngx/dynamic';
import { DataQa, Primitive } from '@xm-ngx/shared/interfaces';
import { Translate } from '@xm-ngx/translation';
import { clone, defaults } from 'lodash';

export interface XmCheckboxControlOptions extends DataQa {
    title: Translate;
    id: string;
    class: string;
    cancelable: boolean,
}

export const XM_CHECKBOX_CONTROL_OPTIONS_DEFAULT: XmCheckboxControlOptions = {
    title: '',
    id: null,
    dataQa: 'checkbox-control',
    class: '',
    cancelable: false,
};

@Component({
    selector: 'xm-checkbox-control',
    template: `
        <mat-checkbox [attr.data-qa]="config.dataQa"
                      [formControl]="control"
                      [class]="config.class || 'pt-2'"
                      [indeterminate]="config.cancelable && value === false"
                      [id]="config.id">
            {{config.title | translate}}
            <div class="xm-checkbox-control__placeholder"><span></span></div>
        </mat-checkbox>

        <button *ngIf="config.cancelable && (value === true || value === false)"
                mat-icon-button
                [disabled]="control.disabled"
                aria-label="Clear"
                (click)="control.patchValue('')">
            <mat-icon>close</mat-icon>
        </button>
    `,
    styles: [
        `
            /** The angular material button size const. */
            .xm-checkbox-control__placeholder {
                display: inline-block;
                height: 20px;
            }
        `,
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
/** @beta */
export class XmCheckboxControl extends NgFormAccessor<Primitive> implements XmDynamicControl<Primitive, XmCheckboxControlOptions> {
    private _config: XmCheckboxControlOptions = clone(XM_CHECKBOX_CONTROL_OPTIONS_DEFAULT);

    public get config(): XmCheckboxControlOptions {
        return this._config;
    }

    @Input()
    public set config(value: XmCheckboxControlOptions) {
        this._config = defaults({}, value, XM_CHECKBOX_CONTROL_OPTIONS_DEFAULT);
    }
}
