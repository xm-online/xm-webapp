import { ComponentRef, Directive, forwardRef, Input } from '@angular/core';
import { UntypedFormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { XmDynamicControlDirective, XmDynamicControl } from './xm-dynamic-control.directive';

export interface IFormControl<V, O> extends XmDynamicControl<V, O> {
    control: UntypedFormControl;
}

@Directive({
    selector: '[xmDynamicFormControl]',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => XmDynamicFormControlDirective),
        multi: true,
    }],
})
export class XmDynamicFormControlDirective<V, O> extends XmDynamicControlDirective<V, O> {

    /** Component value */
    @Input() public control: UntypedFormControl;

    /** Returns instance of created object */
    public instance: IFormControl<V, O>;
    /** Component ref */
    public compRef: ComponentRef<IFormControl<V, O>>;

    protected async createComponent(): Promise<void> {
        await super.createComponent();
        this.updateFormControl();
    }

    protected updateFormControl(): void {
        if (!this.instance) {
            return;
        }

        this.instance.control = this.control;

        /**
         * Since v14 you can use the corresponding method for set inputs
         */
        this.compRef.setInput('control', this.control);
    }

}
