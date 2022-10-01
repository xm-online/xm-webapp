import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { XM_DYNAMIC_EXTENSIONS } from '../dynamic.injectors';
import { XmDynamicExtensionEntry } from '../interfaces/xm-dynamic-extension.model';

export function dynamicExtensionModuleInitializer(components: XmDynamicExtensionEntry[]): Provider {
    return [{ provide: XM_DYNAMIC_EXTENSIONS, multi: true, useValue: components }];
}

@NgModule()
export class XmDynamicExtensionModule {
    public static forRoot(components: XmDynamicExtensionEntry[]): ModuleWithProviders<XmDynamicExtensionModule> {
        return {
            ngModule: XmDynamicExtensionModule,
            providers: [
                dynamicExtensionModuleInitializer(components),
            ],
        };
    }

    public static forChild(components: XmDynamicExtensionEntry[]): ModuleWithProviders<XmDynamicExtensionModule> {
        return {
            ngModule: XmDynamicExtensionModule,
            providers: [dynamicExtensionModuleInitializer(components)],
        };
    }
}
