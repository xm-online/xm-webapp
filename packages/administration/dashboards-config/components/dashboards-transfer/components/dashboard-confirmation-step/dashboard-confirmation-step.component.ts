import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatList, MatListItem } from '@angular/material/list';
import { filter, map, Observable, tap } from 'rxjs';
import { DashboardWithWidgets } from '@xm-ngx/core/dashboard';
import { startWith } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';

import { DashboardOptionComponent } from '../dashboard-option/dashboard-option.component';
import { DynamicScrollViewportHeight } from '../dynamic-scroll-viewport-height/dynamic-scroll-viewport-height';


@Component({
    selector: 'xm-dashboard-confirmation-step',
    standalone: true,
    imports: [
        AsyncPipe,
        CdkFixedSizeVirtualScroll,
        CdkVirtualForOf,
        CdkVirtualScrollViewport,
        DashboardOptionComponent,
        MatList,
        MatListItem,

    ],
    templateUrl: './dashboard-confirmation-step.component.html',
    styleUrl: './dashboard-confirmation-step.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardConfirmationStepComponent extends DynamicScrollViewportHeight implements OnInit, OnDestroy {
    @Input() public formGroup: FormGroup;

    @ViewChild('viewport') public cdkVirtualScrollViewport: CdkVirtualScrollViewport;

    public dashboards$: Observable<DashboardWithWidgets[]>;

    public cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    public get selectedControl(): FormControl<DashboardWithWidgets[]> {
        return this.formGroup.get('selected') as FormControl<DashboardWithWidgets[]>;
    }

    public ngOnInit(): void {
        this.dashboards$ = this.selectedControl.valueChanges.pipe(
            startWith(this.selectedControl.value),
            filter(Boolean),
            map((dashboards: DashboardWithWidgets[]) => {
                return dashboards.filter(dashboard => dashboard?.id);
            }),
            tap((dashboards: DashboardWithWidgets[]) => {
                this.changeViewportHeight(dashboards);
            }),
            takeUntilOnDestroy(this),
        );
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public trackByFn(_: number, dashboard: DashboardWithWidgets): number {
        return dashboard.id;
    }
}
