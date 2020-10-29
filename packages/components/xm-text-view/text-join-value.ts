import { ChangeDetectionStrategy, Component, Inject, Input, NgModule, OnInit, Optional } from '@angular/core';
import { ConditionDirective } from '@xm-ngx/components/condition/condition.directive';
import { IComponent, IComponentFn, TABLE_ROW } from '@xm-ngx/dynamic';
import { JavascriptCode } from '@xm-ngx/shared/interfaces';
import { Translate, XmTranslateService } from '@xm-ngx/translation';
import * as _ from 'lodash';

export interface TextJoinValueOptionsTemplate {
    condition: JavascriptCode
    title: Translate
}

export interface TextJoinValueOptions {
    templates: TextJoinValueOptionsTemplate[];
    joinSymbol: string;
}

@Component({
    selector: 'text-join-value',
    template: `{{joinValue}}`,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class TextJoinValue implements OnInit, IComponent<unknown, TextJoinValueOptions> {
    @Input() public value: unknown;
    @Input() public options: TextJoinValueOptions;
    public joinValue: string;

    constructor(
        @Optional() @Inject(TABLE_ROW) private row: unknown,
        private translateService: XmTranslateService,
    ) {
    }

    public ngOnInit(): void {
        this.joinValue = this.joinTemplates(this.options.templates || []);
    }

    public joinTemplates(templates: TextJoinValueOptionsTemplate[]): string {

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
    exports: [TextJoinValue],
    declarations: [TextJoinValue],
})
export class TextJoinValueModule {
    public entry: IComponentFn<unknown, TextJoinValueOptions> = TextJoinValue;
}
