import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRouteAccessService } from '@xm-ngx/core/permission';

const ROUTES: Routes = [
    {
        path: 'error',
        loadChildren: () => import('@xm-ngx/components/error').then((m) => m.ErrorModule),
        data: { authorities: [], pageTitle: 'error.title' },
    },
    {
        path: 'accessdenied',
        loadChildren: () => import('@xm-ngx/components/error').then((m) => m.ErrorModule),
        data: { authorities: [], pageTitle: 'error.title', error403: true },
    },
    { path: 'administration', loadChildren: () => import('../../packages/administration/route/admin.module').then((m) => m.XmAdminModule) },
    { path: '', loadChildren: () => import('./home/home.module').then((m) => m.GateHomeModule) },
    { path: '', loadChildren: () => import('@xm-ngx/account/route').then((m) => m.GateAccountModule) },
    {
        path: 'application',
        loadChildren: () => import('../../packages/entity/application').then((m) => m.ApplicationModule),
    },
    { path: 'search', pathMatch: 'full', redirectTo: 'application/search' },
    {
        path: 'dashboard',
        data: { privileges: { value: ['DASHBOARD.GET_LIST'] } },
        canActivate: [UserRouteAccessService],
        canLoad: [UserRouteAccessService],
        loadChildren: () => import('@xm-ngx/dynamic/route').then((m) => m.XmDynamicRouteModule),
    },
    {
        path: 'public',
        loadChildren: () => import('@xm-ngx/dynamic/public').then((m) => m.XmPublicModule),
    },
];

@NgModule({
    imports: [RouterModule.forRoot(ROUTES)],
    exports: [RouterModule],
})
export class XmRoutingModule {
}
