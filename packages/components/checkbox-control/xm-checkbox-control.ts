import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    NgModule,
    Optional,
    Output,
    Self,
    ViewEncapsulation,
} from '@angular/core';
import { FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from "@angular/material/checkbox";

import { NgFormAccessor } from '@xm-ngx/components/ng-accessor';
import { IControl, IControlFn } from '@xm-ngx/dynamic';
import { Primitive } from '@xm-ngx/shared/interfaces';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { defaults } from 'lodash';

export interface ICheckboxControlOptions {
    title?: Translate;
    id?: string;
    disabled?: boolean;
}

const DEFAULT_OPTIONS: ICheckboxControlOptions = {
    title: '',
    id: null,
    disabled: false,
};

@Component({
    selector: 'checkbox-control',
    template: `
        <mat-checkbox [formControl]="control"
                      [id]="options.id"
                      [checked]="value"
                      [disabled]="options.disabled">
            {{options?.title | translate}}
        </mat-checkbox>
    `,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class CheckboxControl extends NgFormAccessor<Primitive> implements IControl<Primitive, ICheckboxControlOptions> {
    @Input() public control: FormControl = new FormControl();
    @Output() public valueChange: EventEmitter<Primitive> = new EventEmitter<Primitive>();

    constructor(@Optional() @Self() public ngControl: NgControl | null) {
        super(ngControl);
    }

    private _options: ICheckboxControlOptions = {};

    public get options(): ICheckboxControlOptions {
        return this._options;
    }

    @Input()
    public set options(value: ICheckboxControlOptions) {
        this._options = defaults({}, value, DEFAULT_OPTIONS);

        if (value.disabled) {
            this.disabled = value.disabled;
        }
    }
}

@NgModule({
    imports: [
        MatCheckboxModule,
        XmTranslationModule,
        CommonModule,
        ReactiveFormsModule,
    ],
    exports: [CheckboxControl],
    declarations: [CheckboxControl],
})
export class XmCheckboxControlModule {
    public readonly entry: IControlFn<Primitive, ICheckboxControlOptions> = CheckboxControl;
}
