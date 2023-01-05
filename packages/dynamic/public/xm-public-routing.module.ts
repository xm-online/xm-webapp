import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { XmPublicComponent } from './xm-public.component';

const routes: Routes = [
    {
        path: ':slug',
        component: XmPublicComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class XmPublicRoutingModule {
}
