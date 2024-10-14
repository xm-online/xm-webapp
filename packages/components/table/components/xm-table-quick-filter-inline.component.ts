import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { XmTableFilterController } from '../controllers/filters/xm-table-filter-controller.service';
import {
    XmTableFilterButtonDialogControlsComponent,
    XmTableFiltersControlRequestConfig,
} from './xm-table-filter-button-dialog-controls.component';
import { FiltersControlValue } from './xm-table-filter-button-dialog-control.component';
import { XmTranslatePipe } from '@xm-ngx/translation';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { matExpansionAnimations } from '@angular/material/expansion';
import { NgClass, NgIf } from '@angular/common';
import _ from 'lodash';
import { XmEmptyPipe } from '@xm-ngx/pipes';
import { XmTableQuickFilterControlsComponent } from '../components/xm-table-quick-filter-controls.component';

@Component({
    selector: 'xm-table-quick-filter-inline',
    standalone: true,
    template: `
        <div class="d-flex quick-filter-block">
        <span *ngIf="!config?.isOnlyExpand" class="xm-filters-btn">
            <button (click)="toggleFilters()"
                    class="ms-2 mb-2 filter-btn"
                    color="accent"
                    mat-icon-button
                    type="button">
                <mat-icon>filter_list</mat-icon>
            </button>
        </span>
            <ng-container *ngIf="!(config?.quickFilters | xmEmpty)">
                <div class="quick-filter-holder">
                    <xm-quick-filters-control-request
                        [options]="config"
                        [request]="value"
                        (requestChange)="requestChange($event)"
                        #formContainer
                        [ngClass]="{'xm-filters-control-hidden': filterExpand}">
                    </xm-quick-filters-control-request>

                    <button mat-button *ngIf="hasActiveFilters"
                            class="me-3"
                            (click)="reset()">
                        {{ 'table.filter.button.reset' | xmTranslate }}
                    </button>
                </div>
            </ng-container>
        </div>
    `,
    styles: [`
        .xm-filters-control-hidden {
            visibility: visible !important;
        }

        .filter-holder {
            overflow: hidden;
        }

        .quick-filter-block {
            display: flex;
            align-items: center;
            justify-content: flex-start;
        }

        .quick-filter-holder {
            display: flex;
            flex-wrap: wrap;
        }

        .xm-filters-btn {
            align-self: flex-start;

            .filter-btn {
                padding: 0;
                --mdc-icon-button-state-layer-size: 36px;
            }
        }
    `],
    imports: [
        MatButtonModule,
        XmTableFilterButtonDialogControlsComponent,
        XmEmptyPipe,
        NgIf,
        MatIconModule,
        NgClass,
        XmTableQuickFilterControlsComponent,
        XmTranslatePipe,
        XmEmptyPipe,
    ],
    animations: [
        matExpansionAnimations.bodyExpansion,
    ],
})
export class XmTableQuickFilterInlineComponent implements OnInit, OnDestroy {
    @Input() public config: XmTableFiltersControlRequestConfig;
    @Input() public loading: boolean;
    public hasActiveFilters = false;

    public value: FiltersControlValue;

    public filterExpand: boolean = true;
    private cacheFilters: FiltersControlValue;
    private DELAY = 400;
    private request$: Subject<FiltersControlValue> = new Subject<FiltersControlValue>();

    private tableFilterController: XmTableFilterController = inject(XmTableFilterController);
    public isFilterVisible: boolean = false;

    public ngOnInit(): void {
        this.filterExpand = !this.config.isOnlyExpand;
        if (this.config?.hideDefaultFilters) {
            this.tableFilterController.toggleFilterVisibility(false);
        }
        this.tableFilterController.filterVisibility$
            .pipe(takeUntilOnDestroy(this))
            .subscribe(
                isVisible => this.isFilterVisible = isVisible
            );

        this.setValueOnChangeFilter();
        this.submitOnChangeFilter();
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public requestChange(value: FiltersControlValue): void {
        if (!this.cacheFilters) {
            this.cacheFilters = _.mapValues(value, () => null);
        }
        const prevValue = _.merge({}, this.cacheFilters, this.value);

        if (!_.isEqual(prevValue, value)) {
            this.value = value;
            this.request$.next(this.value);
        }
    }

    public submit(): void {
        this.tableFilterController.set(this.value);
    }

    public reset(): void {
        this.tableFilterController.clearExceptFixedFilters(this.config.filters);
    }

    private setValueOnChangeFilter(): void {
        this.tableFilterController.change$()
            .pipe(
                takeUntilOnDestroy(this)
            )
            .subscribe((value: FiltersControlValue) => {
                this.value = _.merge({}, this.cacheFilters, value);
                this.checkActiveFilters();
            });
    }

    private submitOnChangeFilter(): void {
        this.request$.asObservable().pipe(
            distinctUntilChanged(),
            debounceTime(this.DELAY),
            takeUntilOnDestroy(this)
        ).subscribe(() => {
            this.submit();
            this.checkActiveFilters();
        });
    }

    public toggleFilters(): void {
        const currentVisibility = !this.isFilterVisible;
        this.tableFilterController.toggleFilterVisibility(currentVisibility);
    }

    protected checkActiveFilters(): void {
        this.hasActiveFilters = !!this.value && Object.values(this.value).some(
            filter => filter != null && filter !== ''
        );
    }

}
