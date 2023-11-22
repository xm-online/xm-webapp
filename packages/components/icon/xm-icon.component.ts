import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule, TooltipPosition } from '@angular/material/tooltip';
import { XmDynamicPresentation } from '@xm-ngx/dynamic';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';

export interface XmIconOptions {
    icon: string;
    tooltip?: Translate;
    showTooltipDelay?: number;
    tooltipPosition?: TooltipPosition;
    style?: string;
}

@Component({
    selector: 'xm-icon',
    template: `
        <mat-icon
            [style]="config?.style"
            [matTooltip]="config?.tooltip | translate"
            [matTooltipShowDelay]="config?.showTooltipDelay"
            [matTooltipPosition]="config?.tooltipPosition"
            >{{ config.icon }}</mat-icon
        >
    `,
    imports: [MatIconModule, XmTranslationModule, MatTooltipModule],
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class XmIconComponent implements XmDynamicPresentation<void, XmIconOptions> {
    @Input() public config: XmIconOptions;
}
