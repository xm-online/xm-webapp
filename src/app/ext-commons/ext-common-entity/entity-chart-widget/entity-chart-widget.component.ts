import { Component, ElementRef, OnInit } from '@angular/core';
import * as Chartist from 'chartist';

import { HttpResponse } from '@angular/common/http';
import { XmEntity, XmEntityService } from '../../../xm-entity';
import { ChartService } from './chart.service';

@Component({
    selector: 'xm-entity-chart-widget',
    templateUrl: './entity-chart-widget.component.html',
    styleUrls: ['./entity-chart-widget.component.scss'],
})
export class EntityChartWidgetComponent implements OnInit {

    public config: any;
    public chartConfig: any;

    constructor(
        private xmEntityService: XmEntityService,
        private el: ElementRef,
        private chatService: ChartService,
    ) {
    }

    public ngOnInit(): void {
        this.chartConfig = this.config.config || null;

        this.xmEntityService.search({
            query: this.chartConfig.series[0].query,
            page: 0,
            size: this.chartConfig.size,
            sort: [this.chartConfig.series[0].sort],
        }).subscribe((resp: HttpResponse<XmEntity[]>) => {
           this.processData(resp.body || null);
        });
    }

    private processData(data: any): void {
        const entities: any[] = data;
        let series = [];
        const labels = [];

        if (this.config.chartType === 'Pie') {
            entities.map((e: XmEntity) => {
                series.push(this.chatService.exposeValues(this.chartConfig.series[0], e));
                labels.push(this.chatService.exposeLabels(this.chartConfig.series[0], e));
            });
            series = series.filter((s) => s > 0);
            this.chartConfig.options['total'] = series.reduce((a, b) => a + b, 0);
        } else {
            this.chartConfig.series.map((s: any, index: number) => {
                const results = [];
                entities.map((e: XmEntity) => {
                    results.push(this.chatService.exposeValues(s, e));
                });
                series[index] = results;
            });

            for (const entity of entities) {
                labels.push(this.chatService.exposeLabels(this.chartConfig.series[0], entity));
            }
        }
        this.renderChart({labels, series}, this.config.chartType);
    }

    private renderChart(data: any, type: string ): void {
        if (type) {
            const chart =
                new Chartist[type](
                    this.el.nativeElement.querySelector('.chart-container'),
                    data,
                    this.chartConfig.options || null,
                );
            this.startAnimationForLineChart(chart);
        }
    }

    private startAnimationForLineChart(chart: any): void {
        let seq: number;
        let delays: number;
        let durations: number;
        seq = 0;
        delays = 80;
        durations = 500;
        chart.on('draw', (data: any) => {
            if (data.type === 'line' || data.type === 'area') {
                data.element.animate({
                    d: {
                        begin: 600,
                        dur: 700,
                        from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
                        to: data.path.clone().stringify(),
                        easing: Chartist.Svg.Easing.easeOutQuint,
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
