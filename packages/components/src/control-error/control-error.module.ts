import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ControlErrorsDirective } from './control-errors.directive';


@NgModule({
    declarations: [ControlErrorsDirective],
    exports: [ControlErrorsDirective],
    imports: [CommonModule],
})
export class ControlErrorModule {
}
