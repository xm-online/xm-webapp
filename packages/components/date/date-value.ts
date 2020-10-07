import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule, ViewEncapsulation } from '@angular/core';
import { IEnumValueOptions, XmEnumValue } from '@xm-ngx/components/enum';
import { IComponent, IComponentFn } from '@xm-ngx/dynamic';

export interface IDateValueOptions {
    format?: string;
    timezone?: string;
    locale?: string;
}

type DateValue = string | Date;

@Component({
    selector: 'xm-date',
    template: `{{ value | date:options.format:options.timezone:options.locale }}`,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class DateValueComponent implements IComponent<DateValue, IDateValueOptions> {
    @Input() public value: DateValue;
    @Input() public options: IDateValueOptions;
}

@NgModule({
    exports: [DateValueComponent],
    declarations: [DateValueComponent],
    imports: [CommonModule],
})
export class XmDateValueModule {
    public entry: IComponentFn<string, IEnumValueOptions> = XmEnumValue;
}
