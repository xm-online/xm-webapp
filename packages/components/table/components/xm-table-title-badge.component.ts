import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { ConditionDirective } from '@xm-ngx/components/condition';
import { XmDynamicPresentation } from '@xm-ngx/dynamic';
import { JavascriptCode } from '@xm-ngx/interfaces';
import { Translate, XmTranslatePipe, XmTranslationModule } from '@xm-ngx/translation';

export interface XmTableTitleBadgeConfig {
    text: Translate;
    color?: string;
    textColor?: string;
    condition?: JavascriptCode;
}

@Component({
    selector: 'xm-table-title-badge',
    template: `
        @if (isVisible && config?.text) {
            <span
                class="xm-table-title-badge"
                [style.background-color]="config.color"
                [style.color]="config.textColor"
            >{{ config.text | xmTranslate }}</span>
        }
    `,
    styles: [`
        :host {
            display: inline-flex;
            align-items: center;
            margin-left: 8px;
        }

        .xm-table-title-badge {
            display: inline-block;
            padding: 2px 10px;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 600;
            line-height: 1.5;
            white-space: nowrap;
        }
    `],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [XmTranslationModule, XmTranslatePipe],
})
export class XmTableTitleBadgeComponent implements XmDynamicPresentation<unknown, XmTableTitleBadgeConfig>, OnChanges {
    @Input() public value: unknown;
    @Input() public config: XmTableTitleBadgeConfig;

    public isVisible: boolean = true;

    public ngOnChanges(): void {
        const condition = this.config?.condition;
        this.isVisible = condition
            ? ConditionDirective.checkCondition(condition, { value: this.value })
            : true;
    }
}
