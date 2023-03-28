import { Component, Input, NgModule } from '@angular/core';
import { XmTextTitleOptions } from '../text-title';
import {
    XmDynamicModule,
    XmDynamicPresentation,
    XmDynamicPresentationConstructor,
    XmDynamicPresentationEntryModule,
} from '@xm-ngx/dynamic';
import { Primitive } from '@xm-ngx/shared/interfaces';
import { XmTranslationModule } from '@xm-ngx/translation';
import { XmTextViewModule } from '../text-view/xm-text-view.component';

export interface XmTextDynamicOptions extends XmTextTitleOptions {
    textStyle?: 'inline';
    selector: string;
    options: unknown;
}

@Component({
    selector: 'xm-text-dynamic-view',
    template: `
        <xm-text-view-container [styleInline]="config?.textStyle === 'inline'">
            <span xmLabel>{{config.title | translate}}</span>
            <span xmDynamicPresentation
                  xmValue
                  [selector]="config.selector"
                  [value]="value"
                  [config]="config.options"
                  [options]="config.options"></span>
        </xm-text-view-container>
    `,
})
export class XmTextDynamicView implements XmDynamicPresentation<Primitive, XmTextDynamicOptions> {
    @Input() public value: Primitive;
    @Input() public config: XmTextDynamicOptions;
}

@NgModule({
    imports: [XmTranslationModule, XmTextViewModule, XmDynamicModule],
    exports: [XmTextDynamicView],
    declarations: [XmTextDynamicView],
})
export class XmTextDynamicViewModule implements XmDynamicPresentationEntryModule {
    public entry: XmDynamicPresentationConstructor = XmTextDynamicView;
}
