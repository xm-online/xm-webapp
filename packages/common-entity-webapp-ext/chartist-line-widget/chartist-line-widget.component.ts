import { HttpResponse } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit } from '@angular/core';

import { XmEntity, XmEntityService } from '@xm-ngx/entity';
import * as Chartist from 'chartist';
import { LineChart } from 'chartist';
import { XmDynamicWidget } from '@xm-ngx/dynamic';

@Component({
    selector: 'xm-chartist-line-widget',
    templateUrl: './chartist-line-widget.component.html',
})
export class ChartistLineWidgetComponent implements OnInit, XmDynamicWidget {

    public name: any;
    public firstSeries: any;
    @Input() public config: any;

    constructor(
        private xmEntityService: XmEntityService,
        private element: ElementRef,
    ) {
    }

    public ngOnInit(): void {
        this.name = this.config.name;
        this.firstSeries = this.config.series[0];
        this.xmEntityService.search({
            query: this.firstSeries.query,
            page: 0,
            size: this.config.size,
            sort: [this.firstSeries.sort],
        }).subscribe((resp: HttpResponse<XmEntity[]>) => {
            const entities: any[] = resp.body;
            const series = [[]];
            const labels = [];
            for (const entity of entities) {
                series[0].push(this.firstSeries.seriesSelector.split('.').reduce((a, b) => a[b], entity));
                labels.push(this.firstSeries.labelSelector.split('.').reduce((a, b) => a[b], entity));
            }

            const chartistLine = new LineChart(
                this.element.nativeElement.querySelector('.chartistLine'), {
                    labels,
                    series,
                },
                this.config.options);
            this.startAnimationForLineChart(chartistLine);
        });
    }

    public startAnimationForLineChart(chart: any): void {
        let seq = 0;
        const delays = 80;
        const durations = 500;

        chart.on('draw', (data: any) => {
            if (data.type === 'line' || data.type === 'area') {
                data.element.animate({
                    d: {
                        begin: 600,
                        dur: 700,
                        from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
                        to: data.path.clone().stringify(),
                        easing: Chartist.easings.easeOutQuint,
                    },
                });
            } else if (data.type === 'point') {
                seq++;
                data.element.animate({
                    opacity: {
                        begin: seq * delays,
                        dur: durations,
                        from: 0,
                        to: 1,
                        easing: 'ease',
                    },
                });
            }
        });
        seq = 0;
    }

}
