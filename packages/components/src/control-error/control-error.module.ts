import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
    XM_CONTROL_ERRORS_TRANSLATES,
    XM_CONTROL_ERRORS_TRANSLATES_DEFAULT,
} from './xm-control-errors-translates';
import { ControlErrorsDirective } from './control-errors.directive';

@NgModule({
    declarations: [ControlErrorsDirective],
    exports: [ControlErrorsDirective],
    imports: [CommonModule],
    providers: [{ provide: XM_CONTROL_ERRORS_TRANSLATES, useValue: XM_CONTROL_ERRORS_TRANSLATES_DEFAULT}],
})
export class ControlErrorModule {
}
