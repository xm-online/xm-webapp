import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { XmTableFilterController } from '../controllers/filters/xm-table-filter-controller.service';
import {
    XmTableFilterButtonDialogControlsComponent,
    XmTableFiltersControlRequestConfig,
} from './xm-table-filter-button-dialog-controls.component';
import { FiltersControlValue } from './xm-table-filter-button-dialog-control.component';
import { XmTranslationModule } from '@xm-ngx/translation';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { matExpansionAnimations } from '@angular/material/expansion';
import { NgClass, NgIf } from '@angular/common';
import _ from 'lodash';
import { XmEmptyPipe } from '@xm-ngx/pipes';

@Component({
    selector: 'xm-table-filter-inline',
    standalone: true,
    template: `
        <ng-container *ngIf="isFilterVisible">
            <ng-container *ngIf="!(config?.filters | xmEmpty)">
                <div class="m-3 d-flex filter-holder">
                    <xm-filters-control-request
                        [@bodyExpansion]="filterExpand ? 'collapsed' : 'expanded'"
                        [options]="config"
                        [request]="value"
                        (requestChange)="requestChange($event)"
                        (validStatusChange)="setValid($event)"
                        #formContainer
                        class="w-100"
                        [ngClass]="{'xm-filters-control-hidden': filterExpand}"
                    >
                    </xm-filters-control-request>

                    <div *ngIf="!config?.isOnlyExpand" class="ms-auto xm-filters-btn">
                        <button (click)="filterExpand = !filterExpand"
                                class="align-self-top ms-2"
                                color="accent"
                                mat-icon-button
                                type="button">
                            <mat-icon>filter_list</mat-icon>
                        </button>
                    </div>
                </div>
                <div class="d-flex justify-content-end me-3 ms-3 mb-3">
                    <button mat-button
                            class="me-3"
                            (click)="reset()">
                        {{ 'table.filter.button.reset' | translate }}
                    </button>

                    <button mat-button
                            mat-raised-button
                            color="primary"
                            [disabled]="formContainer.disabled || !isValid"
                            (click)="submit()">
                        {{ (config?.searchFilterBtnText || 'table.filter.button.search') | translate }}
                    </button>
                </div>
            </ng-container>
        </ng-container>
    `,
    styles: [ `
        .xm-filters-control-hidden {
            visibility: visible !important;
        }

        .filter-holder {
            overflow: hidden;
            min-height: 4.6rem;
        }
    ` ],
    imports: [
        MatButtonModule,
        XmTableFilterButtonDialogControlsComponent,
        XmTranslationModule,
        XmEmptyPipe,
        NgIf,
        XmTranslationModule,
        MatIconModule,
        NgClass,
    ],
    animations: [
        matExpansionAnimations.bodyExpansion,
    ],
})
export class XmTableFilterInlineComponent implements OnInit, OnDestroy {
    @Input() public config: XmTableFiltersControlRequestConfig;
    @Input() public loading: boolean;

    public value: FiltersControlValue;
    public isValid = null;
    public filterExpand: boolean = true;
    private cacheFilters: FiltersControlValue;
    private DELAY = 400;
    private request$: Subject<FiltersControlValue> = new Subject<FiltersControlValue>();

    private tableFilterController: XmTableFilterController = inject(XmTableFilterController);
    public isFilterVisible: boolean = true;
    private requestOnlyOnSubmit: boolean = false;

    public ngOnInit(): void {
        this.requestOnlyOnSubmit = this.config?.requestOnlyOnSubmit;
        this.isFilterVisible = !this.config?.hideDefaultFilters;
        this.initFilers();
    }


    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public initFilers(): void {
        this.filterExpand = !this.config.isOnlyExpand;
        this.value = this.tableFilterController.get();
        this.tableFilterController.filterVisibility$
            .pipe(takeUntilOnDestroy(this))
            .subscribe((res) => {
                this.isFilterVisible = res;
                this.filterExpand = !res;
            });

        this.setValueOnChangeFilter();
        this.submitOnChangeFilter();
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
            });
    }

    private submitOnChangeFilter(): void {
        this.request$.asObservable().pipe(
            distinctUntilChanged(),
            debounceTime(this.DELAY),
            takeUntilOnDestroy(this)
        ).subscribe(() => {
            if (this.requestOnlyOnSubmit) {
                return;
            }
            this.submit();
        });
    }

    public setValid(event: boolean): void {
        this.isValid = event;

    }
}
