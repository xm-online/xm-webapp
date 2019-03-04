import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';

import { JhiLanguageHelper } from '../../../shared';
import { ModulesLanguageHelper } from '../../../shared/language/modules-language.helper';
import { XmSharedModule } from '../../../shared/shared.module';
import { XmEntityModule } from '../../../xm-entity/xm-entity.module';
import { ManagementWidgetComponent } from './management-widget/management-widget.component';
import { AnalyticWidgetComponent } from './analytics-widget/analytic-widget.component';
import { UnitListCardComponent } from './management-widget/unit-list-card/unit-list-card.component';
import { UnitProductListCardComponent } from './management-widget/unit-product-list-card/unit-product-list-card.component';
import { UnitProductMapCardComponent } from './management-widget/unit-product-map-card/unit-product-map-card.component';
import { AnalyticGraphComponent } from './analytics-widget/analytic-graph/analytic-graph.component';
import { AnalyticFilterComponent } from './analytics-widget/analytic-filter/analytic-filter.component';
import { AnalyticStatsComponent } from './analytics-widget/analytic-stats/analytic-stats.component';
import { LoravnoService } from './shared/loravno.service';


@NgModule({
    imports: [
        CommonModule,
        XmSharedModule,
        XmEntityModule,
        AgmCoreModule.forRoot(),
        AgmJsMarkerClustererModule,
        AgmSnazzyInfoWindowModule
    ],
    declarations: [
        ManagementWidgetComponent,
        UnitListCardComponent,
        UnitProductListCardComponent,
        UnitProductMapCardComponent,
        AnalyticWidgetComponent,
        AnalyticGraphComponent,
        AnalyticFilterComponent,
        AnalyticStatsComponent
    ],
    entryComponents: [
        ManagementWidgetComponent,
        AnalyticWidgetComponent
    ],
    providers: [
        LoravnoService,
        {
            provide: 'management-widget', useValue: ManagementWidgetComponent
        },
        {
            provide: 'analytic-widget', useValue: AnalyticWidgetComponent
        }
    ]
})

export class LoravnoWebappExtModule {
    constructor(private modulesLangHelper: ModulesLanguageHelper, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {this.modulesLangHelper.correctLang(languageKey)});
    }
}
