import { NgModule } from '@angular/core';
import { XmDynamicModule } from '@xm-ngx/dynamic';

@NgModule({
    imports: [
        /** XmDynamicModule used for creating lazy dynamic components. */
        XmDynamicModule.forChild([
            {
                selector: 'example-widget',
                loadChildren: () => import('./example-widget').then(m => m.ExampleWidgetModule),
            },
        ]),
    ],
})
/** ExampleWebappExtModule is an entry point into your lazy module(extension). */
export class ExampleWebappExtModule {
}
