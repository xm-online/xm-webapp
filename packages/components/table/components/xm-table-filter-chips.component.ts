import {
    AfterViewInit,
    Component,
    ElementRef,
    inject,
    Input,
    OnDestroy,
    QueryList,
    ViewChild,
    ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { XmTableFiltersControlRequestConfig } from './xm-table-filter-button-dialog-controls.component';
import { MatBadgeModule } from '@angular/material/badge';
import * as _ from 'lodash';
import { cloneDeep, flatten, isArray } from 'lodash';
import { Defaults, takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { XmTableFilterController } from '../controllers';
import { MatChipsModule } from '@angular/material/chips';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { FiltersControlValue } from './xm-table-filter-button-dialog-control.component';
import { FormLayoutItem } from '@xm-ngx/components/form-layout';
import {
    XmInlineControlConfig,
    XmInlineControlDynamic,
    XmInlineControlDynamicView,
} from '@xm-ngx/components/inline-control';
import { XmTableFilterChipsControlComponent } from './xm-table-filter-chips-control.component';
import { Primitive } from '@xm-ngx/interfaces';
import { XmEventManagerService } from '@xm-ngx/core';

export interface XmTableInlineFilterFormLayoutItem extends FormLayoutItem {
    removable?: boolean;
}

export interface XmTableInlineFilterChipsConfig extends XmTableFiltersControlRequestConfig {
    filters: XmTableInlineFilterFormLayoutItem[];
    chips: XmTableInlineFilterFormLayoutItem[];
}

const DEFAULT_CONFIG: XmTableInlineFilterChipsConfig = {
    submitInvalidForm: false,
    isOnlyExpand: null,
    filters: [],
    chips: [],
    filtersClass: '',
};

export interface XmTableFilterInlineFilter {
    title: Translate | Record<string, Translate>;
    config: FormLayoutItem;
    inlineConfig: XmInlineControlConfig;
    value: string | string[];
    removable: boolean;
    name: string;
    disabled?: boolean;
}

@Component({
    selector: 'xm-table-filter-chips',
    standalone: true,
    host: { class: 'xm-table-filter-chips' },
    template: `
        <div class="filter-container ms-1" #filterContainer>
            <div class="filter-holder" #filterHolder>
            <mat-chip-listbox class="chip-listbox" [selectable]="false" [multiple]="true">
                <mat-chip-option *ngFor="let filter of activeFilters"
                                 (removed)="remove(filter)"
                                 [removable]="filter.removable"
                                 color="accent"
                                 #filterItem
                                 selected
                                 class="chip-option">
                    <xm-table-filter-chips-control [config]="filter.inlineConfig"
                                                   [value]="filter.title"
                                                   [disabled]="filter.disabled"
                                                   (valueChange)="change(filter.name, $event)"></xm-table-filter-chips-control>
                    <mat-icon matChipRemove *ngIf="filter.removable">cancel</mat-icon>
                </mat-chip-option>
            </mat-chip-listbox>
            </div>
        </div>

        <div #filterChipsActions>
            <button
                class="btn-clear-all ms-2"
                mat-button
                *ngIf="activeFilters?.length"
                (click)="removeAll()"
            >
                {{'table.filter.button.clearAll' | translate}}
            </button>

            <button
                class="ms-1"
                mat-button
                *ngIf="hiddenFilters?.length"
                [matMenuTriggerFor]="hiddenChips"
                [matBadge]="hiddenFilters?.length"
            >
                {{'table.filter.button.more' | translate}}
            </button>

            <mat-menu #hiddenChips>
                <mat-chip-listbox class="chip-listbox ps-1 pe-1" [selectable]="false" [multiple]="true">
                    <mat-chip-option *ngFor="let filter of hiddenFilters"
                                     (removed)="remove(filter)"
                                     [removable]="filter.removable"
                                     selected
                                     color="accent"
                                     class="chip-option">
                        <xm-table-filter-chips-control [config]="filter.inlineConfig"
                                                       [value]="filter.title"
                                                       [disabled]="filter.disabled"
                                                       (valueChange)="change(filter.name, $event)"></xm-table-filter-chips-control>
                        <mat-icon matChipRemove *ngIf="filter.removable">cancel</mat-icon>
                    </mat-chip-option>
                </mat-chip-listbox>
            </mat-menu>
        </div>
    `,
    styles: [`
        :host(.xm-table-filter-chips) {
            display: flex;
            justify-content: space-between;
            flex-grow: 1;
            min-width: 0;
        }

        :host(.xm-table-filter-chips) button {
            text-transform: uppercase;
        }

        ::ng-deep .xm-table-filter-chips .mdc-evolution-chip-set__chips {
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
            width: 100%;
            overflow: hidden;
        }
        .filter-holder{
            width:100%;
        }
    `],
    imports: [
        CommonModule,
        MatButtonModule,
        MatBadgeModule,
        MatChipsModule,
        XmTranslationModule,
        MatIconModule,
        MatMenuModule,
        XmTableFilterChipsControlComponent,
        XmTranslationModule,
    ],
})
export class XmTableFilterChipsComponent implements AfterViewInit, OnDestroy {
    public value: FiltersControlValue = {};
    public activeFilters: XmTableFilterInlineFilter[] = [];
    public hiddenFilters: XmTableFilterInlineFilter[] = [];
    @Input() @Defaults(DEFAULT_CONFIG) public config: XmTableInlineFilterChipsConfig;
    @ViewChild('filterHolder') public filterHolder: ElementRef<HTMLElement>;

    @ViewChild('filterContainer') public filterContainer: ElementRef<HTMLElement>;
    @ViewChild('filterChipsActions') public filterChipsActions: ElementRef<HTMLElement>;
    @ViewChildren('filterItem', { read: ElementRef }) public filterItems: QueryList<ElementRef<HTMLElement>>;

    private readonly eventManagerService = inject(XmEventManagerService);

    constructor(
        protected entitiesRequestBuilder: XmTableFilterController,
    ) {}

    public ngAfterViewInit(): void {
        this.entitiesRequestBuilder.change$().pipe(
            takeUntilOnDestroy(this),
        ).subscribe((value) => {
            if (_.isEqual(value, this.value)) {
                return;
            }
            this.value = cloneDeep(value);

            const chipsFilters = this.getChipsFilters();
            this.activeFilters = chipsFilters;

            // TODO:WORKAROUND: Wait until filters create and hide the rest
            setTimeout(() => {
                this.setFilters(chipsFilters);
            }, 1);
        });
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public change(key: string, value: any): void {
        const copy = cloneDeep(this.value);
        copy[key] = value;
        this.entitiesRequestBuilder.set(copy);
    }

    public remove(filter: XmTableFilterInlineFilter): void {
        const copy = cloneDeep(this.value);
        const filterOptions = isArray(copy[filter.name]) && (copy[filter.name] as Primitive[]).filter(value => value !== filter.value);
        if (filterOptions?.length) {
            copy[filter.name] = filterOptions;
        } else {
            delete copy[filter.name];
        }
        this.entitiesRequestBuilder.set(copy);
    }

    public removeAll(): void {
        this.entitiesRequestBuilder.clearExceptFixedFilters(this.config.filters);
        this.eventManagerService.broadcast({ name: 'TABLE_FILTER_CHIPS_CLEAR_ALL' });
    }

    private setFilters(chipsFilters: XmTableFilterInlineFilter[]): void {
        const slicedIndex = this.calculateSliceIndex();

        if (slicedIndex) {
            this.hiddenFilters = chipsFilters.slice(slicedIndex);
            this.activeFilters = chipsFilters.slice(0, slicedIndex);
        } else {
            this.hiddenFilters = [];
            this.activeFilters = chipsFilters;
        }
    }

    private calculateSliceIndex(): number {
        if (!this.filterContainer) {
            return -1;
        }

        const filterItems = this.filterItems.toArray();
        const filterContainer = this.filterContainer.nativeElement;
        const filterHolder = this.filterHolder.nativeElement;
        const holderWidth = parseInt(window.getComputedStyle(filterHolder).width);
        const filterContainerStyle = window.getComputedStyle(filterContainer);

        const marginOffset = parseInt(filterContainerStyle?.marginLeft) + parseInt(filterContainerStyle.marginRight);

        const paddingOffset = parseInt(filterContainerStyle.paddingLeft) + parseInt(filterContainerStyle.paddingRight);

        const allGaps = paddingOffset + marginOffset;

        let chipsWidth = allGaps;
        let slicedIndex = 0;

        filterItems.forEach((item, i) => {
            const itemWidth = item.nativeElement.getBoundingClientRect().width;

            chipsWidth += itemWidth;

            if (chipsWidth > holderWidth && !slicedIndex) {
                slicedIndex = i;
            }
        });

        return slicedIndex;
    }

    private getChipsFilters(): XmTableFilterInlineFilter[] {
        return flatten(this.config.filters
            .filter(i => !!this.value[i.name])
            .map((config) => {
                const overrideView =
                    this.config.chips.find(i => i.name === config.name)
                    || { selector: '@xm-ngx/components/text', config: {} } as XmInlineControlDynamicView<unknown, unknown>;

                const inlineConfig: XmInlineControlConfig = {
                    view: overrideView as XmInlineControlDynamicView<unknown, unknown>,
                    edit: config as XmInlineControlDynamic<unknown>,
                };
                const tableFilterInlineFilter = {
                    config,
                    inlineConfig,
                    removable: !config?.removable,
                    name: config.name,
                    disabled: overrideView.disabled || config.disabled,
                };
                if(isArray(this.value[config.name])){
                    return (this.value[config.name] as Primitive[]).map(value => {
                        let title;
                        if(config['title']) {
                            title = config['title'][value] ? config['title'][value] : config.name;
                        } else {
                            title = value || config.name;
                        }
                        return {
                            ...tableFilterInlineFilter,
                            value,
                            title,
                        } as XmTableFilterInlineFilter;
                    });
                }

                return {
                    ...tableFilterInlineFilter,
                    value: this.value[config.name],
                    title: this.value[config.name],
                } as XmTableFilterInlineFilter;
            }));
    }

}
