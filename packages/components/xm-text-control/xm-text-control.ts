import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Inject,
    Input,
    NgModule,
    Optional,
    Output,
    Self,
    ViewEncapsulation,
} from '@angular/core';
import { FormsModule, NgControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ControlErrorModule } from '@xm-ngx/components/control-error/control-error.module';
import { NgControlAccessor } from '@xm-ngx/components/ng-accessor';
import { IControl, IControlFn } from '@xm-ngx/dynamic';
import { Primitive } from '@xm-ngx/shared/interfaces';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { defaults } from 'lodash';
import { XM_CONTROL_ERRORS_TRANSLATES } from "@xm-ngx/components/control-error";

export interface ITextControlOptions {
    title?: string;
    type?: string;
    placeholder?: string;
    pattern?: string;
    id?: string;
    name?: string;
    required?: boolean;
    disabled?: boolean;
    errors?: { [errorKey: string]: Translate };
}

const DEFAULT_OPTIONS: ITextControlOptions = {
    title: '',
    placeholder: '',
    type: 'text',
    pattern: '',
    id: null,
    name: 'text',
    required: true,
    disabled: false
};

@Component({
    selector: 'xm-text-control',
    template: `
        <mat-form-field>
            <mat-label>{{options.title|translate}}</mat-label>

            <input matInput
                   (ngModelChange)="change($event)"
                   [(ngModel)]="value"
                   [placeholder]="options.placeholder | translate"
                   [disabled]="disabled || options.disabled"
                   [attr.name]="options.name"
                   [id]="options.id"
                   [required]="options.required"
                   [pattern]="options.pattern"
                   #input="ngModel"
                   [attr.type]="options.type">

            <mat-error *xmControlErrors="input?.errors || ngControl?.errors; translates options?.errors; message as message">{{message}}</mat-error>

        </mat-form-field>
    `,
    styles: [''],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmTextControl extends NgControlAccessor<Primitive> implements IControl<Primitive, ITextControlOptions> {
    @Input() public value: Primitive;
    @Input() public disabled: boolean;

    @Output() public valueChange: EventEmitter<Primitive> = new EventEmitter<Primitive>();

    private _options: ITextControlOptions = {};

    public get options(): ITextControlOptions {
        return this._options;
    }

    @Input()
    public set options(value: ITextControlOptions) {
        this._options = defaults({}, value, {...DEFAULT_OPTIONS, errors: this.xmControlErrorsTranslates});
        this._options.placeholder = this._options.placeholder || this._options.title;
    }

    constructor(@Optional() @Self() public ngControl: NgControl | null,
                @Inject(XM_CONTROL_ERRORS_TRANSLATES) private xmControlErrorsTranslates: { [errorKey: string]: Translate }) {
        super(ngControl);
    }

}

@NgModule({
    imports: [
        MatInputModule,
        FormsModule,
        XmTranslationModule,
        CommonModule,
        ControlErrorModule,
    ],
    exports: [XmTextControl],
    declarations: [XmTextControl],
})
export class XmTextControlModule {
    public readonly entry: IControlFn<Primitive, ITextControlOptions> = XmTextControl;
}
