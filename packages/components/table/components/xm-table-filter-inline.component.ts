import { Component, ElementRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {
    XmTableFiltersControlRequestConfig,
    XmTableFiltersControlRequestComponent
} from '@xm-ngx/components/table/components/xm-table-filters-control-request.component';
import { MatBadgeModule } from '@angular/material/badge';
import * as _ from 'lodash';
import { cloneDeep } from 'lodash';
import { Defaults, takeUntilOnDestroy, takeUntilOnDestroyDestroy, } from '@xm-ngx/shared/operators';
import {
    XmTableFilterController
} from '@xm-ngx/components/table/controllers/filters/xm-table-filter-controller.service';
import { MatChipsModule } from '@angular/material/chips';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { FiltersControlValue } from './xm-table-filters-control.component';
import {
    XmTableFilterControlAsChipComponent
} from '@xm-ngx/components/table/components/xm-table-filter-control-as-chip.component';
import { FormLayoutItem } from '@xm-ngx/components/form-layout';

const DEFAULT_CONFIG: XmTableFiltersControlRequestConfig = {
    submitInvalidForm: false,
    isOnlyExpand: null,
    filters: [],
    filtersClass: '',
};

export interface XmTableFilterInlineFilter {
    title: Translate,
    config: FormLayoutItem,
    value: string,
    name: string,
}

@Component({
    selector: 'xm-table-filter-inline',
    standalone: true,
    host: { class: 'xm-table-filter-inline' },
    template: `
        <div class="filter-container" #elementRef>
            <mat-chip-listbox class="chip-listbox" [selectable]="false" [multiple]="true">
                <mat-chip-option *ngFor="let filter of activeFilters"
                                 (removed)="remove(filter)"
                                 [removable]="true"
                                 color="accent"
                                 selected
                                 class="chip-option">
                    <xm-table-filter-control-as-chip [config]="filter.config"
                                                     [value]="filter.value"></xm-table-filter-control-as-chip>
                    <mat-icon matChipRemove>cancel</mat-icon>
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
                                 (removed)="remove(filter)"
                                 [removable]="true"
                                 selected
                                 color="accent"
                                 class="chip-option">
                    <xm-table-filter-control-as-chip [config]="filter.config"
                                                     [value]="filter.value"></xm-table-filter-control-as-chip>
                    <mat-icon matChipRemove>cancel</mat-icon>
                </mat-chip-option>
            </mat-chip-listbox>
        </mat-menu>
    `,
    styles: [`
        :host(.xm-table-filter-inline) {
            display: flex;
            flex-grow: 1;
            min-width: 0;
        }

        :host(.xm-table-filter-inline) button {
            text-transform: uppercase;
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
        MatMenuModule,
        XmTableFilterControlAsChipComponent,
    ],
})
export class XmTableFilterInlineComponent {
    public value: FiltersControlValue = {};
    public activeFilters: XmTableFilterInlineFilter[] = [];
    public hiddenFilters: XmTableFilterInlineFilter[] = [];
    @Input() @Defaults(DEFAULT_CONFIG) public config: XmTableFiltersControlRequestConfig;

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

    public remove(filter: XmTableFilterInlineFilter): void {
        const copy = cloneDeep(this.value);
        delete copy[filter.name];
        this.entitiesRequestBuilder.set(copy);
    }

    public removeAll(): void {
        this.entitiesRequestBuilder.set({});
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
        return this.config.filters
            .filter(i => !!this.value[i.name])
            .map((config) => {
                return {
                    config: config,
                    value: this.value[config.name],
                    title: config['title'] || config.name,
                    name: config.name,
                } as XmTableFilterInlineFilter;
            });
    }

}
