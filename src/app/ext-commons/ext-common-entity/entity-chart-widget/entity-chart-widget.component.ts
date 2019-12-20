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
            const SRC = this.chartConfig.series[0];
            entities.map((e: XmEntity) => {
                const SLICE = {
                    value: this.chatService.exposeValues(SRC, e),
                    name: SRC.name,
                };
                if (this.config.useSeriesColorClass) {
                    Object.assign(SLICE, {
                        className: this.chatService.exposeClassPath(this.chartConfig.series[0], e),
                    });
                }
                series.push(SLICE);
                labels.push(this.chatService.exposeLabels(this.chartConfig.series[0], e));
            });
            series = series.filter((s) => s.value > 0);
            this.chartConfig.options['total'] = series.map((a) => a.value).reduce((a, b) => a + b, 0);
            if (this.config.useHalfForDonut) {
                this.chartConfig.options['total'] = this.chartConfig.options['total'] * 2;
            }
        } else {
            this.chartConfig.series.map((s: any) => {
                const results = [];
                entities.map((e: XmEntity) => {
                    results.push(this.chatService.exposeValues(s, e));
                });
                const SRS = {
                    name: s.name,
                    data: results,
                };
                if (this.config.useSeriesColorClass) {
                    Object.assign(SRS, {
                        className: s.className,
                    });
                }
                series.push(SRS);
            });

            // case we need separate bars from one query and colorClass from each entity
            if (this.config.useSeriesColorClass && this.chartConfig.series[0].classNamePath) {
                series = [];
                const src = this.chartConfig.series[0];
                for (const e of entities) {
                    series.push({
                        name: src.name,
                        value: this.chatService.exposeValues(src, e),
                        className: this.chatService.exposeClassPath(src, e),
                    });
                }
            }

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

            if (this.config.useAnimations) {
                if (type === 'Pie') {
                    this.startAnimationForPieChart(chart);
                } else {
                    this.startAnimationForLineChart(chart);
                }
            }
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

    private startAnimationForPieChart(chart: any): void {
        chart.on('draw', (data) => {
            if (data.type === 'slice') {
                const pathLength = data.element._node.getTotalLength();
                data.element.attr({
                    'stroke-dasharray': pathLength + 'px ' + pathLength + 'px',
                });
                const animationDefinition = {
                    'stroke-dashoffset': {
                        id: 'anim' + data.index,
                        dur: 500,
                        from: -pathLength + 'px',
                        to:  '0px',
                        easing: Chartist.Svg.Easing.easeOutQuint,
                        fill: 'freeze',
                    },
                };
                if (data.index !== 0) {
                    animationDefinition['stroke-dashoffset']['begin'] = 'anim' + (data.index - 1) + '.end';
                }
                data.element.attr({
                    'stroke-dashoffset': -pathLength + 'px',
                });
                data.element.animate(animationDefinition, false);
            }
        });
    }
}
