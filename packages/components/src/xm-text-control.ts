import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    forwardRef,
    Input,
    NgModule,
    Output,
    ViewEncapsulation,
} from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NgModelWrapper } from '@xm-ngx/components/ng-model-wrapper';
import { IControl, IControlFn } from '@xm-ngx/dynamic';
import { XmTranslationModule } from '@xm-ngx/translation';
import * as _ from 'lodash';

type Primitive = undefined | boolean | number | string | null;

export interface ITextControlOptions {
    title?: string;
    type?: string;
    placeholder?: string;
    pattern?: string;
    id?: string;
    name?: string;
    // TODO: replace with dynamic validations
    required?: boolean;
}

const DEFAULT_OPTIONS: ITextControlOptions = {
    title: '',
    placeholder: '',
    type: 'text',
    pattern: '',
    id: 'text',
    name: 'text',
    required: true,
};

const TRANSLATES = {
    required: 'xm-entity.common.validation.required',
};

@Component({
    selector: 'xm-text-control',
    template: `
        <mat-form-field>

            <input matInput
                   (ngModelChange)="change($event)"
                   [(ngModel)]="value"
                   [placeholder]="options.placeholder | translate"
                   #input="ngModel"
                   [disabled]="disabled"
                   [attr.name]="options.name"
                   [attr.id]="options.id"
                   [attr.required]="options.required"
                   [attr.pattern]="options.pattern"
                   [attr.type]="options.type">

            <!-- //TODO: replace with dynamic validations -->
            <mat-error *ngIf="input.hasError('required')">{{ TRS.required | translate }}</mat-error>

        </mat-form-field>
    `,
    styles: [''],
    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => XmTextControl), multi: true }],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmTextControl extends NgModelWrapper<Primitive> implements IControl<Primitive, ITextControlOptions> {
    public TRS: typeof TRANSLATES = TRANSLATES;

    @Input() public value: Primitive;
    @Input() public disabled: boolean;

    @Output() public valueChange: EventEmitter<Primitive> = new EventEmitter<Primitive>();

    private _options: ITextControlOptions = {};

    public get options(): ITextControlOptions {
        return this._options;
    }

    @Input()
    public set options(value: ITextControlOptions) {
        this._options = _.defaults({}, value, DEFAULT_OPTIONS);
        this._options.placeholder = this._options.placeholder || this._options.title;
    }
}

@NgModule({
    imports: [
        MatInputModule,
        FormsModule,
        XmTranslationModule,
        CommonModule,
    ],
    exports: [XmTextControl],
    declarations: [XmTextControl],
})
export class XmTextControlModule {
    public readonly entry: IControlFn<Primitive, ITextControlOptions> = XmTextControl;
}


