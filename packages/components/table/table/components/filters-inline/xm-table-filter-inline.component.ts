import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {
    FiltersControlRequestComponent
} from '@xm-ngx/components/table/table/components/filters-control-request/filters-control-request.component';
import { MatBadgeModule } from '@angular/material/badge';
import {
    FiltersControlRequestOptions
} from '@xm-ngx/ext/entity-webapp-ext/module/entities-filter-widget/filters-control-request/filters-control-request.component';
import { cloneDeep, defaultsDeep } from 'lodash';
import {
    FiltersControlValue
} from '@xm-ngx/ext/entity-webapp-ext/module/entities-filter-widget/filters-control/filters-control.component';
import { merge, Subject } from 'rxjs';
import {
    PageEntitiesRequestService
} from '@xm-ngx/ext/entity-webapp-ext/module/page-entity-widget/request/page-entities-request.service';
import {
    PageEntitiesStore
} from '@xm-ngx/ext/entity-webapp-ext/module/page-entity-widget/entities/page-entities-store';
import {
    EntitiesFilterStoreService
} from '@xm-ngx/ext/entity-webapp-ext/module/entities-filter-store-widget/entities-filter-store.service';
import { debounceTime, delay, map } from 'rxjs/dist/types/operators';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import {
    cloneDeepWithoutUndefined
} from '@xm-ngx/ext/entity-webapp-ext/module/page-entity-widget/request/page-entities-request-builder.service';
import * as _ from 'lodash';

const DEFAULT_CONFIG: FiltersControlRequestOptions = {
    submitInvalidForm: false,
    isOnlyExpand: null,
    filters: [],
    filtersClass: '',
};


@Component({
    selector: 'xm-table-filter-inline',
    standalone: true,
    host: { class:'xm-table-filter-inline' },
    template: `
        <div class="filter-container" #elementRef>
            <xm-filters-control-request [options]="config">
            </xm-filters-control-request>
        </div>

        <button mat-button
                [matBadge]=""
                *ngIf="checkOverflow()">
            More
        </button>
    `,
    styles: [`
        :host(.xm-table-filter-inline) {
            display: flex;
            flex-grow: 1;
            /* TODO:WORKAROUND: fix flex calculation */
            min-width: 0;
        }

        ::ng-deep .xm-form-layout {
            display: flex;
            flex-directon: row;
            gap: .5rem;
        }

        .filter-container {
            display: block;
            overflow: clip;
            width: calc(100% - 100px);
        }
    `],
    imports: [
        NgIf,
        MatButtonModule,
        FiltersControlRequestComponent,
        MatBadgeModule,
    ],
})
export class XmTableFilterInlineComponent {
    @ViewChild('elementRef', {static: true}) public rt: ElementRef;

    // @Input() public config: any;

    public checkOverflow(): boolean {
        const element = this.rt.nativeElement;
        return element.offsetHeight < element.scrollHeight
            || element.offsetWidth < element.scrollWidth;
    }

    @ViewChild(FiltersControlRequestComponent, { static: true })
    public filtersControlRequestCmp: FiltersControlRequestComponent;

    public get config(): FiltersControlRequestOptions {
        return this._config;
    }

    @Input()
    public set config(value: FiltersControlRequestOptions) {
        this._config = defaultsDeep(value, DEFAULT_CONFIG);
        this.filterExpand = !value.isOnlyExpand;
    }

    protected _config: FiltersControlRequestOptions = DEFAULT_CONFIG;

    public filterExpand: boolean = true;
    public disabled: boolean;
    public loading: boolean;
    public value: FiltersControlValue;
    protected search$: Subject<boolean> = new Subject<boolean>();
    protected request: FiltersControlValue = null;

    public clear$: Subject<void> = new Subject();

    public requestDefault: FiltersControlValue;
    public hasFilters = false;

    constructor(
        protected entitiesRequestBuilder: PageEntitiesRequestService<FiltersControlValue>,
        protected entitiesService: PageEntitiesStore,
        protected entitiesFilterStoreService: EntitiesFilterStoreService,
    ) {
        this.entitiesService.loading$().pipe(
            delay(0),
            takeUntilOnDestroy(this),
        ).subscribe((loading) => this.loading = loading);

    }

    public onSearch(req = this.request): void {
        // Check if it is a first initialisation
        if (this.request !== null) {
            // Reset page index to first page
            req.pageIndex = 0;
        }
        this.request = req;

        if (!this.requestDefault) {
            this.requestDefault = cloneDeep(req);
        }

        this.search$.next(true);

        if (this.config?.filterStoreKey) {
            this.entitiesFilterStoreService.put(this.config.filterStoreKey, cloneDeepWithoutUndefined(req));
        }
    }

    public onClear(): void {
        this.clear$.next();
        this.filtersControlRequestCmp?.filtersControl?.clearForm();
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public ngOnInit(): void {
        this.entitiesRequestBuilder.change$().pipe(
            takeUntilOnDestroy(this),
        ).subscribe((value) => {
            if (_.isEqual(value, this.request)) {
                return;
            }
            this.value = value;
        });

        merge(
            this.search$.pipe(map(() => this.request)),
            this.clear$.pipe(map(() => this.requestDefault)),
        ).pipe(
            takeUntilOnDestroy(this),
            debounceTime(700),
        ).subscribe((res) => {
            this.entitiesRequestBuilder.update(res);
            this.entitiesService.reload();
        });
    }

}
