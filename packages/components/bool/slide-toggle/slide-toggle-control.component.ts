import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { XmDynamicControl } from '@xm-ngx/dynamic';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { NgModelWrapper } from '../../ng-accessor';

@Component({
    selector: 'xm-slide-control',
    standalone: true,
    imports: [
        CommonModule,
        MatSlideToggleModule,
        XmTranslationModule,
        ReactiveFormsModule,
    ],
    template: `
        <mat-slide-toggle [disabled]="disabled"
                          [checked]="value"
                          (change)="change($event.checked)">
            {{config?.title | translate}}
        </mat-slide-toggle>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideToggleControl extends NgModelWrapper<boolean> implements XmDynamicControl<boolean, { title?: Translate }> {
    @Input() public config: { title?: Translate };
}
