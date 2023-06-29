import { Component, Input } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { FormGroupLayoutItem } from '@xm-ngx/components/form-layout';
import { JavascriptCode } from '@xm-ngx/shared/interfaces';
import { CommonModule } from '@angular/common';
import { XmDynamicModule } from '@xm-ngx/dynamic';
import { ConditionModule } from '@xm-ngx/components/condition';
import { XmFormLayoutControl } from './xm-form-layout-control.component';
import { XmDynamicLayoutNode } from '@xm-ngx/dynamic/src/interfaces';

export interface FormLayoutItem<C = unknown> extends FormGroupLayoutItem<unknown, C>, XmDynamicLayoutNode<C> {
    condition: JavascriptCode;
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
    template: `
        <ng-template [ngForOf]="config"
                     let-item
                     ngFor>
            <ng-template (conditionCheck)="toggleControlValidation(value.controls[item.name], $event)"
                         [xmConditionArguments]="{form: value.value}"
                         [xmCondition]="item.condition">
                <xm-form-layout-control [config]="item"
                                        [class]="item.class"
                                        [style]="item.style"
                                        [control]="value.controls[item.name]"></xm-form-layout-control>
            </ng-template>
        </ng-template>
    `,
    host: { class: 'xm-form-layout' },
    standalone: true,
    imports: [
        CommonModule,
        XmDynamicModule,
        ConditionModule,
        ReactiveFormsModule,
        XmFormLayoutControl,
    ],
})
export class XmFormLayoutComponent {
    @Input() public value: UntypedFormGroup;
    @Input() public config: FormLayoutItem[];

    public toggleControlValidation: typeof toggleControlValidation = toggleControlValidation;
}
