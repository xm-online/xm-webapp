import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRouteAccessService } from '@xm-ngx/core/permission';
import { AuthKeycloakGuard } from '@xm-ngx/ext/crmotb-webapp-ext/core/guards/auth-keycloak.guard';

const ROUTES: Routes = [
    {
        path: 'accessdenied',
        loadChildren: () => import('@xm-ngx/components/error').then((m) => m.ErrorModule),
        data: {authorities: [], pageTitle: 'error.title', error403: true},
    },
    {
        path: 'not-found',
        loadChildren: () => import('@xm-ngx/components/error').then((m) => m.ErrorModule),
        data: {authorities: [], pageTitle: 'error.title', error404: true},
    },
    {
        path: 'administration',
        canActivate: [AuthKeycloakGuard], // <-- ДОДАЛИ
        loadChildren: () => import('@xm-ngx/administration/route').then((m) => m.XmAdminModule),
    },
    {
        path: '',
        canActivate: [AuthKeycloakGuard], // <-- ДОДАЛИ (тепер корінь сайту теж вимагає логін)
        loadChildren: () => import('@xm-ngx/dashboard/home').then((m) => m.GateHomeModule),
    },
    {
        path: '',
        canActivate: [AuthKeycloakGuard], // <-- ДОДАЛИ
        loadChildren: () => import('@xm-ngx/account').then((m) => m.GateAccountModule),
    },
    {
        path: 'application',
        canActivate: [AuthKeycloakGuard], // <-- ДОДАЛИ
        loadChildren: () => import('@xm-ngx/administration/application').then((m) => m.ApplicationModule),
    },
    {path: 'search', pathMatch: 'full', redirectTo: 'application/search'},
    {
        path: 'dashboard',
        data: {privileges: {value: ['DASHBOARD.GET_LIST']}},
        // Тут ставимо обидва: AuthGuard перевірить Keycloak, а UserRouteAccessService - права в системі
        canActivate: [AuthKeycloakGuard, UserRouteAccessService], // <-- ДОДАЛИ AuthGuard першим
        canLoad: [UserRouteAccessService],
        loadChildren: () => import('@xm-ngx/dynamic/route').then((m) => m.XmDynamicRouteModule),
    },
    {
        // ВАШ ПУБЛІЧНИЙ РОУТ
        path: 'public',
        // ТУТ ГВАРДІВ НЕМАЄ - сюди пускатиме всіх без редіректу!
        loadChildren: () => import('@xm-ngx/dynamic/public').then((m) => m.XmPublicModule),
    },
    {path: '**', redirectTo: '/not-found'},
];

@NgModule({
    imports: [RouterModule.forRoot(ROUTES)],
    exports: [RouterModule],
})
export class XmRoutingModule {
}
