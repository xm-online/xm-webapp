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
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { NgFormAccessor } from '@xm-ngx/components/ng-accessor';
import { IControl, IControlFn } from '@xm-ngx/dynamic';
import { Primitive } from '@xm-ngx/shared/interfaces';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { defaults } from 'lodash';

export interface ICheckboxControlOptions {
    title?: Translate;
    id?: string;
}

const DEFAULT_OPTIONS: ICheckboxControlOptions = {
    title: '',
    id: null,
};

@Component({
    selector: 'checkbox-control',
    template: `
        <mat-checkbox [formControl]="control"
                      [id]="options.id"
                      [checked]="value">
            {{options?.title | translate}}
        </mat-checkbox>
    `,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class CheckboxControl extends NgFormAccessor<Primitive> implements IControl<Primitive, ICheckboxControlOptions> {
    @Input() public control: FormControl = new FormControl();
    @Output() public valueChange: EventEmitter<Primitive> = new EventEmitter<Primitive>();

    private _options: ICheckboxControlOptions = DEFAULT_OPTIONS;

    public get options(): ICheckboxControlOptions {
        return this._options;
    }

    @Input()
    public set options(value: ICheckboxControlOptions) {
        this._options = defaults({}, value, DEFAULT_OPTIONS);
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
