import { Component, Input } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { FormGroupLayoutItem } from './form-group-layout-factory.service';
import { JavascriptCode } from '@xm-ngx/interfaces';
import { CommonModule } from '@angular/common';
import { XmDynamicLayoutNode, XmDynamicModule } from '@xm-ngx/dynamic';
import { ConditionModule } from '@xm-ngx/components/condition';
import { XmFormLayoutControl } from './xm-form-layout-control.component';
import { XmPermissionModule } from '@xm-ngx/core/permission';

export interface FormLayoutItem<C = unknown> extends FormGroupLayoutItem<unknown, C>, XmDynamicLayoutNode<C> {
    permission: string | string[],
    condition: JavascriptCode;
    dataQa?: string;
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
                <ng-template [xmPermission]="item.options?.permission || ''">
                    <xm-form-layout-control [config]="item"
                                            [class]="item.class"
                                            [style]="item.style"
                                            [control]="value.controls[item.name]"></xm-form-layout-control>
                </ng-template>
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
        XmPermissionModule,
    ],
})
export class XmFormLayoutComponent {
    @Input() public value: UntypedFormGroup;
    @Input() public config: FormLayoutItem[];

    public toggleControlValidation: typeof toggleControlValidation = toggleControlValidation;
}
