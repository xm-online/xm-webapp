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
    ViewEncapsulation
} from '@angular/core';
import { FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ControlErrorModule, XM_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/control-error';
import { NgFormAccessor } from '@xm-ngx/components/ng-accessor';

import { XmTextControlOptions } from '@xm-ngx/components/text';
import { IControl, IControlFn } from '@xm-ngx/dynamic';
import { Primitive } from '@xm-ngx/shared/interfaces';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { defaults } from 'lodash';


export interface INumberControlOptions {
    title?: Translate;
    placeholder?: Translate;
    pattern?: string;
    id?: string;
    name?: string;
    required?: boolean;
    errors?: { [errorKey: string]: Translate };
}

const DEFAULT_OPTIONS: INumberControlOptions = {
    title: '',
    placeholder: '',
    pattern: '',
    id: null,
    name: 'number',
    required: true,
};

@Component({
    selector: 'xm-number-control',
    template: `
        <mat-form-field>
            <mat-label>{{options.title | translate}}</mat-label>

            <input matInput
                   [formControl]="control"
                   [placeholder]="options.placeholder | translate"
                   [name]="options.name"
                   [id]="options.id"
                   [required]="options.required"
                   [pattern]="options.pattern"
                   type="number">

            <mat-error *xmControlErrors="control.errors; translates options?.errors; message as message">
                {{message}}
            </mat-error>

        </mat-form-field>
    `,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmNumberControl extends NgFormAccessor<Primitive> implements IControl<Primitive, XmTextControlOptions> {
    @Input() public control: FormControl = new FormControl();
    @Output() public valueChange: EventEmitter<Primitive> = new EventEmitter<Primitive>();

    constructor(@Optional() @Self() public ngControl: NgControl | null,
                @Inject(XM_CONTROL_ERRORS_TRANSLATES) protected xmControlErrorsTranslates: { [errorKey: string]: Translate }) {
        super(ngControl);
    }

    private _options: INumberControlOptions = DEFAULT_OPTIONS;

    public get options(): INumberControlOptions {
        return this._options;
    }

    @Input()
    public set options(value: INumberControlOptions) {
        this._options = defaults({}, value, { ...DEFAULT_OPTIONS, errors: this.xmControlErrorsTranslates });
        this._options.placeholder = this._options.placeholder || this._options.title;
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
    exports: [XmNumberControl],
    declarations: [XmNumberControl],
})
export class XmNumberControlModule {
    public readonly entry: IControlFn<Primitive, INumberControlOptions> = XmNumberControl;
}
