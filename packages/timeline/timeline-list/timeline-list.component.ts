import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { of, Observable } from 'rxjs';
import { finalize, map, switchMap } from 'rxjs/operators';
import { Principal } from '@xm-ngx/core/user';
import { I18nNamePipe } from '@xm-ngx/translation';
import { XmEntity } from '@xm-ngx/entity';
import { Timeline, TimelinePage, TimelineService } from '@xm-ngx/timeline';
import { Defaults, takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { XmConfigService } from '@xm-ngx/core/config';
import { Translate } from '@xm-ngx/translation';
import { XmMatCardOptions } from '@xm-ngx/entity/xm-mat-card';

import { TimeLineConfig, TimeLineConfigItem, TimeLineContext } from './timeline-config.model';

export interface TimelineListConfig {
    descOrder?: boolean,
    field?: string,
    title: Translate,
    noItems: Translate,
    showMore10: Translate,
    showMoreAll: Translate,
    showSizeAtHeader?: boolean;
    limit?: number;
}

const DEFAULT: TimelineListConfig & XmMatCardOptions = {
    condition: '',
    editCondition: 'false',
    readonly: false,
    limit: 5,
    showSizeAtHeader: true,
    descOrder: true,
    collapsableContent: true,
    field: 'startDate',
    title: 'xm-timeline.common.title',
    noItems: 'xm-timeline.common.no-items',
    showMore10: 'xm-timeline.common.show-more-10',
    showMoreAll: 'xm-timeline.common.show-more-all',
};

@Component({
    selector: 'xm-common-timeline-list',
    templateUrl: './timeline-list.component.html',
    styleUrls: ['./timeline-list.component.scss'],
})
export class TimelineListComponent implements OnInit, OnDestroy {

    @Input() @Defaults(DEFAULT) public config: TimelineListConfig & XmMatCardOptions;
    @Input() public entity: XmEntity;
    @Input() public timeLineOptions: any;
    @Input() public params: any;
    @Input() public filter: any;
    public isLoading: boolean = false;
    public isMoreLoading: boolean = false;
    public timeLines: Timeline[] = [];
    public next: number;
    public timeLineResponseConfig: TimeLineConfig;
    public tlc: TimeLineContext;
    public currentSearch: string;
    public formFilter: any = {};

    constructor(private timelineService: TimelineService,
                private i18nNamePipe: I18nNamePipe,
                private principal: Principal,
                private xmConfigService: XmConfigService) {
    }

    public ngOnInit(): void {
        this.xmConfigService.getUiConfig().pipe(
            takeUntilOnDestroy(this),
        ).subscribe((config) => {
            this.timeLineResponseConfig = new TimeLineConfig(config.timeline.responses.map((e) => {
                return new TimeLineConfigItem(
                    e.code,
                    e.codePath,
                    e.template,
                    e.condition,
                );
            }));
            this.load();
        });
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public trackId(_index: number, item: Timeline): string {
        return item.id;
    }

    public onNextPage(next: number): void {
        this.isMoreLoading = true;
        this.timelineService.search(this.getSearchBody({ next })).pipe(
            finalize(() => this.isMoreLoading = false))
            .subscribe((result) => {
                this.next = result.next;
                const timeLinesArray = result.timelines || [];
                timeLinesArray.forEach((i) => this.processTimeLines(i));
            });
    }

    public loadAll(): void {
        this.isMoreLoading = true;
        const searchAll = (next = 0): Observable<TimelinePage> => this.timelineService
            .search(this.getSearchBody({ limit: 1000, next }))
            .pipe(
                switchMap((res) => {
                    if (res.next == null) {
                        return of(res);
                    }
                    return searchAll(next + 1).pipe(
                        map(j => new TimelinePage(
                            [...res.timelines, ...j.timelines],
                            j.next,
                        )),
                    );
                }),
            );

        searchAll().pipe(
            finalize(() => this.isMoreLoading = false))
            .subscribe((result) => {
                this.next = result.next;
                const timeLinesArray = result.timelines || [];
                timeLinesArray.forEach((i) => this.processTimeLines(i));
            });
    }

    private load(): void {
        this.isLoading = true;
        this.timelineService.search(this.getSearchBody()).pipe(
            finalize(() => this.isLoading = false))
            // tslint:disable-next-line:no-identical-functions
            .subscribe((result) => {
                this.next = result.next;
                const timeLinesArray = result.timelines || [];
                timeLinesArray.forEach((i) => this.processTimeLines(i));
            });
    }

    private processTimeLines(item: Timeline): void {
        this.tlc = new TimeLineContext(item);
        const respConfigEl = this.timeLineResponseConfig.getResponseConfigItem(this.tlc);
        if (respConfigEl) {
            this.bootstrapItem(item, respConfigEl);
        } else {
            Object.assign(item, { messageData: item.responseBody ? item.responseBody : '' });
            this.timeLines.push(item);
        }
    }

    private bootstrapItem(item: Timeline, config: any): void {
        Object.assign(item, { responseBodyParsed: item.responseBody ? JSON.parse(item.responseBody) : null });
        const templateStringByLang = this.i18nNamePipe.transform(config.template, this.principal);
        const templateString = new Function('item', 'return `' + templateStringByLang + '`;')(item);
        Object.assign(item, { messageData: templateString });
        this.timeLines.push(item);
    }

    private getSearchBody(options: any = {}): any {
        return Object.assign(
            {
                id: this.entity.id,
                limit: this.config.limit,
                operation: this.currentSearch,
                dateFrom: this.formFilter.dateFrom ? this.formFilter.dateFrom.toJSON() : '',
                dateTo: this.formFilter.dateTo ? this.formFilter.dateTo.toJson() : '',
            },
            this.params || {},
            options,
        );
    }
}
