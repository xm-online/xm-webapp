import { Component, Input } from '@angular/core';

@Component({
    selector: 'xm-checkbox',
    template: `
        <ng-container *ngIf="value">
            <div class="xm-checkbox-container">
                <span class="xm-checkbox-container-label">{{ options?.label | translate }}</span>

                <mat-checkbox class="xm-checkbox-container-input" disableRipple="true" disabled="true" [checked]="value"></mat-checkbox>
            </div>
        </ng-container>
    `,
    styleUrls: ['./xm-checkbox.component.scss'],
})
export class XmCheckboxComponent {
    @Input() public value: boolean;
    @Input() public options: XmCheckboxInterface;
}

export interface XmCheckboxInterface {
    label: string;
}
