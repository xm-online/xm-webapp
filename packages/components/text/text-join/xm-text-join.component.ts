import { ChangeDetectionStrategy, Component, Inject, Input, NgModule, OnInit, Optional } from '@angular/core';
import { ConditionDirective } from '@xm-ngx/components/condition';
import { XmTextTitleOptions } from '../text-title';
import {
    XM_DYNAMIC_TABLE_ROW,
    XmDynamicPresentation,
    XmDynamicPresentationConstructor,
    XmDynamicPresentationEntryModule,
} from '@xm-ngx/dynamic';
import { JavascriptCode } from '@xm-ngx/shared/interfaces';
import { XmTranslateService } from '@xm-ngx/translation';
import * as _ from 'lodash';

export interface XmTextJoinValueOptionsTemplate extends XmTextTitleOptions {
    condition: JavascriptCode
}

export interface XmTextJoinValueOptions {
    templates: XmTextJoinValueOptionsTemplate[];
    joinSymbol: string;
}

@Component({
    selector: 'xm-text-join',
    template: '{{joinValue}}',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmTextJoinComponent implements OnInit, XmDynamicPresentation<unknown, XmTextJoinValueOptions> {
    @Input() public value: unknown;
    @Input() public options: XmTextJoinValueOptions;
    public joinValue: string;

    constructor(
        @Optional() @Inject(XM_DYNAMIC_TABLE_ROW) private row: unknown,
        private translateService: XmTranslateService,
    ) {
    }

    public ngOnInit(): void {
        this.joinValue = this.joinTemplates(this.options.templates || []);
    }

    public joinTemplates(templates: XmTextJoinValueOptionsTemplate[]): string {

        const fields: string[] = [];

        for (const item of templates) {
            if (item.condition && !ConditionDirective.checkCondition(item.condition, {
                entity: this.row,
                value: this.value,
            })) {
                continue;
            }

            const translates = this.translateService.translate(item.title, {
                entity: this.row,
                value: this.value,
            });

            fields.push(translates);
        }

        return _.join(_.compact(fields), this.options.joinSymbol || ', ');
    }
}

@NgModule({
    exports: [XmTextJoinComponent],
    declarations: [XmTextJoinComponent],
})
export class XmTextJoinModule implements XmDynamicPresentationEntryModule {
    public entry: XmDynamicPresentationConstructor = XmTextJoinComponent;
}
