import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from '../shared';
import { DashboardGuard } from './dashboard.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PendingChangesGuard } from './pending-changes.guard';

const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        data: {
            privileges: {
                value: ['DASHBOARD.GET_LIST'],
            },
        },
        canActivate: [UserRouteAccessService, DashboardGuard],
    },
    {
        path: ':id',
        component: DashboardComponent,
        data: {
            privileges: {
                value: ['DASHBOARD.GET_LIST.ITEM'],
            },
        },
        canDeactivate: [PendingChangesGuard],
        canActivate: [UserRouteAccessService, DashboardGuard],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class XmDashboardRoutingModule {
}
