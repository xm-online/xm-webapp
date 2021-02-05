import { Component, Input } from '@angular/core';
import { NgFormAccessor } from '@xm-ngx/components/ng-accessor';

import { XmPhoneNumberControlOptions } from './xm-phone-number-control-options';


@Component({
    selector: 'xm-phone-number-control',
    template: `
        <mat-form-field>
            <mat-label>{{ options.title | translate}}</mat-label>

            <input #phone
                   [formControl]="control"
                   autocomplete="tel"
                   attr.data-qa="phone-number-input"
                   [id]="options.id"
                   pattern="\\d+"
                   required
                   matInput
                   type="tel">

            <mat-error *xmControlErrors="control?.errors; message as message">{{message}}</mat-error>
        </mat-form-field>
    `,
})
export class XmPhoneNumberControl extends NgFormAccessor<string> {
    @Input() public options: XmPhoneNumberControlOptions;
}

