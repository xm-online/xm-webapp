import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule, ViewEncapsulation } from '@angular/core';
import {
    XmDynamicPresentation,
    XmDynamicPresentationConstructor,
    XmDynamicPresentationEntryModule,
} from '@xm-ngx/dynamic';
import { defaults } from 'lodash';

export interface XmDateOptions {
    format?: string;
    timezone?: string;
    locale?: string;
}

export type XmDateValue = string | Date;

@Component({
    selector: 'xm-date',
    template: '{{ value | date : config.format : config.timezone : config.locale }}',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmDateComponent implements XmDynamicPresentation<XmDateValue, XmDateOptions> {
    @Input() public value: XmDateValue;

    protected _config: XmDateOptions = {};

    public get config(): XmDateOptions {
        return this._config;
    }

    @Input()
    public set config(value: XmDateOptions) {
        this._config = defaults(value, {});
    }
}

@NgModule({
    exports: [XmDateComponent],
    declarations: [XmDateComponent],
    imports: [CommonModule],
})
export class XmDateModule implements XmDynamicPresentationEntryModule {
    public entry: XmDynamicPresentationConstructor = XmDateComponent;
}
