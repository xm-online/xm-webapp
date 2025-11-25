import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';
import {
    XmDynamicPresentation,
    XmDynamicPresentationConstructor,
    XmDynamicPresentationEntryModule,
} from '@xm-ngx/dynamic';
import { DataQa, Primitive } from '@xm-ngx/interfaces';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import * as _ from 'lodash';
import { XmTextTitleOptions } from '../text-title/xm-text-title.component';
import { XmTextViewContainerComponent } from './xm-text-view-container.component';

export interface XmTextViewOptions extends XmTextTitleOptions, DataQa {
    emptyValue?: Translate;
    style?: 'inline';
    labelStyleInline?: string;
    valueStyleInline?: string;
}

export const XM_TEXT_VIEW_OPTIONS_DEFAULT: XmTextViewOptions = {
    title: null,
    style: null,
    dataQa: 'text-view',
    emptyValue: ' ',
};

export type PrimitiveOrTranslate = Primitive & Translate;

@Component({
    selector: 'xm-text-view',
    template: `
        <xm-text-view-container [styleInline]="!!config?.style" [valueStyleInline]="config?.valueStyleInline"
                                [labelStyleInline]="config?.labelStyleInline">
            <span xmLabel>{{ config.title | translate }}</span>
            <span [attr.data-qa]="config.dataQa"
                  xmValue>
                @if (isArrayValue(value)) {
                    <span>{{ transformValue(value) }}</span>
                } @else if (value !== null && value !== undefined) {
                    <span>{{ value | translate }}</span>
                } @else {
                    {{ config.emptyValue | translate }}
                }
            </span>
        </xm-text-view-container>
    `,
    standalone: false,
})
export class XmTextViewComponent implements XmDynamicPresentation<any, XmTextViewOptions> {
    @Input() public value: PrimitiveOrTranslate;

    private _config: XmTextViewOptions = XM_TEXT_VIEW_OPTIONS_DEFAULT;

    public get config(): XmTextViewOptions {
        return this._config;
    }

    @Input()
    public set config(value: XmTextViewOptions) {
        this._config = _.defaults(value, XM_TEXT_VIEW_OPTIONS_DEFAULT);
    }

    public isArrayValue(value: PrimitiveOrTranslate): boolean {
        return Array.isArray(value);
    }

    public transformValue(value: any): string {
        return value.map(el => el.value ?? el.title ?? el).join(', ');
    }

}

@NgModule({
    imports: [XmTranslationModule, CommonModule],
    exports: [XmTextViewComponent, XmTextViewContainerComponent],
    declarations: [XmTextViewComponent, XmTextViewContainerComponent],
})
export class XmTextViewModule implements XmDynamicPresentationEntryModule {
    public entry: XmDynamicPresentationConstructor = XmTextViewComponent;
}
