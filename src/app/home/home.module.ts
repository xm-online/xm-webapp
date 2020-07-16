import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { XmSharedModule } from '../shared/shared.module';
import { XmDashboardModule } from '../xm-dashboard/xm-dashboard.module';
import { HomeComponent } from './';
import { HOME_ROUTES } from './home.route';
import { HomeDefaultComponent } from './home-default/home-default.component';

@NgModule({
    imports: [
        XmSharedModule,
        RouterModule.forChild(HOME_ROUTES),
        XmDashboardModule,
    ],
    declarations: [
        HomeComponent,
        HomeDefaultComponent,
    ],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class GateHomeModule {
}
