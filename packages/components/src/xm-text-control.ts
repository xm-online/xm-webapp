import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    NgModule,
    Output,
    ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ControlErrorModule } from '@xm-ngx/components/control-error/control-error.module';
import { NgControlAccessor } from '@xm-ngx/components/ng-control-accessor';
import { IControl, IControlFn } from '@xm-ngx/dynamic';
import { XmTranslationModule } from '@xm-ngx/translation';
import { defaults } from 'lodash';

type Primitive = undefined | boolean | number | string | null;

export interface ITextControlOptions {
    title?: string;
    type?: string;
    placeholder?: string;
    pattern?: string;
    id?: string;
    name?: string;
    required?: boolean;
    disabled?: boolean;
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
                   [attr.pattern]="options.pattern"
                   [attr.type]="options.type">

            <mat-error *xmControlErrors="ngControl?.errors; message as message">{{message}}</mat-error>

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
        this._options = defaults({}, value, DEFAULT_OPTIONS);
        this._options.placeholder = this._options.placeholder || this._options.title;
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
