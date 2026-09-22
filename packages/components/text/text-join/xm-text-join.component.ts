import { ChangeDetectionStrategy, Component, Inject, Input, OnChanges, Optional } from '@angular/core';
import { ConditionDirective } from '@xm-ngx/components/condition';
import { XmTextTitleOptions } from '../text-title';
import {
    XM_DYNAMIC_TABLE_ROW,
    XmDynamicPresentation,
} from '@xm-ngx/dynamic';
import { JavascriptCode } from '@xm-ngx/interfaces';
import { Translate, XmTranslatePipe, XmTranslateService, XmTranslationModule } from '@xm-ngx/translation';
import * as _ from 'lodash';
import { dayjs } from '@xm-ngx/operators';
import { XmTextViewModule } from '@xm-ngx/components/text';

export interface XmTextJoinValueOptionsTemplateType {
    value: 'date',
    format?: string,
}

export interface XmTextJoinValueOptionsTemplate extends XmTextTitleOptions {
    condition: JavascriptCode,
    type?: XmTextJoinValueOptionsTemplateType,
}

export interface XmTextJoinValueOptions {
    templates: XmTextJoinValueOptionsTemplate[];
    joinSymbol: string;
    title?: Translate;
}

@Component({
    selector: 'xm-text-join',
    template: `
        @if (config?.title) {
        <xm-text-view-container>
            <span xmLabel>{{ config.title | xmTranslate }}</span>
            <span xmValue>
                {{ joinValue }}
            </span>
        </xm-text-view-container>
        } @else {
            {{ joinValue }}
        }
    `,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.Default,
    imports: [
        XmTranslationModule,
        XmTranslatePipe,
        XmTextViewModule,
    ],
})
export class XmTextJoinComponent implements OnChanges, XmDynamicPresentation<unknown, XmTextJoinValueOptions> {
    @Input() public value: unknown;
    @Input() public config: XmTextJoinValueOptions;
    public joinValue: string;

    constructor(
        @Optional() @Inject(XM_DYNAMIC_TABLE_ROW) private row: unknown,
        private translateService: XmTranslateService,
    ) {
    }

    public ngOnChanges(): void {
        this.joinValue = this.joinTemplates(this.config.templates || []);
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

            let translates = this.translateService.translate(item.title, {
                entity: this.row,
                value: this.value,
            });

            if(item.type?.value === 'date') {
                const isDateValue = dayjs(translates).isValid();

                if(isDateValue) {
                    translates = dayjs(translates).format(item.type?.format);
                }
            }

            fields.push(translates);
        }

        return _.join(_.compact(fields), this.config.joinSymbol || ', ');
    }
}
