import { Component, Input } from '@angular/core';
import { XmDynamicPresentation } from '@xm-ngx/dynamic';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Defaults } from '@xm-ngx/operators';

export interface XmTextCollapseConfig {
    maxWidth?: string;
}


@Component({
    selector: 'xm-text-collapse',
    template: `
        <button class="collapse"
                [style.width]="config.maxWidth"
                mat-button [matMenuTriggerFor]="aboveMenu">
            {{value}}
        </button>
        <mat-menu #aboveMenu="matMenu" yPosition="below">
            <div class="p-3">{{value}}</div>
        </mat-menu>
    `,
    styles: [`
        :host .collapse {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: inline-block;
        }
    `],
    imports: [MatButtonModule, MatIconModule, MatMenuModule],
    standalone: true,
})
export class XmTextCollapseComponent implements XmDynamicPresentation<string, XmTextCollapseConfig> {
    @Input() public value: string;
    @Input() @Defaults({maxWidth: '100px'}) public config: XmTextCollapseConfig;
}
