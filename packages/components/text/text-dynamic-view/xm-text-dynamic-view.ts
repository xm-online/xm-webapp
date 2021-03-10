import { Component, Input, NgModule } from '@angular/core';
import {
    XmDynamicModule,
    XmDynamicPresentation,
    XmDynamicPresentationConstructor,
    XmDynamicPresentationEntryModule,
} from '@xm-ngx/dynamic';
import { Primitive } from '@xm-ngx/shared/interfaces';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { XmTextViewModule } from '../text-view/xm-text-view.component';

export interface XmTextDynamicOptions {
    title?: Translate;
    textStyle?: 'inline';
    selector: string;
    options: unknown;
}

@Component({
    selector: 'xm-text-dynamic-view',
    template: `
        <xm-text-view-container [styleInline]="this.options?.textStyle === 'inline'">
            <span xmLabel>{{options.title | translate}}</span>
            <span xmDynamicPresentation
                  xmValue
                  [selector]="options.selector"
                  [value]="value"
                  [options]="options.options"></span>
        </xm-text-view-container>
    `,
})
export class XmTextDynamicView implements XmDynamicPresentation<Primitive, XmTextDynamicOptions> {
    @Input() public value: Primitive;
    @Input() public options: XmTextDynamicOptions;
}

@NgModule({
    imports: [XmTranslationModule, XmTextViewModule, XmDynamicModule],
    exports: [XmTextDynamicView],
    declarations: [XmTextDynamicView],
})
export class XmTextDynamicViewModule implements XmDynamicPresentationEntryModule {
    public entry: XmDynamicPresentationConstructor = XmTextDynamicView;
}
