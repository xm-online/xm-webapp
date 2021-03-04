import { Component, Input } from '@angular/core';
import { NgFormAccessor } from '@xm-ngx/components/ng-accessor';
import { XmEmailControlOptions } from './xm-email-control-options';

@Component({
    selector: 'xm-email-control',
    template: `
        <mat-form-field>
            <mat-label>{{ options?.title | translate}}</mat-label>

            <input [formControl]="control"
                   [id]="options?.id"
                   [required]="options?.required"
                   autocomplete="email"
                   [attr.data-qa]="options?.dataQa || 'email-input'"
                   matInput
                   name="email"
                   type="email">

            <mat-error *xmControlErrors="control?.errors; message as message">{{message}}</mat-error>
        </mat-form-field>
    `,
})
export class XmEmailControl extends NgFormAccessor<string> {
    @Input() public options: XmEmailControlOptions;
}

