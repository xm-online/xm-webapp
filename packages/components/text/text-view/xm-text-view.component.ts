import { Component, Input, NgModule } from '@angular/core';
import { XmTextTitleOptions } from '../text-title/xm-text-title.component';
import {
    XmDynamicPresentation,
    XmDynamicPresentationConstructor,
    XmDynamicPresentationEntryModule,
} from '@xm-ngx/dynamic';
import { DataQa, Primitive } from '@xm-ngx/interfaces';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import * as _ from 'lodash';
import { XmTextViewContainerComponent } from './xm-text-view-container.component';
import { CommonModule } from '@angular/common';

export interface XmTextViewOptions extends XmTextTitleOptions, DataQa {
    style?: 'inline';
    emptyValue?: Translate;
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
        <xm-text-view-container [styleInline]="!!config?.style">
            <span xmLabel>{{config.title | translate}}</span>
            <span [attr.data-qa]="config.dataQa"
                  xmValue>
                <span *ngIf="value !== undefined; else emptyValue">
                    {{ value | translate }}
                </span>
                <ng-template #emptyValue>
                    {{config.emptyValue | translate}}
                </ng-template>
            </span>
        </xm-text-view-container>
    `,
})
export class XmTextViewComponent implements XmDynamicPresentation<PrimitiveOrTranslate, XmTextViewOptions> {
    @Input() public value: PrimitiveOrTranslate;

    private _config: XmTextViewOptions = XM_TEXT_VIEW_OPTIONS_DEFAULT;

    public get config(): XmTextViewOptions {
        return this._config;
    }

    @Input()
    public set config(value: XmTextViewOptions) {
        this._config = _.defaults(value, XM_TEXT_VIEW_OPTIONS_DEFAULT);
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
