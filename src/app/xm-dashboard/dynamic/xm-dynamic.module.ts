import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { XmSharedModule } from '@xm-ngx/shared';
import { DynamicWidgetLayoutComponent } from './dynamic-widget-layout.component';
import { DynamicWidgetDirective } from './dynamic-widget.directive';
import { DYNAMIC_COMPONENTS } from './dynamic.injectors';
import { DynamicComponents } from './dynamic.interfaces';
import { DynamicMultiSearcherService } from './searcher/dynamic-multi-searcher.service';
import { DynamicSearcher } from './searcher/dynamic-searcher';

export function dynamicModuleInitializer(components: DynamicComponents): Provider {
    return [{provide: DYNAMIC_COMPONENTS, multi: true, useValue: components}];
}

@NgModule({
    imports: [XmSharedModule],
    exports: [DynamicWidgetDirective, DynamicWidgetLayoutComponent],
    declarations: [DynamicWidgetDirective, DynamicWidgetLayoutComponent],
    providers: [],
})
export class XmDynamicModule {
    public static forRoot(components: DynamicComponents): ModuleWithProviders<XmDynamicModule> {
        return {
            ngModule: XmDynamicModule,
            providers: [
                dynamicModuleInitializer(components),
                {provide: DynamicSearcher, useClass: DynamicMultiSearcherService},
            ],
        };
    }

    public static forChild(components: DynamicComponents): ModuleWithProviders<XmDynamicModule> {
        return {
            ngModule: XmDynamicModule,
            providers: [dynamicModuleInitializer(components)],
        };
    }
}
