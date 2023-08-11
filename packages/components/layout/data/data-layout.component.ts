import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ConditionModule } from '@xm-ngx/components/condition';
import { DataLayoutConfig } from '@xm-ngx/components/layout/data/data-layout.model';
import { ResourceDataService } from '@xm-ngx/controllers/features/resource-data';
import { DashboardStore } from '@xm-ngx/core/dashboard';
import { XmDynamicModule } from '@xm-ngx/dynamic';
import {
    XmDynamicInjectionTokenStoreService,
} from '@xm-ngx/dynamic/src/services/xm-dynamic-injection-token-store.service';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { get } from 'lodash';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

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

    private dynamicInjectionTokenStore = inject(XmDynamicInjectionTokenStoreService);
    private dataController = inject<ResourceDataService>(this.dynamicInjectionTokenStore.resolve('data'));

    public config: DataLayoutConfig;

    private value$: Observable<any> = this.dataController.get().pipe(
        map(obj => this.config?.field ? get(obj, this.config.field) : obj),
        switchMap(value => {
            if (this.config?.transform) {
                const transformController = inject<any>(this.dynamicInjectionTokenStore.resolve(this.config.transform));
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
