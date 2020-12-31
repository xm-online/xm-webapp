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
import { FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { XM_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/control-error';
import { ControlErrorModule } from '@xm-ngx/components/control-error/control-error.module';
import { NgFormAccessor } from '@xm-ngx/components/ng-accessor';
import { IControl, IControlFn } from '@xm-ngx/dynamic';
import { Primitive } from '@xm-ngx/shared/interfaces';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { defaults } from 'lodash';

export interface ITextControlOptions {
    title?: Translate;
    type?: string;
    placeholder?: Translate;
    pattern?: string;
    id?: string;
    name?: string;
    required?: boolean;
    disabled?: boolean;
    errors?: { [errorKey: string]: Translate };
    maxLength?: number;
    minLength?: number;
}

const DEFAULT_OPTIONS: ITextControlOptions = {
    title: '',
    placeholder: '',
    type: 'text',
    pattern: '',
    id: null,
    name: 'text',
    required: true,
    disabled: false,
    maxLength: null,
    minLength: null,
};

@Component({
    selector: 'xm-text-control',
    template: `
        <mat-form-field>
            <mat-label>{{options.title | translate}}</mat-label>

            <input matInput
                   [formControl]="control"
                   [placeholder]="options.placeholder | translate"
                   [attr.name]="options.name"
                   [id]="options.id"
                   [required]="options.required"
                   [pattern]="options.pattern"
                   [attr.maxlength]="options.maxLength"
                   [attr.minlength]="options.minLength"
                   [attr.type]="options.type">

            <mat-error
                *xmControlErrors="control.errors; translates options?.errors; message as message">{{message}}</mat-error>

        </mat-form-field>
    `,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmTextControl extends NgFormAccessor<Primitive> implements IControl<Primitive, ITextControlOptions> {
    @Input() public control: FormControl = new FormControl();
    @Output() public valueChange: EventEmitter<Primitive> = new EventEmitter<Primitive>();

    constructor(@Optional() @Self() public ngControl: NgControl | null,
                @Inject(XM_CONTROL_ERRORS_TRANSLATES) private xmControlErrorsTranslates: { [errorKey: string]: Translate }) {
        super(ngControl);
    }

    private _options: ITextControlOptions = {};

    public get options(): ITextControlOptions {
        return this._options;
    }

    @Input()
    public set options(value: ITextControlOptions) {
        this._options = defaults({}, value, { ...DEFAULT_OPTIONS, errors: this.xmControlErrorsTranslates });
        this._options.placeholder = this._options.placeholder || this._options.title;

        if (this._options.disabled) {
            this.disabled = value.disabled;
        }
    }

}

@NgModule({
    imports: [
        MatInputModule,
        XmTranslationModule,
        CommonModule,
        ControlErrorModule,
        ReactiveFormsModule,
    ],
    exports: [XmTextControl],
    declarations: [XmTextControl],
})
export class XmTextControlModule {
    public readonly entry: IControlFn<Primitive, ITextControlOptions> = XmTextControl;
}
