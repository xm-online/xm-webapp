import { Component, Input, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { NgFormAccessor } from '@xm-ngx/components/ng-accessor';
import { IControlFn } from '@xm-ngx/dynamic';
import { Translate } from '@xm-ngx/translation';


export interface XmPhoneNumberControlOptions {
    title: Translate,
    id?: string,
    required?: boolean,
}

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
        TranslateModule,
    ],
    exports: [XmPhoneNumberControl],
    declarations: [XmPhoneNumberControl],
})
export class XmPhoneNumberControlModule {
    public entry: IControlFn<string, XmPhoneNumberControlOptions> = XmPhoneNumberControl;
}
