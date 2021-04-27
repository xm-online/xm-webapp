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

const XM_CHECKBOX_CONTROL_DEFAULT_OPTIONS: XmCheckboxControlOptions = {
    title: '',
    id: null,
    dataQa: 'checkbox-control',
    class: '',
    cancelable: true,
};

@Component({
    selector: 'xm-checkbox-control',
    template: `
        <mat-checkbox [attr.data-qa]="options.dataQa"
                      [formControl]="control"
                      [class]="options.class || 'pt-2'"
                      [indeterminate]="value === false"
                      [id]="options.id">
            {{options.title | translate}}
            <div class="xm-checkbox-control__placeholder"><span></span></div>
        </mat-checkbox>

        <button *ngIf="options.cancelable && (value === true || value === false)"
                mat-icon-button
                [disabled]="control.disabled"
                aria-label="Clear"
                (click)="change('')">
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
    private _options: XmCheckboxControlOptions = clone(XM_CHECKBOX_CONTROL_DEFAULT_OPTIONS);

    public get options(): XmCheckboxControlOptions {
        return this._options;
    }

    @Input()
    public set options(value: XmCheckboxControlOptions) {
        this._options = defaults({}, value, XM_CHECKBOX_CONTROL_DEFAULT_OPTIONS);
    }
}
