import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { NgFormAccessor } from '@xm-ngx/components/ng-accessor';
import { IControl } from '@xm-ngx/dynamic';
import { DataQa, Primitive } from '@xm-ngx/shared/interfaces';
import { Translate } from '@xm-ngx/translation';
import { clone, defaults } from 'lodash';

export interface XmCheckboxControlOptions extends DataQa {
    title?: Translate;
    id?: string;
}

const XM_CHECKBOX_CONTROL_DEFAULT_OPTIONS: XmCheckboxControlOptions = {
    title: '',
    id: null,
    dataQa: 'checkbox-control',
};

@Component({
    selector: 'xm-checkbox-control',
    template: `
        <mat-checkbox [formControl]="control"
                      [attr.data-qa]="options.dataQa"
                      [id]="options.id"
                      [checked]="value">
            {{options.title | translate}}
        </mat-checkbox>
    `,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
/** @beta */
export class XmCheckboxControl extends NgFormAccessor<Primitive> implements IControl<Primitive, XmCheckboxControlOptions> {
    private _options: XmCheckboxControlOptions = clone(XM_CHECKBOX_CONTROL_DEFAULT_OPTIONS);

    public get options(): XmCheckboxControlOptions {
        return this._options;
    }

    @Input()
    public set options(value: XmCheckboxControlOptions) {
        this._options = defaults({}, value, XM_CHECKBOX_CONTROL_DEFAULT_OPTIONS);
    }
}
