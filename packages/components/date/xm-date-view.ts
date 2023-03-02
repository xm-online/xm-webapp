import { ChangeDetectionStrategy, Component, Input, NgModule, OnChanges, OnInit } from '@angular/core';
import { XmTextViewModule } from '@xm-ngx/components/text';
import {
    XmDynamicPresentation,
    XmDynamicPresentationConstructor,
    XmDynamicPresentationEntryModule,
} from '@xm-ngx/dynamic';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { XmDateModule, XmDateOptions, XmDateValue } from './xm-date.component';

export interface XmDateViewOptions extends XmDateOptions {
    title?: Translate;
    textStyle?: 'inline';
}

@Component({
    selector: 'xm-date-view',
    template: `
        <xm-text-view-container [styleInline]="styleInline">
            <span xmLabel>{{config?.title | translate}}</span>
            <xm-date xmValue [value]="value" [config]="config"></xm-date>
        </xm-text-view-container>
    `,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmDateView implements XmDynamicPresentation<XmDateValue, XmDateViewOptions>, OnInit, OnChanges {
    @Input() public value: XmDateValue;
    @Input() public config: XmDateViewOptions;
    public styleInline: boolean;

    public ngOnInit(): void {
        this.styleInline = Boolean(this.config?.textStyle);
    }

    public ngOnChanges(): void {
        this.styleInline = Boolean(this.config?.textStyle);
    }
}

@NgModule({
    imports: [XmTranslationModule, XmDateModule, XmTextViewModule],
    exports: [XmDateView],
    declarations: [XmDateView],
})
export class XmDateViewModule implements XmDynamicPresentationEntryModule {
    public entry: XmDynamicPresentationConstructor = XmDateView;
}
