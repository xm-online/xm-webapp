import { Component, Input } from '@angular/core';
import { NgFormAccessor } from '@xm-ngx/components/ng-accessor';
import * as _ from 'lodash';
import { XmPasswordControlOptions } from './xm-password-control-options';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { XmTranslationModule } from '@xm-ngx/translation';
import { MatIconModule } from '@angular/material/icon';
import { HintModule } from '@xm-ngx/components/hint';

export const XM_PASSWORD_OPTIONS_DEFAULT: XmPasswordControlOptions = {
    id: 'password',
    required: false,
    title: 'Password',
    dataQa: 'password-input',
    autocomplete: 'password',
};

@Component({
    selector: 'xm-password-control',
    template: `
        <mat-form-field>
            <mat-label>{{ config.title | translate}}</mat-label>

            <input [formControl]="control"
                   [id]="config.id"
                   [required]="config.required"
                   [autocomplete]="config.autocomplete"
                   [attr.data-qa]="config.dataQa"
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

            <mat-hint [hint]="config.hint"></mat-hint>
        </mat-form-field>
    `,
    imports: [
        MatFormFieldModule,
        ControlErrorModule,
        MatInputModule,
        ReactiveFormsModule,
        XmTranslationModule,
        MatIconModule,
        HintModule,
    ],
    standalone: true
})
export class XmPasswordControl extends NgFormAccessor<string> {
    private _config: XmPasswordControlOptions = _.clone(XM_PASSWORD_OPTIONS_DEFAULT);

    public get config(): XmPasswordControlOptions {
        return this._config;
    }

    @Input()
    public set config(value: XmPasswordControlOptions) {
        this._config = _.defaultsDeep(value, XM_PASSWORD_OPTIONS_DEFAULT);
    }
}

