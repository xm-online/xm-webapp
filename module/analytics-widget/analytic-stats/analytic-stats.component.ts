import { Component, OnDestroy, OnInit } from '@angular/core';
import { JhiEventManager } from 'ng-jhipster';
import { Subscription } from 'rxjs';

import { CPI_EVENT_LIST } from '../../loravno.constants';
import { LoravnoService } from '../../shared/loravno.service';

@Component({
    selector: 'xm-analytic-stats',
    templateUrl: './analytic-stats.component.html',
    styleUrls: ['./analytic-stats.component.scss']
})
export class AnalyticStatsComponent implements OnInit, OnDestroy {

    private analyticFilterEvent: Subscription;
    static: any;
    errorsSensorCount: any;
    period: any;
    grossSales: any;
    activeSensorsCount: any;
    showLoader: boolean;

    constructor(private cpiService: LoravnoService ,
                private eventManager: JhiEventManager) {
    }

    ngOnInit() {
        this.analyticFilterEvent = this.eventManager.subscribe(CPI_EVENT_LIST.EVENT_ANALYTIC_FILTER, event => {
            if (event && event.data) {
                this.static = event.data.analytic;
                this.period = parseFloat(event.data.period);
                this.errorsSensorCount = this.static.data.errorsSensorCount ? this.static.data.errorsSensorCount : 0;
                this.grossSales = (this.static.data.sum && this.static.data.sum.grossSales) ? this.static.data.sum.grossSales : 0;
                this.activeSensorsCount = (this.static.data.sum && this.static.data.sum.activeSensorsCount) ?
                    this.static.data.sum.activeSensorsCount : 0;
                this.showLoader = false;
            }
        });
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.analyticFilterEvent);
    }

    onRefresh () {
        this.showLoader = true;
        this.eventManager.broadcast({name: CPI_EVENT_LIST.REQUEST_FILTER_UPDATE});
    }
}
