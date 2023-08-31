import { NgModule } from '@angular/core';
import { ButtonSpinnerDirective } from './button-spinner.directive';

@NgModule({
    imports: [ButtonSpinnerDirective],
    exports: [ButtonSpinnerDirective],
})
/** @deprecated use {@link ButtonSpinnerDirective} instead. */
export class ButtonSpinnerModule {
}
