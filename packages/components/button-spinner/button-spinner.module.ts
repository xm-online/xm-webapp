import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonSpinnerDirective } from '@xm-ngx/components/button-spinner/button-spinner.directive';

@NgModule({
    declarations: [ButtonSpinnerDirective],
    imports: [
        CommonModule
    ],
    exports: [ButtonSpinnerDirective]
})
export class ButtonSpinnerModule {
}
