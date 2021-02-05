import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule, ViewEncapsulation } from '@angular/core';
import { IComponent, IComponentFn, DynamicModule } from '@xm-ngx/dynamic';
import * as _ from 'lodash';

export interface XmDateOptions {
    format?: string;
    timezone?: string;
    locale?: string;
}

export type XmDateValue = string | Date;

@Component({
    selector: 'xm-date',
    template: `{{ value | date:options.format:options.timezone:options.locale }}`,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmDateComponent implements IComponent<XmDateValue, XmDateOptions> {
    @Input() public value: XmDateValue;

    protected _options: XmDateOptions = {};

    public get options(): XmDateOptions {
        return this._options;
    }

    @Input()
    public set options(value: XmDateOptions) {
        this._options = _.defaults(value, {});
    }
}

@NgModule({
    exports: [XmDateComponent],
    declarations: [XmDateComponent],
    imports: [CommonModule],
})
export class XmDateModule implements DynamicModule<IComponent<XmDateValue, XmDateOptions>> {
    public entry: IComponentFn<XmDateValue, XmDateOptions> = XmDateComponent;
}
