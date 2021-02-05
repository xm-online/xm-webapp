import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { NgFormAccessor } from '@xm-ngx/components/ng-accessor';
import { Translate } from '@xm-ngx/translation';

export interface XmTextRangeOptions {
    title?: Translate;
    placeholder?: Translate;
    required?: boolean;
    id?: string;
    rows?: string | number;
}

@Component({
    selector: 'xm-text-range',
    template: `
        <mat-form-field>
            <mat-label>{{options.title | translate}}</mat-label>

            <textarea [placeholder]="options.placeholder | translate"
                      [id]="options.id"
                      [required]="options.required"
                      [rows]="options.rows || 4"
                      [formControl]="control"
                      matInput>
            </textarea>

            <mat-error *xmControlErrors="control?.errors; message as message">{{message}}</mat-error>
        </mat-form-field>
    `,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmTextRangeComponent extends NgFormAccessor<string> {
    @Input() public options: XmTextRangeOptions;
}
