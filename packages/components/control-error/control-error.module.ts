import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ControlErrorsDirective } from './control-errors.directive';
import {
    XM_CONTROL_ERRORS_TRANSLATES,
    XM_CONTROL_ERRORS_TRANSLATES_DEFAULT,
    XmControlErrorsTranslates,
} from './xm-control-errors-translates';

@NgModule({
    declarations: [ControlErrorsDirective],
    exports: [ControlErrorsDirective],
    imports: [CommonModule],
})
export class ControlErrorModule {
    public static forRoot(config: {errorTranslates: XmControlErrorsTranslates}): ModuleWithProviders<ControlErrorModule> {
        return {
            providers: [
                {
                    provide: XM_CONTROL_ERRORS_TRANSLATES,
                    useValue: config?.errorTranslates || XM_CONTROL_ERRORS_TRANSLATES_DEFAULT,
                },
            ],
            ngModule: ControlErrorModule,
        };
    }
}
