import { NgModule } from '@angular/core';
import { XmDynamicModule } from '@xm-ngx/dynamic';

@NgModule({
    imports: [
        XmDynamicModule.forChild([
            {
                selector: 'examples',
                loadChildren: () => import('../doc-examples/xm-doc-examples.module').then(m => m.XmDocExamplesModule),
            },
        ]),
    ],
})
export class DocumentationModule {
}
