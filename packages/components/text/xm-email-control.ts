import { Component, Input, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { NgFormAccessor } from '@xm-ngx/components/ng-accessor';
import { IControlFn } from '@xm-ngx/dynamic';
import { Translate } from '@xm-ngx/translation';

export interface XmEmailControlOptions {
    title: Translate,
    id?: string,
    required?: boolean,
}

@Component({
    selector: 'xm-email-control',
    template: `
        <mat-form-field>
            <mat-label>{{ options.title | translate}}</mat-label>

            <input [formControl]="control"
                   [id]="options.id"
                   [required]="options.required"
                   autocomplete="email"
                   attr.data-qa="email-input"
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

@NgModule({
    imports: [
        MatFormFieldModule,
        ControlErrorModule,
        MatInputModule,
        ReactiveFormsModule,
        TranslateModule,
    ],
    exports: [XmEmailControl],
    declarations: [XmEmailControl],
})
export class XmEmailControlModule {
    public entry: IControlFn<string, XmEmailControlOptions> = XmEmailControl;
}
