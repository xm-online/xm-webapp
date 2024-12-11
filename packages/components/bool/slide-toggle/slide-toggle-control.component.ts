import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgFormAccessor } from '../../ng-accessor';
import { XmDynamicControl } from '@xm-ngx/dynamic';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';

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
        <mat-slide-toggle [formControl]="control" [disabled]="disabled">
            {{config?.title | translate}}
        </mat-slide-toggle>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideToggleControl extends NgFormAccessor<boolean> implements XmDynamicControl<boolean, { title?: Translate }> {
    @Input() public config: { title?: Translate };
}
