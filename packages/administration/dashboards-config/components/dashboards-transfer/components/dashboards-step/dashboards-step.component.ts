import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DashboardWithWidgets } from '@xm-ngx/core/dashboard';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { Observable } from 'rxjs';
import { XmTranslatePipe } from '@xm-ngx/translation';
import { AsyncPipe } from '@angular/common';

import { translates } from '../../constants';
import { AbstractSelectionList, SelectionFormGroup } from '../selection-list/abstract-selection-list';
import { DashboardOptionComponent } from '../dashboard-option/dashboard-option.component';


@Component({
    selector: 'xm-dashboards-step',
    standalone: true,
    imports: [
        MatSelectionList,
        MatListOption,
        DashboardOptionComponent,
        CdkVirtualScrollViewport,
        CdkFixedSizeVirtualScroll,
        CdkVirtualForOf,
        MatFormField,
        MatLabel,
        MatInput,
        ReactiveFormsModule,
        AsyncPipe,
        XmTranslatePipe,

    ],
    templateUrl: './dashboards-step.component.html',
    styleUrl: './dashboards-step.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardsStepComponent extends AbstractSelectionList<DashboardWithWidgets> implements OnInit, OnDestroy {
    @Input() public formGroup: SelectionFormGroup<DashboardWithWidgets>;
    @Input() public entities$: Observable<DashboardWithWidgets[]>;
    public readonly translates = translates;

    public filterFn = (searchTerm: string, dashboards: DashboardWithWidgets[]): DashboardWithWidgets[] => {
        return dashboards.filter(dashboard => {
            return dashboard.name.toLowerCase().includes(searchTerm.trim().toLowerCase());
        });
    };

    public ngOnInit(): void {
        this.items$ = this.getEntities().pipe(
            takeUntilOnDestroy(this),
        );
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public trackByFn = (_: number, dashboard: DashboardWithWidgets): number => {
        return dashboard.id;
    };
}
