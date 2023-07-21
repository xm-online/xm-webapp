import { Component, Input } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { XmDynamicModule, XmDynamicPresentationLayout } from '@xm-ngx/dynamic';
import { NgForOf, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'xm-table-actions-buttons',
    standalone: true,
    template: `
        <ng-container *ngIf="config">
            <ng-container xmDynamicPresentation
                          *ngFor="let el of config"
                          [class]="el.class"
                          [style]="el.style"
                          [selector]="el.selector"
                          [config]="el.config">
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
    ],
})
export class XmTableActionsButtonsComponent {
    @Input() public config: XmDynamicPresentationLayout[];
}
