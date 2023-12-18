import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
    takeUntilOnDestroy,
    takeUntilOnDestroyDestroy
} from '@xm-ngx/operators';
import { XmTableFilterController } from '../controllers/filters/xm-table-filter-controller.service';
import {
    XmTableFilterButtonDialogControlsComponent,
    XmTableFiltersControlRequestConfig,
} from './xm-table-filter-button-dialog-controls.component';
import { FiltersControlValue } from './xm-table-filter-button-dialog-control.component';
import { XmTranslationModule } from '@xm-ngx/translation';
import {
    distinctUntilChanged,
    debounceTime,
    BehaviorSubject
} from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { matExpansionAnimations } from '@angular/material/expansion';
import { NgClass, NgIf } from '@angular/common';
import _ from 'lodash';
import { XmEmptyPipe } from '@xm-ngx/pipes';

@Component({
    selector: 'xm-table-filter-inline',
    standalone: true,
    template: `
        <ng-container *ngIf="!(config?.filters | xmEmpty)">
            <div class="d-flex flex-row justify-content-between">
                <div class="m-3 d-flex filter-holder">
                    <div [@bodyExpansion]="filterExpand ? 'collapsed' : 'expanded'">
                        <xm-filters-control-request [options]="config"
                                                    [request]="value"
                                                    (requestChange)="requestChange($event)"
                                                    #formContainer
                                                    class="xm-filters-control"
                                                    [ngClass]="{'xm-filters-control-hidden': filterExpand}"
                        >
                        </xm-filters-control-request>
                    </div>

                    <div *ngIf="!config?.isOnlyExpand" class="d-flex flex-row xm-filters-btn">
                        <button (click)="filterExpand = !filterExpand"
                                class="align-self-top ms-2"
                                color="accent"
                                mat-icon-button
                                type="button">
                            <mat-icon>filter_list</mat-icon>
                        </button>
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-end me-3 ms-3 mb-3">
                <button mat-button
                        class="me-3"
                        (click)="reset()">
                    {{'table.filter.button.reset' | translate}}
                </button>

                <button mat-button
                        mat-raised-button
                        color="primary"
                        [disabled]="formContainer.disabled"
                        (click)="submit()">
                    {{'table.filter.button.search' | translate}}
                </button>
            </div>
        </ng-container>
    `,
    styles: [`
        .xm-filters-control {
            flex-grow: 1;
            width: 100%;
        }

        .xm-filters-control.xm-filters-control-hidden {
            visibility: visible !important;
        }

        .xm-filters-btn {
            flex-grow: 1;
        }

        .filter-holder {
            width: 100%;
            overflow: hidden;
            min-height: 4.3rem;
        }
    `],
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
    public filterExpand: boolean = true;
    private cacheFilters: FiltersControlValue;
    private DELAY = 400;
    private request$: BehaviorSubject<FiltersControlValue> = new BehaviorSubject<FiltersControlValue>(null);

    private tableFilterController: XmTableFilterController = inject(XmTableFilterController);

    public ngOnInit(): void {
        this.filterExpand = !this.config.isOnlyExpand;
        this.value = this.tableFilterController.get();

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
        this.value = value;

        this.request$.next(this.value);
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
            this.submit();
        });
    }
}
