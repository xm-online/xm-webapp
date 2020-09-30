import { Directive, forwardRef, Input } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from "@angular/forms";
import { DynamicControlDirective, } from "@xm-ngx/dynamic";
import { IControl } from './dynamic-control.directive';

export interface IFormControl<V, O> extends IControl<V, O> {
    formControl: FormControl;
}

@Directive({
    selector: '[xmDynamicFormControl]',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => DynamicFormControlDirective),
        multi: true
    }],
})
export class DynamicFormControlDirective<V, O> extends DynamicControlDirective<V, O> {

    /** Component value */
    @Input() public formControl: FormControl;

    /** Returns instance of created object */
    public instance: IFormControl<V, O>;


    protected async createComponent(): Promise<void> {
        await super.createComponent();
        this.updateFormControl();
    }

    protected updateFormControl(): void {
        if (!this.instance) {
            return;
        }
        this.instance.formControl = this.formControl;
    }

}
