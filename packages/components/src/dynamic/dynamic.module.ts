import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Optional } from '@angular/core';
import { DynamicControlDirective } from './components/dynamic-control.directive';
import { DynamicDirective } from './components/dynamic-directive';
import { IDynamicComponent } from './dynamic-components-base';

import { DynamicComponentsService } from './dynamic-components.service';
import { DYNAMIC_COMPONENTS } from './dynamic.injectors';

export type DynamicComponents = IDynamicComponent[] | IDynamicComponent[][];

export function dynamicModuleInitializer(components: DynamicComponents): any {
    return [
        {provide: DYNAMIC_COMPONENTS, multi: true, useValue: components},
        DynamicComponentsService,
    ];
}

@NgModule({
    declarations: [DynamicDirective, DynamicControlDirective],
    exports: [DynamicDirective, DynamicControlDirective],
    imports: [CommonModule],
})
export class DynamicModule {
    constructor(@Optional() _loader: DynamicComponentsService) {
        // Trigger to load component
    }

    public static forRoot(components: DynamicComponents): ModuleWithProviders<DynamicModule> {
        return {
            ngModule: DynamicModule,
            providers: [dynamicModuleInitializer(components)],
        };
    }

    public static forChild(components: DynamicComponents): ModuleWithProviders<DynamicModule> {
        return {
            ngModule: DynamicModule,
            providers: [dynamicModuleInitializer(components)],
        };
    }
}
