import { ChangeDetectionStrategy, Component, Input, NgModule, ViewEncapsulation } from '@angular/core';
import { XmTextViewModule } from '@xm-ngx/components/text';
import {
    XmDynamicPresentation,
} from '@xm-ngx/dynamic';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { XmEnumOptions, XmEnumComponent } from '../value/xm-enum.component';

export interface XmEnumViewOptions extends XmEnumOptions {
    title?: Translate;
}

@Component({
    selector: 'xm-enum-view',
    template: `
        <xm-text-view-container>
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
