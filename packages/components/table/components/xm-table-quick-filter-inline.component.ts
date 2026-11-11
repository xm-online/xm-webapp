import { Component, ElementRef, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { XmTableFilterController } from '../controllers/filters/xm-table-filter-controller.service';
import { XmTableFiltersControlRequestConfig } from './xm-table-filter-button-dialog-controls.component';
import { FiltersControlValue } from './xm-table-filter-button-dialog-control.component';
import { XmTranslatePipe } from '@xm-ngx/translation';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { xmExpansionAnimations } from '@xm-ngx/components/animations';
import { NgIf } from '@angular/common';
import _ from 'lodash';
import { XmEmptyPipe } from '@xm-ngx/pipes';
import { XmTableQuickFilterControlsComponent } from '../components/xm-table-quick-filter-controls.component';
import { XmTableInlineFilterFormLayoutItem } from './xm-table-filter-chips.component';

@Component({
    selector: 'xm-table-quick-filter-inline',
    standalone: true,
    template: `
        @let isOnlyExpand = config?.isOnlyExpand;

        <div class="d-flex quick-filter-block" [class]="isOnlyExpand ? 'is-only-expand' : ''"
             [style]="config?.quickFilterInlineContainerStyle">
            <span *ngIf="!isOnlyExpand" class="xm-filters-btn">
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
                        class="quick-filters-control"
                        [class.quick-filters-control-minimized]="!filterExpand"
                        [style.max-height.px]="filterExpand ? null : firstRowHeight">
                    </xm-quick-filters-control-request>

                    @if (!config?.hideResetButton && hasActiveFilters) {
                        <button mat-button
                                class="me-3"
                                (click)="reset()">
                            {{ 'table.filter.button.reset' | xmTranslate }}
                        </button>
                    }
                </div>
            </ng-container>
        </div>
    `,
    styles: [`
        .quick-filters-control {
            display: block;
            min-width: 0;
        }

        .quick-filters-control-minimized {
            overflow: hidden;
        }

        .filter-holder {
            overflow: hidden;
        }

        .quick-filter-block {
            display: flex;
            align-items: center;
            justify-content: flex-start;

            &.is-only-expand {
                padding: 0 12px;
            }
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
        XmEmptyPipe,
        NgIf,
        MatIconModule,
        XmTableQuickFilterControlsComponent,
        XmTranslatePipe,
        XmEmptyPipe,
    ],
    animations: [
        xmExpansionAnimations.bodyExpansion,
    ],
})
export class XmTableQuickFilterInlineComponent implements OnInit, OnDestroy {
    @Input() public config: XmTableFiltersControlRequestConfig;
    @Input() public loading: boolean;
    public hasActiveFilters = false;

    public value: FiltersControlValue;

    public filterExpand: boolean = true;
    public firstRowHeight = 42;
    private cacheFilters: FiltersControlValue;
    private DELAY = 400;
    private request$: Subject<FiltersControlValue> = new Subject<FiltersControlValue>();

    private tableFilterController: XmTableFilterController = inject(XmTableFilterController);
    private host = inject<ElementRef<HTMLElement>>(ElementRef);
    public ngOnInit(): void {
        if (this.config?.hideDefaultFilters) {
            this.tableFilterController.toggleFilterVisibility(false);
        }

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
        const filters = [...(this.config.filters ?? []), ...(this.config.quickFilters?? [])];
        this.tableFilterController.clearExceptFixedFilters(filters);
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
        if (this.filterExpand) {
            this.firstRowHeight = this.measureFirstRowHeight();
        }
        this.filterExpand = !this.filterExpand;
    }

    private measureFirstRowHeight(): number {
        const first = this.host.nativeElement.querySelector<HTMLElement>('.quick-form-layout > *');
        return first?.offsetHeight ?? 42;
    }

    protected checkActiveFilters(): void {
        const quickFilters = this.config?.quickFilters ?? [];
        const requiredQuickFilterKeys = new Set(
            quickFilters
                .filter((f: XmTableInlineFilterFormLayoutItem) => f.removable === false)
                .map(f => f.name)
        );

        this.hasActiveFilters = !!this.value && Object.entries(this.value).some(
            ([key, filter]) =>
                !requiredQuickFilterKeys.has(key) &&
                (Array.isArray(filter) ? filter.length > 0 : filter != null && filter !== ''));
    }

}
