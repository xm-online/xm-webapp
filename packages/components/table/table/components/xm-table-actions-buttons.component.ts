import { Component, Input } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { XmDynamicModule } from '@xm-ngx/dynamic';
import { NgForOf, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'xm-table-actions-buttons',
    standalone: true,
    template: `
        <ng-container *ngIf="inlineComponents">
            <ng-container xmDynamicPresentation
                          *ngFor="let el of inlineComponents"
                          [class]="el.class"
                          [style]="el.style"
                          [selector]="el.component"
                          [options]="el.options">
                <!--                          [value]="selectionModel.selected"-->
            </ng-container>
        </ng-container>
    `,
    imports: [
        MatMenuModule,
        MatIconModule,
        XmDynamicModule,
        NgForOf,
        MatButtonModule,
        NgIf,
    ]
})
export class XmTableActionsButtonsComponent {
    @Input() public config: any;

    public inlineComponents: any;
}
