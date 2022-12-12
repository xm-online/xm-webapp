import { Component, Input, NgModule, OnDestroy, OnInit, Type } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Principal } from '@xm-ngx/core/auth';
import { I18nNamePipe } from '@xm-ngx/components/language';
import { XmEntity } from '@xm-ngx/entity';
import { TimelineService } from '@xm-ngx/timeline';
import { LoaderModule } from '@xm-ngx/components/loader';
import { Defaults, takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { XmConfigService } from 'src/app/shared';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';

import { TimelineCardComponent } from './timeline-card/timeline-card.component';
import { TimeLineConfig, TimeLineConfigItem, TimeLineContext } from './timeline-config.model';


export interface TimelineListConfig {
    descOrder?: boolean,
    field?: string,
    title: Translate,
    noItems: Translate,
    showMore10: Translate
}

const DEFAULT: TimelineListConfig = {
    descOrder: true,
    field: 'startDate',
    title: 'xm-timeline.common.title',
    noItems: 'xm-timeline.common.no-items',
    showMore10: 'xm-timeline.common.show-more-10'
};

@Component({
    selector: 'xm-common-timeline-list',
    templateUrl: './timeline-list.component.html',
    styleUrls: ['./timeline-list.component.scss'],
})
export class TimelineListComponent implements OnInit, OnDestroy {

    @Input() @Defaults(DEFAULT) public config: TimelineListConfig;
    @Input() public entity: XmEntity;
    @Input() public timeLineOptions: any;
    @Input() public limit: number;
    @Input() public params: any;
    @Input() public filter: any;
    public showLoader: boolean = false;
    public moreLoader: boolean = false;
    public timeLines: any = [];
    public totalCount: number;
    public next: any;
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

    public trackId(_index: any, item: any): any {
        return item.id;
    }

    public onNextPage(next: any): void {
        this.moreLoader = true;
        this.timelineService.search(this.getSearchBody({ next })).pipe(
            finalize(() => this.moreLoader = false))
            .subscribe((result) => {
                this.next = result.next;
                const timeLinesArray = result.timelines || [];
                timeLinesArray.forEach((i) => this.processTimeLines(i));
            });
    }

    private load(): void {
        this.showLoader = true;
        this.timelineService.search(this.getSearchBody()).pipe(
            finalize(() => this.showLoader = false))
            // tslint:disable-next-line:no-identical-functions
            .subscribe((result) => {
                this.next = result.next;
                const timeLinesArray = result.timelines || [];
                timeLinesArray.forEach((i) => this.processTimeLines(i));
            });
    }

    private processTimeLines(item: any): any {
        this.tlc = new TimeLineContext(item);
        const respConfigEl = this.timeLineResponseConfig.getResponseConfigItem(this.tlc);
        if (respConfigEl) {
            this.bootstrapItem(item, respConfigEl);
        } else {
            Object.assign(item, { messageData: item.responseBody ? item.responseBody : '' });
            this.timeLines.push(item);
        }
    }

    private bootstrapItem(item: any, config: any): any {
        Object.assign(item, { responseBodyParsed: item.responseBody ? JSON.parse(item.responseBody) : null });
        const templateStringByLang = this.i18nNamePipe.transform(config.template, this.principal);
        const templateString = new Function('item', 'return `' + templateStringByLang + '`;')(item);
        Object.assign(item, { messageData: templateString });
        this.timeLines.push(item);
    }

    private getSearchBody(options: any = {}): any {
        return Object.assign({
            id: this.entity.id,
            limit: this.limit,
            operation: this.currentSearch,
            dateFrom: this.formFilter.dateFrom ? this.formFilter.dateFrom.toJSON() : '',
            dateTo: this.formFilter.dateTo ? this.formFilter.dateTo.toJson() : '',
        }, this.params || {}, options);
    }
}


@NgModule({
    imports: [
        CommonModule,
        LoaderModule,
        XmTranslationModule,
        MatCardModule,
        MatIconModule,
        MatChipsModule,
        MatButtonModule,
    ],
    exports: [TimelineListComponent],
    declarations: [
        TimelineListComponent,
        TimelineCardComponent,
    ],
})
export class TimelineListModule {
    public entry: Type<TimelineListComponent> = TimelineListComponent;
}
