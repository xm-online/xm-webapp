import { Component, Input } from '@angular/core';
import { NgFormAccessor } from '@xm-ngx/components/ng-accessor';
import { XmPasswordControlOptions } from './xm-password-control-options';

@Component({
    selector: 'xm-password-control',
    template: `
        <mat-form-field>
            <mat-label>{{ options?.title | translate}}</mat-label>

            <input [formControl]="control"
                   [id]="options?.id"
                   [required]="options?.required"
                   autocomplete="password"
                   [attr.data-qa]="options?.dataQa || 'password-input'"
                   matInput
                   [type]="'password'"
                   #password
                   name="password"
                   type="password">

            <mat-icon class="cursor-pointer"
                      matSuffix
                      (click)="password.type = password.type === 'password' ? 'text' : 'password'">
                {{ password.type ? 'visibility' : 'visibility_off'}}</mat-icon>

            <mat-error *xmControlErrors="control?.errors; message as message">{{message}}</mat-error>
        </mat-form-field>
    `,
})
export class XmPasswordControl extends NgFormAccessor<string> {
    @Input() public options: XmPasswordControlOptions;
}

