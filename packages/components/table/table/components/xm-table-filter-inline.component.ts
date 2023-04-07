import { ChangeDetectorRef, Component, ElementRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { XmTableFiltersControlRequestComponent } from '@xm-ngx/components/table/table/components/xm-table-filters-control-request.component';
import { MatBadgeModule } from '@angular/material/badge';
import { FiltersControlRequestOptions } from '@xm-ngx/ext/entity-webapp-ext/module/entities-filter-widget/filters-control-request/filters-control-request.component';
import * as _ from 'lodash';
import { defaultsDeep } from 'lodash';
import { FiltersControlValue } from '@xm-ngx/ext/entity-webapp-ext/module/entities-filter-widget/filters-control/filters-control.component';
import { delay } from 'rxjs';
import { interpolate, takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { XmTableCollectionControllerResolver } from '@xm-ngx/components/table/table';
import { XmTableFilterController } from '@xm-ngx/components/table/table/controllers/filters/xm-table-filter-controller.service';
import { MatChipsModule } from '@angular/material/chips';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {
    ChipsControlConfig,
} from '@xm-ngx/components/table/table/components/chips-control/chips-control.component';

const DEFAULT_CONFIG: FiltersControlRequestOptions = {
    submitInvalidForm: false,
    isOnlyExpand: null,
    filters: [],
    filtersClass: '',
};

export interface XmTableFilterInline {
    title: Translate,
    value: string,
    name?: string,
}

@Component({
    selector: 'xm-table-filter-inline',
    standalone: true,
    host: {class: 'xm-table-filter-inline'},
    template: `
        <button
            class=" me-2"
            mat-raised-button
            *ngIf="activeFilters?.length"
            (click)="removeAll()"
        >
            {{'table.filter.button.reset' | translate}}
        </button>

        <div class="filter-container" #elementRef>
            <mat-chip-listbox class="chip-listbox" [selectable]="false">
                <mat-chip-option *ngFor="let filter of activeFilters"
                                 (removed)="remove(filter)"
                                 [removable]="true"
                                 color="accent"
                                 selected
                                 class="chip-option">
                    {{filter?.title | translate}}: {{filter.value}}
                    <mat-icon matChipRemove>cancel</mat-icon>
                </mat-chip-option>
            </mat-chip-listbox>
        </div>

        <button
            class="ms-1"
            mat-raised-button
            *ngIf="hiddenFilters?.length"
            [matMenuTriggerFor]="hiddenChips"
            [matBadge]="hiddenFilters?.length"
        >
            {{'table.filter.button.more' | translate}}
        </button>

        <mat-menu #hiddenChips>
            <mat-chip-listbox class="chip-listbox ps-1 pe-1" [selectable]="false">
                <mat-chip-option *ngFor="let filter of hiddenFilters"
                                 (removed)="remove(filter)"
                                 [removable]="true"
                                 selected
                                 color="accent"
                                 class="chip-option">
                    {{filter.title | translate}}: {{filter.value}}
                    <mat-icon matChipRemove>cancel</mat-icon>
                </mat-chip-option>
            </mat-chip-listbox>
        </mat-menu>
    `,
    styles: [`
        :host(.xm-table-filter-inline) {
            display: flex;
            flex-grow: 1;
            /* TODO:WORKAROUND: fix flex calculation */
            min-width: 0;
        }

        ::ng-deep .xm-table-filter-inline .mdc-evolution-chip-set__chips {
            flex-wrap: nowrap;
        }

        ::ng-deep .chip-listbox .mdc-evolution-chip__cell--primary,
        ::ng-deep .chip-listbox .mdc-evolution-chip__action--primary,
        ::ng-deep .chip-listbox .mat-mdc-chip-action-label {
            overflow: hidden !important;
            cursor: default;
        }

        .chip-option {
            max-width: 260px;
        }

        .filter-container {
            display: block;
            overflow: clip;
            width: calc(100% - 100px);
        }
    `],
    imports: [
        CommonModule,
        MatButtonModule,
        XmTableFiltersControlRequestComponent,
        MatBadgeModule,
        MatChipsModule,
        XmTranslationModule,
        MatIconModule,
        MatMenuModule
    ],
})
export class XmTableFilterInlineComponent {
    public filterExpand: boolean = true;
    public disabled: boolean;
    public loading: boolean;
    public value: FiltersControlValue;
    protected request: FiltersControlValue = null;

    protected _config: FiltersControlRequestOptions = DEFAULT_CONFIG;

    public get config(): FiltersControlRequestOptions {
        return this._config;
    }

    @Input()
    public set config(value: FiltersControlRequestOptions) {
        this._config = defaultsDeep(value, DEFAULT_CONFIG);
        this.filterExpand = !value.isOnlyExpand;
    }

    public activeFilters: XmTableFilterInline[] = [];
    public hiddenFilters: XmTableFilterInline[] = [];

    constructor(
        protected entitiesRequestBuilder: XmTableFilterController,
        private collectionControllerResolver: XmTableCollectionControllerResolver,
        private elementRef: ElementRef,
        private ref: ChangeDetectorRef
    ) {
    }

    public async ngOnInit(): Promise<void> {
        const controller = await this.collectionControllerResolver.get();

        controller.state$().pipe(
            delay(0),
            takeUntilOnDestroy(this),
        ).subscribe((loading) => this.loading = loading.loading);

        this.entitiesRequestBuilder.change$().pipe(
            takeUntilOnDestroy(this),
        ).subscribe((value) => {
            if (_.isEqual(value, this.request)) {
                return;
            }
            this.value = value as FiltersControlValue;

            const chipsFilters = this.getChipsFilters();
            this.activeFilters = (this.config.filters as any)?.filter(filter =>
                !_.isEmpty(this.value[filter.name]) && filter.name !== this.chipsFiltersConfig?.name)
                .map(filter => {
                    return ({
                        ...filter,
                        title: filter.options?.title,
                        value: this.value[filter.name],
                    });
                });
            this.activeFilters = chipsFilters.concat(this.activeFilters);

            this.setFilters();
        });
    }

    public setFilters(): void {
        this.hiddenFilters = [];
        const container = this.elementRef.nativeElement;
        this.ref.detectChanges();
        const chips = container.querySelectorAll('.chip-option');

        const PADDING_FILTER_CONTAINER = 100;
        let chipsWidth = PADDING_FILTER_CONTAINER;
        let slicedIndex = 0;

        chips.forEach((item, i) => {
            chipsWidth += item.clientWidth;
            if (chipsWidth > container.offsetWidth && !slicedIndex) {
                slicedIndex = i;
            }
        });

        if (slicedIndex) {
            this.hiddenFilters = this.activeFilters.slice(slicedIndex);
            this.activeFilters = this.activeFilters.slice(0, slicedIndex);
        }
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public remove(filter: XmTableFilterInline): void {
        if(filter.name.startsWith('chips')) {
            this.value[this.chipsFiltersConfig?.name] = (this.value[this.chipsFiltersConfig?.name] as string[])
                .filter((value) => !this.isEqualValue(filter.value, value));
        } else {
            this.value[filter.name] = null;
        }

        this.entitiesRequestBuilder.update(this.value);
    }

    public removeAll(): void {
        Object.keys(this.value).forEach(item => {
            this.value[item] = null;
        });
        this.entitiesRequestBuilder.update(this.value);
    }

    private get chipsFiltersConfig(): {
        name: string,
        options: ChipsControlConfig
    } {
        return (this.config.filters as any)
            .find((filter) => !!this.value[filter.name]
                && filter.options?.elasticType === 'chips'
                || filter.name === 'chips'
            );
    }

    private getChipsFilters(): XmTableFilterInline[] {
        const filterChipsValue = this.value[this.chipsFiltersConfig?.name] as string[];

        return filterChipsValue.map((value, i) => {
            const title = this.chipsFiltersConfig?.options?.items
                .find(item => this.isEqualValue(item.value, value))?.title;
            return {
                value,
                title,
                name: 'chips_' + i
            };
        });
    }

    private isEqualValue(filterValue: string, configValue: string): boolean {
        return interpolate(filterValue, null) === interpolate(configValue, null);
    }
}
