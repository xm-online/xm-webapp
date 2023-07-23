import { Component, ElementRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {
    XmTableFilterButtonDialogControlsComponent,
    XmTableFiltersControlRequestConfig
} from './xm-table-filter-button-dialog-controls.component';
import { MatBadgeModule } from '@angular/material/badge';
import * as _ from 'lodash';
import { cloneDeep } from 'lodash';
import { Defaults, takeUntilOnDestroy, takeUntilOnDestroyDestroy, } from '@xm-ngx/operators';
import { XmTableFilterController } from '../controllers/filters/xm-table-filter-controller.service';
import { MatChipsModule } from '@angular/material/chips';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { FiltersControlValue } from './xm-table-filter-button-dialog-control.component';
import { FormLayoutItem } from '@xm-ngx/components/form-layout';
import { XmInlineControlConfig } from '@xm-ngx/components/inline-control';
import { XmInlineControlDynamic, XmInlineControlDynamicView } from '../../inline-control';
import { XmTableFilterChipsControlComponent } from './xm-table-filter-chips-control.component';

const DEFAULT_CONFIG: XmTableFiltersControlRequestConfig = {
    submitInvalidForm: false,
    isOnlyExpand: null,
    filters: [],
    chips: [],
    filtersClass: '',
};

export interface XmTableFilterInlineFilter {
    title: Translate,
    config: FormLayoutItem,
    inlineConfig: XmInlineControlConfig,
    value: string,
    name: string,
}

@Component({
    selector: 'xm-table-filter-chips',
    standalone: true,
    host: { class: 'xm-table-filter-chips' },
    template: `
        <div class="filter-container" #elementRef>
            <mat-chip-listbox class="chip-listbox" [selectable]="false" [multiple]="true">
                <mat-chip-option *ngFor="let filter of activeFilters"
                                 (removed)="remove(filter)"
                                 [removable]="true"
                                 color="accent"
                                 selected
                                 class="chip-option">
                    <xm-table-filter-chips-control [config]="filter.inlineConfig"
                                                   [value]="filter.value"
                                                   (valueChange)="change(filter)"></xm-table-filter-chips-control>
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
                    <xm-table-filter-chips-control [config]="filter.inlineConfig"
                                                   [value]="filter.value"
                                                   (valueChange)="change(filter)"></xm-table-filter-chips-control>
                    <mat-icon matChipRemove>cancel</mat-icon>
                </mat-chip-option>
            </mat-chip-listbox>
        </mat-menu>
    `,
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
    ],
})
export class XmTableFilterChipsComponent {
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

    public change(filter: XmTableFilterInlineFilter): void {
        const copy = cloneDeep(this.value);
        copy[filter.name] = filter.value;
        this.entitiesRequestBuilder.set(copy);
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
                const overrideView =
                    this.config.chips.find(i => i.name === config.name)
                    || { selector: '@xm-ngx/components/text', config: {} } as XmInlineControlDynamicView<unknown, unknown>;
                const inlineConfig: XmInlineControlConfig = {
                    view: overrideView as XmInlineControlDynamicView<unknown, unknown>,
                    edit: config as XmInlineControlDynamic<unknown>,
                };
                return {
                    config: config,
                    inlineConfig: inlineConfig,
                    value: this.value[config.name],
                    title: config['title'] || config.name,
                    name: config.name,
                } as XmTableFilterInlineFilter;
            });
    }

}
