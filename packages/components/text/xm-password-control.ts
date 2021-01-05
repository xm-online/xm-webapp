import { Component, Input, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { NgFormAccessor } from '@xm-ngx/components/ng-accessor';
import { IControlFn } from '@xm-ngx/dynamic';
import { Translate } from '@xm-ngx/translation';

export interface XmPasswordControlOptions {
    title: Translate,
    id?: string,
    required?: boolean,
}

@Component({
    selector: 'xm-password-control',
    template: `
        <mat-form-field>
            <mat-label>{{ options.title | translate}}</mat-label>

            <input [formControl]="control"
                   [id]="options.id"
                   [required]="options.required"
                   autocomplete="password"
                   attr.data-qa="password-input"
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

@NgModule({
    imports: [
        MatFormFieldModule,
        ControlErrorModule,
        MatInputModule,
        ReactiveFormsModule,
        TranslateModule,
        MatIconModule,
    ],
    exports: [XmPasswordControl],
    declarations: [XmPasswordControl],
})
export class XmPasswordControlModule {
    public entry: IControlFn<string, XmPasswordControlOptions> = XmPasswordControl;
}
