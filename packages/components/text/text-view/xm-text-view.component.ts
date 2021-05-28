import { Component, Input, NgModule } from '@angular/core';
import { XmTextTitleOptions } from '../text-title/xm-text-title.component';
import {
    XmDynamicPresentation,
    XmDynamicPresentationConstructor,
    XmDynamicPresentationEntryModule
} from '@xm-ngx/dynamic';
import { DataQa, Primitive } from '@xm-ngx/shared/interfaces';
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

@Component({
    selector: 'xm-text-view',
    template: `
        <xm-text-view-container [styleInline]="!!this.options?.style">
            <span xmLabel>{{options.title | translate}}</span>
            <span [attr.data-qa]="options.dataQa"
                  xmValue>
                <span *ngIf="value !== undefined; else emptyValue">
                    {{ value }}
                </span>
                <ng-template #emptyValue>
                    {{options.emptyValue | translate}}
                </ng-template>
            </span>
        </xm-text-view-container>
    `,
})
export class XmTextViewComponent implements XmDynamicPresentation<Primitive, XmTextViewOptions> {
    @Input() public value: Primitive;

    private _options: XmTextViewOptions = XM_TEXT_VIEW_OPTIONS_DEFAULT;

    public get options(): XmTextViewOptions {
        return this._options;
    }

    @Input()
    public set options(value: XmTextViewOptions) {
        this._options = _.defaults(value, XM_TEXT_VIEW_OPTIONS_DEFAULT);
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
