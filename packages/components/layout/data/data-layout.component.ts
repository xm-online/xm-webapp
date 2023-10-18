import { AsyncPipe, NgIf } from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ConditionModule } from '@xm-ngx/components/condition';
import { ResourceDataService } from '@xm-ngx/controllers/features/resource-data';
import { DashboardStore } from '@xm-ngx/core/dashboard';
import {injectByKey, XM_DYNAMIC_COMPONENT_CONFIG, XmDynamicModule} from '@xm-ngx/dynamic';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { get } from 'lodash';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DataLayoutConfig } from './data-layout.model';

@Component({
    standalone: true,
    selector: 'xm-data-layout',
    templateUrl: './data-layout.component.html',
    styleUrls: ['./data-layout.component.scss'],
    imports: [
        MatCardModule,
        XmDynamicModule,
        NgIf,
        AsyncPipe,
        ConditionModule,
    ],
    providers: [DashboardStore],
    changeDetection: ChangeDetectionStrategy.Default, // keep OnPush
})
export class DataLayoutComponent implements OnInit, OnDestroy {

    public config: DataLayoutConfig = inject<DataLayoutConfig>(XM_DYNAMIC_COMPONENT_CONFIG);

    private dataController = injectByKey<ResourceDataService>(this.config.dataController?.key  || 'data');

    private value$: Observable<any> = this.dataController[this.config.dataController?.method || 'get']().pipe(
        map(obj => this.config?.field ? get(obj, this.config.field) : obj),
        switchMap(value => {
            if (this.config?.transform) {
                const transformController = injectByKey<any>(this.config.transform);
                return transformController.transform(value);
            }
            return of(value);
        }),
    );

    public value: any;

    public ngOnInit(): void {
        this.value$.pipe(takeUntilOnDestroy(this)).subscribe(value => this.value = value);
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

}
