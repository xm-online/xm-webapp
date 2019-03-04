import { Component, OnDestroy, OnInit } from '@angular/core';
import { JhiEventManager } from 'ng-jhipster';
import { finalize } from 'rxjs/operators';

import { XmEntity } from '../../../../../xm-entity';
import { LoravnoService } from '../../index';
import { CPI_EVENT_LIST, UNIT_TYPE_KEY } from '../../loravno.constants';
import { Subscription } from 'rxjs';

@Component({
    selector: 'xm-analytic-filter-widget',
    templateUrl: './analytic-filter.component.html',
    styleUrls: ['./analytic-filter.component.scss']
})
export class AnalyticFilterComponent implements OnInit, OnDestroy {

    private analyticFilterEventUpdate: Subscription;
    units: XmEntity[];
    selectedUnit: XmEntity;
    allUnits: XmEntity;
    period: any;
    showLoader: boolean;
    analytic: any;

    constructor(private eventManager: JhiEventManager,
                private cpiService: LoravnoService) {
        this.allUnits = new XmEntity(null);
    }

    ngOnInit() {
        this.analyticFilterEventUpdate = this.eventManager.subscribe(CPI_EVENT_LIST.REQUEST_FILTER_UPDATE, event => {
            this.getStats(this.getOptionsFilter());
        });
        this.load();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.analyticFilterEventUpdate);
    }

    load() {
        this.cpiService.getUnits({
            typeKey: UNIT_TYPE_KEY
        }).pipe(finalize(() => this.showLoader = false)).subscribe(resp => {
            this.units = resp.body;
            this.selectedUnit = this.allUnits;
            this.period = '30';
            this.getStats(this.getOptionsFilter());
        }, (error) => {
            console.log(error);
        });
    }

    onFilterChange() {
        this.getStats(this.getOptionsFilter());
    }

    getStats(options) {
        this.cpiService.getAnalytic(options).subscribe(resp => {
            this.analytic = resp.body;
            this.eventManager.broadcast({name: CPI_EVENT_LIST.EVENT_ANALYTIC_FILTER, data: {
                analytic: this.analytic,
                period: this.period
            }});
        });
    }

    getOptionsFilter() {
        let options;
        if (this.selectedUnit && this.selectedUnit.id) {
            options = {
                unitId: this.selectedUnit.id,
                dateFrom: this.cpiService.getDateFromPeriod(this.period),
                dateTo: this.cpiService.getDateFromPeriod(0)
            }
        } else {
            options = {
                dateFrom: this.cpiService.getDateFromPeriod(this.period),
                dateTo: this.cpiService.getDateFromPeriod(0)
            }
        }
        return options;
    }
}
