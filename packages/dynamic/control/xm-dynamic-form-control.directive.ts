import { Directive, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, UntypedFormControl } from '@angular/forms';
import { setComponentInput } from '../operators/set-component-input';
import {
    XmDynamicControllerInjectorFactoryService,
} from '../src/services/xm-dynamic-controller-injector-factory.service';
import { XmDynamicControl, XmDynamicControlDirective } from './xm-dynamic-control.directive';

export interface IFormControl<V, O> extends XmDynamicControl<V, O> {
    control: UntypedFormControl;
}

@Directive({
    selector: '[xmDynamicFormControl]',
    providers: [
        XmDynamicControllerInjectorFactoryService,
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => XmDynamicFormControlDirective),
            multi: true,
        },
    ],
    standalone: false,
})
export class XmDynamicFormControlDirective<V, O> extends XmDynamicControlDirective<V, O> {

    /** Component value */
    @Input() public control: UntypedFormControl;

    /** Returns instance of created object */
    get instance(): IFormControl<V, O> {
        return super.instance as IFormControl<V, O>;
    }

    protected async createComponent(): Promise<void> {
        await super.createComponent();
        this.updateFormControl();
    }

    protected updateFormControl(): void {
        if (!this.instance) {
            return;
        }
        setComponentInput(this.compRef, 'control', this.control);
    }

}
