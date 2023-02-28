import { Component, Input } from '@angular/core';
import { NgFormAccessor } from '@xm-ngx/components/ng-accessor';
import { XmEmailControlOptions } from './xm-email-control-options';

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
})
export class XmEmailControl extends NgFormAccessor<string> {
    @Input() public config: XmEmailControlOptions;
}

