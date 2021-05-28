import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonSpinnerDirective } from './button-spinner.directive';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [ButtonSpinnerDirective],
    exports: [ButtonSpinnerDirective]
})
export class ButtonSpinnerModule {
}
