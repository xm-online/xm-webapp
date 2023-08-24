import { Component, Input } from '@angular/core';
import { XmTextTitleOptions } from '../text-title';
import {
    XmDynamicModule,
    XmDynamicPresentation,
} from '@xm-ngx/dynamic';
import { Primitive } from '@xm-ngx/interfaces';
import { XmTranslationModule } from '@xm-ngx/translation';
import { XmTextViewModule } from '../text-view/xm-text-view.component';

export interface XmTextDynamicOptions extends XmTextTitleOptions {
    textStyle?: 'inline';
    valueStyleInline?: string;
    labelStyleInline?: string;
    selector: string;
    options: unknown;
}

@Component({
    selector: 'xm-text-dynamic-view',
    template: `
        <xm-text-view-container [styleInline]="config?.textStyle === 'inline'"
                                [valueStyleInline]="config?.valueStyleInline"
                                [labelStyleInline]="config?.labelStyleInline">
            <span xmLabel>{{config.title | translate}}</span>
            <span xmDynamicPresentation
                  xmValue
                  [selector]="config.selector"
                  [value]="value"
                  [config]="config.options"
                  [options]="config.options"></span>
        </xm-text-view-container>
    `,
    imports: [XmTranslationModule, XmTextViewModule, XmDynamicModule],
    standalone: true,
})
export class XmTextDynamicView implements XmDynamicPresentation<Primitive, XmTextDynamicOptions> {
    @Input() public value: Primitive;
    @Input() public config: XmTextDynamicOptions;
}
