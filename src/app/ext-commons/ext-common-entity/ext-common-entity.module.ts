import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { XmDynamicModule } from '@xm-ngx/dynamic';
import { XmBalanceModule } from '@xm-ngx/xm-balance';
import { XmSharedModule } from '../../shared/shared.module';
import { XmEntityModule } from '../../xm-entity/xm-entity.module';
import { XmTimelineModule } from '../../xm-timeline/xm-timeline.module';
import {
    AvailableOfferingsWidgetComponent,
    ChartistLineWidgetComponent,
    CustomerInfoWidgetComponent,
    EntityFabActionsComponent,
    EntityListWidgetComponent,
    EntityWidgetComponent,
    LocationCountriesWidgetComponent,
    LocationMapWidgetComponent,
    MdTableComponent,
    StatsWidgetComponent,
    TasksWidgetComponent,
} from './';

@NgModule({
    imports: [
        CommonModule,
        XmSharedModule,
        XmEntityModule,
        XmBalanceModule,
        XmTimelineModule,
        XmDynamicModule.forChild([
            {selector: 'xm-widget-available-offerings', loadChildren: () => AvailableOfferingsWidgetComponent},
            {selector: 'xm-widget-chartist-line', loadChildren: () => ChartistLineWidgetComponent},
            {selector: 'xm-widget-provide-customer-info', loadChildren: () => CustomerInfoWidgetComponent},
            {selector: 'xm-widget-entity-fab-actions', loadChildren: () => EntityFabActionsComponent},
            {selector: 'xm-widget-entities-list', loadChildren: () => EntityListWidgetComponent},
            {selector: 'xm-widget-entity', loadChildren: () => EntityWidgetComponent},
            {selector: 'xm-widget-general-map', loadChildren: () => LocationMapWidgetComponent},
            {selector: 'xm-widget-general-countries', loadChildren: () => LocationCountriesWidgetComponent},
            {selector: 'xm-widget-stats', loadChildren: () => StatsWidgetComponent},
            {selector: 'xm-widget-tasks', loadChildren: () => TasksWidgetComponent},
        ]),
    ],
    declarations: [
        AvailableOfferingsWidgetComponent,
        ChartistLineWidgetComponent,
        CustomerInfoWidgetComponent,
        EntityFabActionsComponent,
        EntityListWidgetComponent,
        EntityWidgetComponent,
        LocationCountriesWidgetComponent,
        LocationMapWidgetComponent,
        MdTableComponent,
        StatsWidgetComponent,
        TasksWidgetComponent,
    ],
    providers: [],
})
export class ExtCommonEntityModule {
}
