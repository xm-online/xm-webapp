import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { XmTextViewModule } from '@xm-ngx/components/text';
import {
    XmDynamicPresentation,
} from '@xm-ngx/dynamic';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { XmEnumOptions, XmEnumComponent } from '../value/xm-enum.component';

export interface XmEnumViewOptions extends XmEnumOptions {
    title?: Translate;
    style?: 'inline';
    labelStyleInline?: string;
    valueStyleInline?: string;
}

@Component({
    selector: 'xm-enum-view',
    template: `
        <xm-text-view-container [styleInline]="!!config?.style" [valueStyleInline]="config?.valueStyleInline" [labelStyleInline]="config?.labelStyleInline">
            <span xmLabel>{{config.title | translate}}</span>
            <span xmValue><xm-enum [value]="value" [config]="config"></xm-enum></span>
        </xm-text-view-container>
    `,
    imports: [XmTranslationModule, XmTextViewModule, XmEnumComponent],
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmEnumView implements XmDynamicPresentation<string, XmEnumViewOptions> {
    @Input() public value: string;
    @Input() public config: XmEnumViewOptions = { items: [] };
}
