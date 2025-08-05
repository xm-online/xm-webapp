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
import { combineLatest, map, Observable, tap } from 'rxjs';
import { DashboardWithWidgets } from '@xm-ngx/core/dashboard';
import { AsyncPipe } from '@angular/common';
import { CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';

import { DashboardOptionComponent } from '../dashboard-option/dashboard-option.component';
import { DynamicScrollViewportHeight } from '../dynamic-scroll-viewport-height/dynamic-scroll-viewport-height';
import { TargetDashboardsService } from '../../services/target-dashboards.service';


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
    private readonly targetDashboardsService = inject(TargetDashboardsService);

    @Input() public formGroup: FormGroup;

    @ViewChild('viewport') public cdkVirtualScrollViewport: CdkVirtualScrollViewport;

    public dashboards$: Observable<DashboardWithWidgets[]>;

    public cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    public get selectedControl(): FormControl<DashboardWithWidgets[]> {
        return this.formGroup.get('selected') as FormControl<DashboardWithWidgets[]>;
    }

    public ngOnInit(): void {
        this.dashboards$ = combineLatest([this.selectedControl.valueChanges, this.targetDashboardsService.identifyDashboards$$]).pipe(
            map(([dashboards, _]: [DashboardWithWidgets[], boolean]) => {
                return dashboards.filter(dashboard => dashboard?.id);
            }),
            map((dashboards: DashboardWithWidgets[]) => this.markExistedDashboards(dashboards)),
            tap((dashboards: DashboardWithWidgets[]) => {
                this.changeViewportHeight(dashboards);
            }),
            takeUntilOnDestroy(this),
        );
    }

    private markExistedDashboards(dashboards: DashboardWithWidgets[]): DashboardWithWidgets[] {
        return dashboards.map(dashboard => {
            if (this.targetDashboardsService.isDashboardExists(dashboard.typeKey)) {
                return {
                    ...dashboard,
                    targetId: this.targetDashboardsService.getDashboardTargetId(dashboard.typeKey),
                };
            }

            return dashboard;
        });
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public trackByFn(_: number, dashboard: DashboardWithWidgets): number {
        return dashboard.id;
    }
}
