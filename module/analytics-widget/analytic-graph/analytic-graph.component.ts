import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { JhiEventManager } from 'ng-jhipster';
import { Subscription } from 'rxjs';

import * as Chartist from 'chartist';

import { XmEntityService } from '../../../../../xm-entity';
import { CPI_EVENT_LIST } from '../../loravno.constants';

@Component({
    selector: 'xm-graph-widget',
    templateUrl: './analytic-graph.component.html',
    styleUrls: ['./analytic-graph.component.scss']
})
export class AnalyticGraphComponent implements OnInit, OnDestroy {

    private analyticFilterEvent: Subscription;
    name: any;
    period: any;
    statistics: any;
    labels: any = [];
    temperatureValues: any = [];
    humidityValues: any = [];
    quantityOfSalesTransactionsValues: any = [];

    constructor(private xmEntityService: XmEntityService,
                private eventManager: JhiEventManager,
                private element: ElementRef) {
    }

    ngOnInit() {
        this.analyticFilterEvent = this.eventManager.subscribe(CPI_EVENT_LIST.EVENT_ANALYTIC_FILTER, event => {
            if (event && event.data && event.data.analytic) {
                this.period = parseFloat(event.data.period);
                this.statistics = event.data.analytic.data.statistics || [];
                this.labels = [];
                this.temperatureValues = [];
                this.humidityValues = [];
                const hasOwnProperty = Object.prototype.hasOwnProperty;
                for (const label in this.statistics) {
                    if (hasOwnProperty.call(this.statistics, label)) {
                        this.labels.push(label);
                        this.temperatureValues.push(this.statistics[label].temperature);
                        this.humidityValues.push(this.statistics[label].humidity);
                    }
                }
                this.buildGraphs('loraAnalyticHumidity', {
                    labels: this.labels.reverse(),
                    series: [this.humidityValues]
                });
                this.buildGraphs('loraAnalyticTemperature', {
                    labels: this.labels.reverse(),
                    series: [this.temperatureValues]
                });
            }
        });
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.analyticFilterEvent);
    }

    buildGraphs (id: string, data: any) {
        const chartistLine = new Chartist.Line(this.element.nativeElement.querySelector(`#${id}`), {
                labels: data.labels,
                series: data.series
            },
            {
                'low': 0,
                'showPoint': true,
                'height': '310px'
            });
        this.startAnimationForLineChart(chartistLine);
    }

    startAnimationForLineChart(chart: any) {
        let seq: number, delays: number, durations: number;
        seq = 0;
        delays = 80;
        durations = 500;
        chart.on('draw', function (data: any) {
            if (data.type === 'line' || data.type === 'area') {
                data.element.animate({
                    d: {
                        begin: 600,
                        dur: 700,
                        from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
                        to: data.path.clone().stringify(),
                        easing: Chartist.Svg.Easing.easeOutQuint
                    }
                });
            } else if (data.type === 'point') {
                seq++;
                data.element.animate({
                    opacity: {
                        begin: seq * delays,
                        dur: durations,
                        from: 0,
                        to: 1,
                        easing: 'ease'
                    }
                });
            }
        });
        seq = 0;
    }
}
