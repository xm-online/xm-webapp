import { AfterViewInit, Component, ElementRef, inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { NgIf } from '@angular/common';
import _ from 'lodash';
import { XmEmptyPipe } from '@xm-ngx/pipes';
import { XmEventManagerService } from '@xm-ngx/core';

@Component({
    selector: 'xm-table-filter-inline',
    standalone: true,
    template: `
        <ng-container *ngIf="isFilterVisible">
            <ng-container *ngIf="!(config?.filters | xmEmpty)">
                <div class="m-3 d-flex filter-holder">
                    <div #collapse class="filters-collapse w-100">
                        <div #collapseInner class="filters-collapse__inner">
                            <xm-filters-control-request
                                [options]="config"
                                [request]="value"
                                (requestChange)="requestChange($event)"
                                (validStatusChange)="setValid($event)"
                                #formContainer
                                class="w-100"
                            >
                            </xm-filters-control-request>
                        </div>
                    </div>

                    <div *ngIf="!config?.isOnlyExpand" class="ms-auto xm-filters-btn">
                        <button (click)="toggleExpand()"
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
                        {{ 'table.filter.button.reset' | xmTranslate }}
                    </button>

                    <button mat-button
                            mat-raised-button
                            color="primary"
                            [disabled]="formContainer.disabled || !isValid"
                            (click)="submit()">
                        {{ (config?.searchFilterBtnText || 'table.filter.button.search') | xmTranslate }}
                    </button>
                </div>
            </ng-container>
        </ng-container>
    `,
    styles: [ `
        .filter-holder {
            overflow: hidden;
            min-height: 4.6rem;
        }

        /**
         * JS-driven height collapse instead of Angular's [@bodyExpansion] or a CSS
         * grid-template-rows (0fr/1fr) transition. Safari does not reliably animate
         * grid-template-rows and, on production builds, does not advance Angular's
         * Web Animations API driven transitions until an unrelated user event drives
         * the frame loop - leaving the panel stuck closed. Animating an explicit pixel
         * height (measured from scrollHeight) is composited natively and works in every
         * browser including Safari.
         */
        .filters-collapse {
            overflow: hidden;
            height: 4.6rem;
            transition: height 225ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .filters-collapse__inner {
            min-height: 0;
        }
    ` ],
    imports: [
        MatButtonModule,
        XmTableFilterButtonDialogControlsComponent,
        XmEmptyPipe,
        NgIf,
        MatIconModule,
        XmTranslatePipe,
    ],
})
export class XmTableFilterInlineComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() public config: XmTableFiltersControlRequestConfig;
    @Input() public loading: boolean;

    @ViewChild('collapse') private collapseRef: ElementRef<HTMLElement>;
    @ViewChild('collapseInner') private collapseInnerRef: ElementRef<HTMLElement>;

    public value: FiltersControlValue;
    public isValid = null;
    public filterExpand: boolean = true;
    private viewInitialized: boolean = false;
    private collapseRafId: number | null = null;
    private collapseTransitionEnd: (() => void) | null = null;
    private cacheFilters: FiltersControlValue;
    private DELAY = 400;
    private request$: Subject<FiltersControlValue> = new Subject<FiltersControlValue>();

    private tableFilterController: XmTableFilterController = inject(XmTableFilterController);
    public isFilterVisible: boolean = true;
    private requestOnlyOnSubmit: boolean = false;

    private readonly eventManagerService = inject(XmEventManagerService);

    public ngOnInit(): void {
        this.requestOnlyOnSubmit = this.config?.requestOnlyOnSubmit;
        this.isFilterVisible = !this.config?.hideDefaultFilters;
        this.initFilers();
    }

    public ngAfterViewInit(): void {
        this.viewInitialized = true;
        this.applyExpandState(false);
    }

    public ngOnDestroy(): void {
        this.cancelPendingTransition();
        takeUntilOnDestroyDestroy(this);
    }

    public initFilers(): void {
        this.filterExpand = !this.config.isOnlyExpand;
        this.value = this.tableFilterController.get();
        if (this.config.autoExpandOnSelection && Object.keys(this.value).length > 0) {
            this.filterExpand = false;
        }
        this.tableFilterController.filterVisibility$
            .pipe(takeUntilOnDestroy(this))
            .subscribe((res) => {
                this.isFilterVisible = res;
                this.setExpand(!res);
            });

        this.setValueOnChangeFilter();
        this.submitOnChangeFilter();
    }

    public toggleExpand(): void {
        this.setExpand(!this.filterExpand);
    }

    private setExpand(collapsed: boolean): void {
        if (this.filterExpand === collapsed) {
            return;
        }
        this.filterExpand = collapsed;
        this.applyExpandState(this.viewInitialized);
    }

    private applyExpandState(animate: boolean): void {
        const el = this.collapseRef?.nativeElement;
        const inner = this.collapseInnerRef?.nativeElement;
        if (!el || !inner) {
            return;
        }

        this.cancelPendingTransition(el);

        if (!animate) {
            el.style.transition = 'none';
            el.style.height = this.filterExpand ? '' : 'auto';
            void el.offsetHeight;
            el.style.transition = '';
            return;
        }

        if (this.filterExpand) {
            el.style.height = `${inner.scrollHeight}px`;
            void el.offsetHeight;
            this.collapseRafId = requestAnimationFrame(() => {
                this.collapseRafId = null;
                el.style.height = '';
            });
        } else {
            el.style.height = `${inner.scrollHeight}px`;
            const onEnd = (): void => {
                el.style.height = 'auto';
                el.removeEventListener('transitionend', onEnd);
                this.collapseTransitionEnd = null;
            };
            this.collapseTransitionEnd = onEnd;
            el.addEventListener('transitionend', onEnd);
        }
    }

    private cancelPendingTransition(el?: HTMLElement): void {
        const node = el ?? this.collapseRef?.nativeElement;
        if (this.collapseRafId !== null) {
            cancelAnimationFrame(this.collapseRafId);
            this.collapseRafId = null;
        }
        if (this.collapseTransitionEnd && node) {
            node.removeEventListener('transitionend', this.collapseTransitionEnd);
            this.collapseTransitionEnd = null;
        }
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
        this.eventManagerService.broadcast({ name: 'TABLE_CLEAR_ALL_FILTERS' });
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
