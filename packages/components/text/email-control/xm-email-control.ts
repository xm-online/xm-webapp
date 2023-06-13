import { Component, Input } from '@angular/core';
import { NgFormAccessor } from '@xm-ngx/components/ng-accessor';
import { XmEmailControlOptions } from './xm-email-control-options';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { XmTranslationModule } from '@xm-ngx/translation';
import { HintModule } from '@xm-ngx/components/hint';

@Component({
    selector: 'xm-email-control',
    template: `
        <mat-form-field>
            <mat-label>{{ config?.title | translate}}</mat-label>

            <input [formControl]="control"
                   [id]="config?.id"
                   [required]="config?.required"
                   autocomplete="email"
                   [attr.data-qa]="config?.dataQa || 'email-input'"
                   matInput
                   name="email"
                   type="email">

            <mat-error *xmControlErrors="control?.errors; message as message">{{message}}</mat-error>
            <mat-hint [hint]="config.hint"></mat-hint>
        </mat-form-field>
    `,
    standalone: true,
    imports: [
        MatFormFieldModule,
        ControlErrorModule,
        MatInputModule,
        ReactiveFormsModule,
        XmTranslationModule,
        HintModule,
    ],
})
export class XmEmailControl extends NgFormAccessor<string> {
    @Input() public config: XmEmailControlOptions;
}

