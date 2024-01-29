import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { finalize, map, pluck, switchMap, tap } from 'rxjs/operators';
import { Principal } from '@xm-ngx/core/user';
import { I18nNamePipe, Translate } from '@xm-ngx/translation';
import { XmEntity } from '@xm-ngx/core/entity';
import { Timeline, TimelinePage, TimelineService } from '@xm-ngx/timeline';
import { Defaults, takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { XmConfigService } from '@xm-ngx/core/config';
import { XmMatCardOptions } from '@xm-ngx/entity/card';

import {
    TimeLineConfig,
    TimeLineConfigItem,
    TimeLineContext,
    TimeLineItem,
    TimeLineServiceConfig,
} from '@xm-ngx/timeline';
import { HttpResponse } from '@angular/common/http';

export interface TimelineListConfig {
    descOrder?: boolean,
    field?: string,
    title: Translate,
    noItems: Translate,
    showMore10: Translate,
    showMoreAll: Translate,
    showSizeAtHeader?: boolean;
    limit?: number;
    responses?: ResponseText[];
    version?: number;
}

export interface ResponseText {
    template: Translate;
    templateNew: Translate;
    templateDeleted: Translate;
}

interface UpdateParamAction {
    action: string,
    value: any,
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
    selector: 'xm-timeline-list',
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
    public nextV2: number;
    public timeLineResponseConfig: TimeLineConfig;
    public tlc: TimeLineContext;
    public currentSearch: string;
    public formFilter: any = {};
    private totalCount: number = 0;
    private page: number = 0;
    private timeLineItems = [];

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
                this.sortTimeLines();
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
                this.timeLines = [];
                timeLinesArray.forEach((i) => this.processTimeLines(i));
                this.sortTimeLines();
            });
    }

    public loadAllTimeLineItemsV2(): void {
        this.isMoreLoading = true;
        this.isLoading = true;

        const searchAllTimeLineItemsV2 = (size: number = 1000): Observable<any> => this.timelineService
            .searchV2(this.getSearchBodyV2({ size: size, page: 0 }))
            .pipe(
                map((resp: HttpResponse<any>) => {
                    this.totalCount -= 1000;
                    this.nextV2 = (this.totalCount - resp.body.length);

                    return resp;
                }),
                switchMap((resp) => {
                    this.timeLineItems.push(...resp.body);

                    if (this.totalCount > 1000) {
                        return searchAllTimeLineItemsV2(1000);
                    }

                    if (this.totalCount > 0 && this.totalCount <= 1000) {
                        return searchAllTimeLineItemsV2(this.totalCount);
                    }

                    return of(this.timeLineItems);

                }),
            );

        searchAllTimeLineItemsV2()
            .pipe(
                finalize(() => {
                    this.isMoreLoading = false;
                    this.isLoading = false;
                }),
            )
            .subscribe((res: TimeLineItem[]) => {
                this.timeLines = [];
                this.generateTimelines(res);
            });
    }

    public onNextPageV2(): void {
        this.page = this.page + 1;
        this.timelineService.searchV2(this.getSearchBodyV2({ size: this.config.limit, page: this.page }))
            .pipe(
                tap((resp: HttpResponse<any>) => {
                    this.totalCount = parseInt(resp.headers.get('X-Total-Count'));
                    this.nextV2 = (this.totalCount - (this.config.limit) * this.page);
                }),
                pluck('body'),
                finalize(() => this.isMoreLoading = false))
            .subscribe((res: TimeLineItem[]) => {
                this.generateTimelines(res);
            });
    }

    private load(): void {
        this.isLoading = true;
        if (!this.config?.version || this.config.version === 1) {
            this.timelineService.search(this.getSearchBody()).pipe(
                finalize(() => this.isLoading = false))
                // tslint:disable-next-line:no-identical-functions
                .subscribe((result) => {
                    this.next = result.next;
                    const timeLinesArray = result.timelines || [];
                    timeLinesArray.forEach((i) => this.processTimeLines(i));
                    this.sortTimeLines();
                });
        }
        if (this.config?.version && this.config.version === 2) {

            this.timelineService.searchV2(this.getSearchBodyV2({ size: this.config?.limit }))
                .pipe(
                    tap((resp: HttpResponse<any>) => {
                        this.totalCount = parseInt(resp.headers.get('X-Total-Count'));
                        this.nextV2 = (this.totalCount - resp.body.length);
                    }),
                    pluck('body'),
                    finalize(() => this.isLoading = false))
                .subscribe((res: TimeLineItem[]) => {
                    this.generateTimelines(res);
                });
        }
    }

    private generateTimelines(items: TimeLineItem[]) {
        for (const item of items) {
            const viewItem: any = this.createView(item);
            if (viewItem.messageData) {
                this.timeLines.push(viewItem);
            }
        }
        this.sortTimeLines();
    }

    private sortTimeLines(): void {
        this.timeLines = this.timeLines.sort((a, b) => new Date(a.startDate).getTime() < new Date(b.startDate).getTime() ? 1 : -1);
    }

    private createView(item): Timeline {
        const responses = this.config['responses'];
        const paramsToCheck = Object.keys(responses);
        const changedParams = [];
        for (const param of paramsToCheck) {
            if (this.compare(item, param).action === 'update') {
                changedParams.push(this.createTemplateString(responses[param].template));
                this.fillTimelineTemplate(item, responses[param].template);
            }
            if (this.compare(item, param).action === 'new') {
                changedParams.push(this.createTemplateString(responses[param].templateNew));
                this.fillTimelineTemplate(item, responses[param].templateNew);
            }
            if (this.compare(item, param).action === 'deleted') {
                changedParams.push(this.createTemplateString(responses[param].templateDeleted));
                this.fillTimelineTemplate(item, responses[param].templateDeleted);
            }
        }
        if (changedParams.length > 1) {
            const template = changedParams.toString().replace(/,/g, ' ');
            this.fillTimelineTemplate(item, template);
        }

        return item;
    }

    private createTemplateString(templateName): any {
        return this.i18nNamePipe.transform(templateName, this.principal) || '';
    }

    private fillTimelineTemplate(item, templateName: Translate): TimeLineItem {
        const templateStringByLang = this.i18nNamePipe.transform(templateName, this.principal);
        const templateString: string = new Function('item', 'return `' + templateStringByLang + '`;')(item);
        Object.assign(item, { messageData: templateString });
        return item;
    }

    private compare(item: TimeLineItem, param: string): UpdateParamAction {
        const after = this.getParamValue(item.entityAfter, param);
        const before = this.getParamValue(item.entityBefore, param);
        if (Array.isArray(after) && after.length && before === undefined) {
            return { action: 'new', value: after.length };
        }
        if (Array.isArray(before) && before.length && after === undefined) {
            return { action: 'deleted', value: ' deleted' };
        }
        if (Array.isArray(before) && Array.isArray(after)) {
            if (after.length > before.length) {
                return { action: 'update', value: after.length };
            }
            if (before?.length > after?.length) {
                return { action: 'deleted', value: after.length };
            }
        }
        if (!before && after) {
            return { action: 'new', value: after };
        }
        if (before && after === undefined) {
            return { action: 'deleted', value: before };
        }
        if (!Array.isArray(before) && !Array.isArray(after) && (before && after) && before !== after) {
            return { action: 'update', value: after };
        }
        return { action: 'no-prop', value: null };
    }

    private getParamValue(obj, propertyString: string): unknown {
        const properties = propertyString.split('.');
        for (let i = 0; i < properties.length; i++) {
            if (obj.hasOwnProperty(properties[i])) {
                obj = obj[properties[i]];
            } else {
                return undefined;
            }
        }
        return obj ? obj : undefined;
    }

    private processTimeLines(item: Timeline): void {
        this.tlc = new TimeLineContext(item);
        const respConfigEl = this.timeLineResponseConfig.getResponseConfigItem(this.tlc);
        if (respConfigEl) {
            Object.assign(item, { responseBodyParsed: item.responseBody ? JSON.parse(item.responseBody) : null });
            const templateStringByLang = this.i18nNamePipe.transform(respConfigEl.template, this.principal);
            const templateString = new Function('item', 'return `' + templateStringByLang + '`;')(item);
            Object.assign(item, { messageData: templateString });
            this.timeLines.push(item);
        } else {
            Object.assign(item, { messageData: item.responseBody ? item.responseBody : '' });
            this.timeLines.push(item);
        }
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

    private getSearchBodyV2(options: any = {}): TimeLineServiceConfig {
        return {
            aggregateId: this.entity.id,
            source: 'db',
            size: options?.size || 5,
            page: options.page || 0,
        };
    }
}
