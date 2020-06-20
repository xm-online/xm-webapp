import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { XmSharedModule } from '@xm-ngx/shared';
import { DynamicControlDirective } from './control/dynamic-control.directive';
import { DynamicWidgetLayoutComponent } from './view/dynamic-widget-layout.component';
import { DynamicWidgetDirective } from './view/dynamic-widget.directive';
import { DYNAMIC_COMPONENTS } from './dynamic.injectors';
import { DynamicComponents } from './dynamic.interfaces';
import { DynamicLoader } from './loader/dynamic-loader';
import { DynamicMultiLoaderService } from './loader/dynamic-multi-loader.service';
import { DynamicMultiSearcherService } from './searcher/dynamic-multi-searcher.service';
import { DynamicSearcher } from './searcher/dynamic-searcher';
import { DynamicViewLayoutComponent } from './view/dynamic-view-layout.component';
import { DynamicViewDirective } from './view/dynamic-view.directive';

export function dynamicModuleInitializer(components: DynamicComponents): Provider {
    return [{provide: DYNAMIC_COMPONENTS, multi: true, useValue: components}];
}

@NgModule({
    imports: [XmSharedModule],
    exports: [
        DynamicViewDirective,
        DynamicControlDirective,
        DynamicWidgetDirective,
        DynamicWidgetLayoutComponent,
        DynamicViewLayoutComponent,
    ],
    declarations: [
        DynamicViewDirective,
        DynamicControlDirective,
        DynamicWidgetDirective,
        DynamicWidgetLayoutComponent,
        DynamicViewLayoutComponent,
    ],
    providers: [],
})
export class XmDynamicModule {
    public static forRoot(components: DynamicComponents): ModuleWithProviders<XmDynamicModule> {
        return {
            ngModule: XmDynamicModule,
            providers: [
                dynamicModuleInitializer(components),
                {provide: DynamicLoader, useClass: DynamicMultiLoaderService},
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
