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
import _ from 'lodash';

@Component({
    selector: 'xm-table-filter-inline',
    standalone: true,
    template: `
        <div class="m-3">
            <xm-filters-control-request [options]="config"
                                        [request]="value"
                                        (requestChange)="requestChange($event)"
                                        #formContainer
                                        class="xm-filters-control"
            >
            </xm-filters-control-request>

            <div class="d-flex justify-content-end">
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
        </div>
    `,
    imports: [
        MatButtonModule,
        XmTableFilterButtonDialogControlsComponent,
        XmTranslationModule
    ],
})
export class XmTableFilterInlineComponent implements OnInit, OnDestroy {
    @Input() public config: XmTableFiltersControlRequestConfig;
    @Input() public loading: boolean;

    public value: FiltersControlValue;
    private cacheFilters: FiltersControlValue;
    private DELAY = 400;
    private request$: BehaviorSubject<FiltersControlValue> = new BehaviorSubject<FiltersControlValue>(null);

    private tableFilterController: XmTableFilterController = inject(XmTableFilterController);

    public ngOnInit(): void {
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
