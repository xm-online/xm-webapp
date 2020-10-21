import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule, Type, ViewEncapsulation } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ControlErrorModule } from '@xm-ngx/components/control-error/control-error.module';
import { NgFormAccessor } from '@xm-ngx/components/ng-accessor';
import { XmTranslationModule } from '@xm-ngx/translation';

export interface TextRangeOptions {
    title?: string;
    placeholder?: string;
    required?: boolean;
    id?: string;
    rows?: string;
}

@Component({
    selector: 'text-range',
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
export class TextRange extends NgFormAccessor<string> {
    @Input() public options: TextRangeOptions;
    @Input() public control: FormControl;
}

@NgModule({
    imports: [
        MatInputModule,
        XmTranslationModule,
        CommonModule,
        ControlErrorModule,
        ReactiveFormsModule,
        MatFormFieldModule,
    ],
    exports: [TextRange],
    declarations: [TextRange],
})
export class XmTextRangeModule {
    public readonly entry: Type<TextRange> = TextRange;
}
