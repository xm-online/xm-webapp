import { NgModule } from '@angular/core';
import { XmDynamicModule } from '@xm-ngx/dynamic';

@NgModule({
    imports: [
        XmDynamicModule.forChild([
            {
                selector: 'default-dashboard',
                loadChildren: () => import('@xm-ngx/dashboard').then(m => m.XmDashboardModule),
            },
        ]),
    ],
})
export class XmNgxDashboardModule {
}
