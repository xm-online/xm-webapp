import { Component, ElementRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {
    XmTableFilterButtonDialogControlsComponent,
    XmTableFiltersControlRequestConfig
} from './xm-table-filter-button-dialog-controls.component';
import { MatBadgeModule } from '@angular/material/badge';
import * as _ from 'lodash';
import { cloneDeep, flatten, isArray } from 'lodash';
import { Defaults, takeUntilOnDestroy, takeUntilOnDestroyDestroy, } from '@xm-ngx/operators';
import { XmTableFilterController } from '../controllers/filters/xm-table-filter-controller.service';
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
}

@Component({
    selector: 'xm-table-filter-chips',
    standalone: true,
    host: { class: 'xm-table-filter-chips' },
    template: `
        <div class="filter-container ms-1" #elementRef>
            <mat-chip-listbox class="chip-listbox" [selectable]="false" [multiple]="true">
                <mat-chip-option *ngFor="let filter of activeFilters"
                                 (removed)="remove(filter)"
                                 [removable]="filter.removable"
                                 color="accent"
                                 selected
                                 class="chip-option">
                    <xm-table-filter-chips-control [config]="filter.inlineConfig"
                                                   [value]="filter.title"
                                                   [disabled]="filter.config?.disabled"
                                                   (valueChange)="change(filter.name, $event)"></xm-table-filter-chips-control>
                    <mat-icon matChipRemove *ngIf="filter.removable">cancel</mat-icon>
                </mat-chip-option>
            </mat-chip-listbox>
        </div>

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
                                 (removed)="remove(filter.value)"
                                 [removable]="filter.removable"
                                 selected
                                 color="accent"
                                 class="chip-option">
                    <xm-table-filter-chips-control [config]="filter.inlineConfig"
                                                   [value]="filter.title"
                                                   [disabled]="filter.config?.disabled"
                                                   (valueChange)="change(filter.name, $event)"></xm-table-filter-chips-control>
                    <mat-icon matChipRemove *ngIf="filter.removable">cancel</mat-icon>
                </mat-chip-option>
            </mat-chip-listbox>
        </mat-menu>
    `,
    styles: [`
        :host(.xm-table-filter-chips) {
            display: flex;
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
            display: block;
            overflow: clip;
            width: calc(100% - 100px);
        }
    `],
    imports: [
        CommonModule,
        MatButtonModule,
        XmTableFilterButtonDialogControlsComponent,
        MatBadgeModule,
        MatChipsModule,
        XmTranslationModule,
        MatIconModule,
        MatMenuModule,
        XmTableFilterChipsControlComponent,
        XmTranslationModule,
    ],
})
export class XmTableFilterChipsComponent {
    public value: FiltersControlValue = {};
    public activeFilters: XmTableFilterInlineFilter[] = [];
    public hiddenFilters: XmTableFilterInlineFilter[] = [];
    @Input() @Defaults(DEFAULT_CONFIG) public config: XmTableInlineFilterChipsConfig;

    constructor(
        protected entitiesRequestBuilder: XmTableFilterController,
        private elementRef: ElementRef<HTMLElement>,
    ) {
    }

    public ngOnInit(): void {
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
            }, 110);
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
    }

    private setFilters(chipsFilters: XmTableFilterInlineFilter[]): void {
        const container = this.elementRef.nativeElement;
        const chips = container.querySelectorAll('.chip-option');
        const filterContainer = container.querySelector<HTMLElement>('.filter-container');

        const containerWidth = filterContainer.getBoundingClientRect().width;

        let chipsWidth = 0;
        let slicedIndex = 0;
        chips.forEach((item, i) => {
            const itemWidth = item.getBoundingClientRect().width;
            chipsWidth += itemWidth;
            if (chipsWidth > containerWidth && !slicedIndex) {
                slicedIndex = i;
            }
        });

        if (slicedIndex) {
            this.hiddenFilters = chipsFilters.slice(slicedIndex);
            this.activeFilters = chipsFilters.slice(0, slicedIndex);
        } else {
            this.hiddenFilters = [];
            this.activeFilters = chipsFilters;
        }
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
                };
                if(isArray(this.value[config.name])){
                    return (this.value[config.name] as Primitive[]).map(value => {
                        let title;
                        if(config['title']) {
                            title = config['title'][value] ? config['title'][value] : config.name;
                        } else {
                            title = config['title'] || config.name;
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
