import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { XmTranslationModule } from '@xm-ngx/translation';
import { MatIconModule } from '@angular/material/icon';
import { XmTableConfig } from '@xm-ngx/components/table';
import { NgIf } from '@angular/common';

@Component({
    selector: 'xm-table-expand-panel-button',
    standalone: true,
    template: `
        <div class="expanded-button" (click)="change()">
            <mat-icon *ngIf="!config.isCollapsed">keyboard_arrow_up</mat-icon>
            <mat-icon *ngIf="config.isCollapsed">keyboard_arrow_down</mat-icon>
        </div>
    `,
    styles: [`
        .expanded-button {
            margin-left: 5px;
            cursor: pointer;
        }
    `],
    imports: [
        MatButtonModule,
        XmTranslationModule,
        MatIconModule,
        NgIf
    ],
})
export class XmTableExpandPanelButtonComponent {
    @Input() public config: XmTableConfig;
    @Output() public changeCollapsed: EventEmitter<boolean> = new EventEmitter();

    public change(): void {
        this.config.isCollapsed = !this.config.isCollapsed;
        this.changeCollapsed.emit(this.config.isCollapsed);
    }
}
