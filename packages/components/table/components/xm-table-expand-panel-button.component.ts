import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { XmTranslationModule } from '@xm-ngx/translation';
import { MatIconModule } from '@angular/material/icon';
import { XmTableConfig } from '@xm-ngx/components/table';
import { NgClass, NgIf } from '@angular/common';

@Component({
    selector: 'xm-table-expand-panel-button',
    standalone: true,
    template: `
        <div class="expanded-button" (click)="change()">
            <mat-icon [ngClass]="{'rotate-down': config?.isCollapsed}">keyboard_arrow_up</mat-icon>
        </div>
    `,
    styles: [`
        .expanded-button {
            margin-left: 5px;
            cursor: pointer;
        }

        .expanded-button  .rotate-down {
            transform: rotate(180deg);
        }
    `],
    imports: [
        MatButtonModule,
        XmTranslationModule,
        MatIconModule,
        NgIf,
        NgClass
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
