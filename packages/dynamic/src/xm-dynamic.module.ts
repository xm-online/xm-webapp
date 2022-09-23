import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { XmDynamicControlDirective } from './control/xm-dynamic-control.directive';
import { XmDynamicFormControlDirective } from './control/xm-dynamic-form-control.directive';
import { XM_DYNAMIC_ENTRIES } from './dynamic.injectors';
import { XmDynamicEntries } from './interfaces/xm-dynamic-entry';
import { XmDynamicPresentationLayoutComponent } from './presentation/xm-dynamic-presentation-layout.component';
import { XmDynamicPresentationDirective } from './presentation/xm-dynamic-presentation.directive';
import { XmDynamicWidgetLayoutComponent } from './widget/xm-dynamic-widget-layout.component';
import { XmDynamicWidgetDirective } from './widget/xm-dynamic-widget.directive';

export function dynamicModuleInitializer(components: XmDynamicEntries): Provider {
    return [{ provide: XM_DYNAMIC_ENTRIES, multi: true, useValue: components }];
}

@NgModule({
    imports: [CommonModule],
    exports: [
        XmDynamicPresentationDirective,
        XmDynamicControlDirective,
        XmDynamicWidgetDirective,
        XmDynamicWidgetLayoutComponent,
        XmDynamicPresentationLayoutComponent,
        XmDynamicFormControlDirective,
    ],
    declarations: [
        XmDynamicPresentationDirective,
        XmDynamicControlDirective,
        XmDynamicWidgetDirective,
        XmDynamicWidgetLayoutComponent,
        XmDynamicPresentationLayoutComponent,
        XmDynamicFormControlDirective,
    ],
    providers: [],
})
export class XmDynamicModule {
    public static forRoot(components: XmDynamicEntries): ModuleWithProviders<XmDynamicModule> {
        return {
            ngModule: XmDynamicModule,
            providers: [
                dynamicModuleInitializer(components),
            ],
        };
    }

    public static forChild(components: XmDynamicEntries): ModuleWithProviders<XmDynamicModule> {
        return {
            ngModule: XmDynamicModule,
            providers: [dynamicModuleInitializer(components)],
        };
    }
}
