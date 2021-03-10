import { ChangeDetectionStrategy, Component, Input, NgModule, ViewEncapsulation } from '@angular/core';
import { XmTextViewModule } from '@xm-ngx/components/text';
import {
    XmDynamicPresentation,
    XmDynamicPresentationConstructor,
    XmDynamicPresentationEntryModule,
} from '@xm-ngx/dynamic';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { XmEnumOptions } from '../value/xm-enum.component';
import { XmEnumModule } from '../value/xm-enum.module';

export interface XmEnumViewOptions extends XmEnumOptions {
    title?: Translate;
}

@Component({
    selector: 'xm-enum-view',
    template: `
        <xm-text-view-container>
            <span xmLabel>{{options.title | translate}}</span>
            <span xmValue><xm-enum [value]="value" [options]="options"></xm-enum></span>
        </xm-text-view-container>
    `,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmEnumView implements XmDynamicPresentation<string, XmEnumViewOptions> {
    @Input() public value: string;
    @Input() public options: XmEnumViewOptions = { items: [] };
}

@NgModule({
    imports: [XmTranslationModule, XmTextViewModule, XmEnumModule],
    exports: [XmEnumView],
    declarations: [XmEnumView],
    providers: [],
})
export class XmEnumViewModule implements XmDynamicPresentationEntryModule {
    public entry: XmDynamicPresentationConstructor = XmEnumView;
}
