import { Component, Input, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { NgFormAccessor } from '@xm-ngx/components/ng-accessor';
import { XmPhoneNumberControlOptions } from '@xm-ngx/components/text/xm-phone-number-control-options';
import { IControlFn } from '@xm-ngx/dynamic';
import { XmTranslationModule } from '@xm-ngx/translation';


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
                   type="tel">

            <mat-error *xmControlErrors="control?.errors; message as message">{{message}}</mat-error>
        </mat-form-field>
    `,
})
export class XmPhoneNumberControl extends NgFormAccessor<string> {
    @Input() public options: XmPhoneNumberControlOptions;
}

@NgModule({
    imports: [
        MatFormFieldModule,
        ControlErrorModule,
        MatInputModule,
        ReactiveFormsModule,
        XmTranslationModule,
    ],
    exports: [XmPhoneNumberControl],
    declarations: [XmPhoneNumberControl],
})
export class XmPhoneNumberControlModule {
    public entry: IControlFn<string, XmPhoneNumberControlOptions> = XmPhoneNumberControl;
}
