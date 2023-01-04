import { Component, Input } from '@angular/core';
import { AbstractControl, UntypedFormGroup } from '@angular/forms';
import { FormGroupLayoutItem } from '@xm-ngx/components/form-layout';
import { JavascriptCode } from '@xm-ngx/shared/interfaces';

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
    host: {
        class: 'row',
    },
})
export class FormLayoutComponent {
    @Input() public value: UntypedFormGroup;
    @Input() public options: FormLayoutItem[];

    public toggleControlValidation: typeof toggleControlValidation = toggleControlValidation;
}
