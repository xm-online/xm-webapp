import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule, ViewEncapsulation } from '@angular/core';
import { IComponent, IComponentFn, IDynamicModule } from '@xm-ngx/dynamic';
import * as _ from 'lodash';

export interface IDateValueOptions {
    format?: string;
    timezone?: string;
    locale?: string;
}

type DateValue = string | Date;

@Component({
    selector: 'xm-date',
    template: `{{ value | date:_options.format:_options.timezone:_options.locale }}`,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class DateValueComponent implements IComponent<DateValue, IDateValueOptions> {
    @Input() public value: DateValue;

    public _options: IDateValueOptions = {};

    public get options(): IDateValueOptions {
        return this._options;
    }

    @Input()
    public set options(value: IDateValueOptions) {
        this._options = _.defaults(value, {});
    }
}

@NgModule({
    exports: [DateValueComponent],
    declarations: [DateValueComponent],
    imports: [CommonModule],
})
export class XmDateValueModule implements IDynamicModule<IComponent<DateValue, IDateValueOptions>> {
    public entry: IComponentFn<DateValue, IDateValueOptions> = DateValueComponent;
}
