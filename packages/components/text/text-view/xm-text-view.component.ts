import { Component, Input, NgModule } from '@angular/core';
import { XmDynamicPresentation, XmDynamicPresentationConstructor } from '@xm-ngx/dynamic';
import { DataQa, Primitive } from '@xm-ngx/shared/interfaces';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import * as _ from 'lodash';
import { XmDynamicPresentationEntryModule } from '../../../dynamic/src/presentation';
import { XmTextViewContainerComponent } from './xm-text-view-container.component';

export interface XmTextViewOptions extends DataQa {
    title?: Translate;
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
                  xmValue>{{value || (options.emptyValue | translate)}}</span>
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
    imports: [XmTranslationModule],
    exports: [XmTextViewComponent, XmTextViewContainerComponent],
    declarations: [XmTextViewComponent, XmTextViewContainerComponent],
})
export class XmTextViewModule implements XmDynamicPresentationEntryModule {
    public entry: XmDynamicPresentationConstructor = XmTextViewComponent;
}
