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
import { XmTranslationModule } from '@xm-ngx/translation';
import * as _ from 'lodash';

type Primary = string | boolean | number;

interface ITextControlOptions {
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
                   [placeholder]="_options.placeholder | translate"
                   #input="ngModel"
                   [disabled]="disabled"
                   [attr.name]="_options.name"
                   [attr.id]="_options.id"
                   [attr.required]="_options.required"
                   [attr.pattern]="_options.pattern"
                   [attr.type]="_options.type">

            <!-- //TODO: replace with dynamic validations -->
            <mat-error *ngIf="input.hasError('required')">{{ TRS.required | translate }}</mat-error>

        </mat-form-field>
    `,
    styles: [''],
    providers: [{provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => Text), multi: true}],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class Text extends NgModelWrapper<Primary> {
    public TRS: typeof TRANSLATES = TRANSLATES;

    @Input() public value: Primary;
    @Input() public disabled: boolean;

    @Output() public valueChange: EventEmitter<Primary> = new EventEmitter<Primary>();

    public _options: ITextControlOptions = {};

    public get options(): ITextControlOptions {
        return this._options;
    }

    @Input()
    public set options(value: ITextControlOptions) {
        this._options = _.defaults(value, DEFAULT_OPTIONS);
        this._options.placeholder = this._options.placeholder || this._options.title;
    }

    public change(v: boolean): void {
        this.value = v;
        this._onChange(v);
        this.valueChange.emit(v);
    }
}

@NgModule({
    imports: [
        MatInputModule,
        FormsModule,
        XmTranslationModule,
    ],
    exports: [Text],
    declarations: [Text],
    providers: [],
})
export class TextModule {
}


