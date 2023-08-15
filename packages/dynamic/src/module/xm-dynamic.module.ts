import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { XmDynamicInjectionTokenStoreService } from '../services/xm-dynamic-injection-token-store.service';
import { XmDynamicControlDirective } from '../../control/xm-dynamic-control.directive';
import { XmDynamicFormControlDirective } from '../../control/xm-dynamic-form-control.directive';
import { XM_DYNAMIC_ENTRIES } from '../dynamic.injectors';
import { XmDynamicEntries } from '../interfaces/xm-dynamic-entry';
import { XmDynamicPresentationLayoutComponent } from '../../presentation/xm-dynamic-presentation-layout.component';
import { XmDynamicPresentationDirective } from '../../presentation/xm-dynamic-presentation.directive';
import { XmDynamicWidgetLayoutComponent } from '../../widget/xm-dynamic-widget-layout.component';
import { XmDynamicWidgetDirective } from '../../widget/xm-dynamic-widget.directive';
import { XmDynamicComponentRegistry } from '../loader/xm-dynamic-component-registry.service';
import { XmDynamicModuleRegistry } from '../loader/xm-dynamic-module-registry.service';
import { XmDynamicServiceFactory } from '../../services/xm-dynamic-service-factory.service';

export function dynamicModuleInitializer(components: XmDynamicEntries): Provider {
    return [{provide: XM_DYNAMIC_ENTRIES, multi: true, useValue: components}];
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
                XmDynamicComponentRegistry,
                XmDynamicServiceFactory,
                XmDynamicModuleRegistry,
                XmDynamicInjectionTokenStoreService,
                dynamicModuleInitializer(components)],
        };
    }

    public static forChild(components: XmDynamicEntries): ModuleWithProviders<XmDynamicModule> {
        return {
            ngModule: XmDynamicModule,
            providers: [dynamicModuleInitializer(components)],
        };
    }
}
