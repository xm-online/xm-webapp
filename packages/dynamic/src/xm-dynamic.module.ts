import {CommonModule} from '@angular/common';
import {ModuleWithProviders, NgModule, Provider} from '@angular/core';
import {XmDynamicControlDirective} from './control/xm-dynamic-control.directive';
import {XmDynamicFormControlDirective} from './control/xm-dynamic-form-control.directive';
import {XM_DYNAMIC_ENTRIES} from './dynamic.injectors';
import {XmDynamicEntries} from './interfaces/xm-dynamic-entry';
import {DynamicLoader} from './loader/dynamic-loader';
import {DynamicMultiLoaderService} from './loader/dynamic-multi-loader.service';
import {XmDynamicPresentationLayoutComponent} from './presentation/xm-dynamic-presentation-layout.component';
import {XmDynamicPresentationDirective} from './presentation/xm-dynamic-presentation.directive';
import {DynamicMultiSearcherService} from './searcher/dynamic-multi-searcher.service';
import {DynamicSearcher} from './searcher/dynamic-searcher';
import {XmDynamicWidgetLayoutComponent} from './widget/xm-dynamic-widget-layout.component';
import {XmDynamicWidgetDirective} from './widget/xm-dynamic-widget.directive';
import {flatten} from 'lodash';

export function dynamicModuleInitializer(components: XmDynamicEntries): Provider {
    const res = {'any': {}};
    flatten(components).forEach((comp) => {
        const type = comp.type || 'any';
        if (!res[type]) {
            res[type] = {};
        }
        res[type][comp.selector] = comp;
    });
    // console.log('b2b', Object.keys(res), res);
    return [{provide: XM_DYNAMIC_ENTRIES, multi: true, useValue: res}];

    // [comp, comp, comp]
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
                {provide: DynamicLoader, useClass: DynamicMultiLoaderService},
                {provide: DynamicSearcher, useClass: DynamicMultiSearcherService},
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
