import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { XmBalanceModule } from '@xm-ngx/balance';
import { TagInputModule } from 'ngx-chips';

import { RatingModule } from '@xm-ngx/components/rating';
import { XmSharedModule } from '@xm-ngx/shared';
import { XmDynamicModule } from '@xm-ngx/dynamic';
import { XmEntityModule } from '@xm-ngx/entity';
import { ApplicationComponent } from './application.component';
import { ApplicationResolvePagingParams, applicationRoute } from './application.route';
import { EntityDetailComponent } from './entity-detail.component';

@NgModule({
    imports: [
        XmSharedModule,
        RouterModule.forChild(applicationRoute),
        TagInputModule,
        RatingModule,
        XmEntityModule,
        XmBalanceModule,
        XmDynamicModule,
        XmEntityModule,
    ],
    declarations: [
        ApplicationComponent,
        EntityDetailComponent,
    ],
    providers: [
        ApplicationResolvePagingParams,
    ],
})
export class ApplicationModule {
}
