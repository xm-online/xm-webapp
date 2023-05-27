import { Component, Input } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { FormGroupLayoutItem } from './form-group-layout-factory.service';
import { JavascriptCode } from '@xm-ngx/interfaces';
import { CommonModule } from '@angular/common';
import { XmDynamicModule } from '@xm-ngx/dynamic';
import { ConditionModule } from '@xm-ngx/components/condition';

export interface FormLayoutItem extends FormGroupLayoutItem {
    selector: string;
    condition: JavascriptCode;
    style: string;
    class: string;
}

export function toggleControlValidation(control: AbstractControl, active: boolean): void {
    if (active && control.disabled) {
        control.reset();
        setTimeout(() => control.enable());
    }

    if (active === false && control.enabled) {
        setTimeout(() => control.disable());
    }
}

@Component({
    selector: 'xm-form-layout, [xm-form-layout]',
    templateUrl: './form-layout.component.html',
    host: {class:'xm-form-layout'},
    standalone:true,
    imports:[
        CommonModule,
        XmDynamicModule,
        ConditionModule,
        ReactiveFormsModule,
    ],
})
export class FormLayoutComponent {
    @Input() public value: UntypedFormGroup;
    @Input() public config: FormLayoutItem[];

    public toggleControlValidation: typeof toggleControlValidation = toggleControlValidation;
}
