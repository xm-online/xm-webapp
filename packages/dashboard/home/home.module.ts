import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { XmDynamicModule } from '@xm-ngx/dynamic';
import { HomeComponent } from './home.component';
import { HOME_ROUTE } from './home.route';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([HOME_ROUTE]),
        XmDynamicModule,
    ],
    declarations: [
        HomeComponent,
    ],
    providers: [],
})
export class GateHomeModule {
}
