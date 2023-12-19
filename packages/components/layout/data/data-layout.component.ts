import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Injector, OnDestroy, OnInit, ProviderToken } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ConditionModule } from '@xm-ngx/components/condition';
import { DashboardStore } from '@xm-ngx/core/dashboard';
import { XM_DYNAMIC_COMPONENT_CONFIG, XmDynamicInjectionTokenStoreService, XmDynamicModule } from '@xm-ngx/dynamic';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { get } from 'lodash';
import { of } from 'rxjs';
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
    private injector = inject(Injector);
    private injectionTokenService = inject(XmDynamicInjectionTokenStoreService);

    public value: any;

    public ngOnInit(): void {
        const dataControllerKey = this.config.dataController?.key || 'data';
        const dataController = this.getControllerByKey(dataControllerKey);
        if (dataController) {
            dataController[this.config.dataController?.method || 'get']()
                .pipe(
                    map(obj => this.config?.field ? get(obj, this.config.field) : obj),
                    switchMap(value => {
                        if (this.config?.transform) {
                            const transformController = this.getControllerByKey(this.config.transform);
                            if (transformController) {
                                return transformController.transform(value);
                            }
                            console.warn(`Cannot find controller by key: "${this.config.transform}"`);
                        }
                        return of(value);
                    }),
                    takeUntilOnDestroy(this)
                )
                .subscribe(value => this.value = value);
        } else {
            console.warn(`Cannot find controller by key: "${dataControllerKey}"`);
        }
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    private getControllerByKey(key: string): any {
        const providerToken: ProviderToken<any> = this.injectionTokenService.resolve(key);
        return this.injector.get(providerToken, undefined,{optional: true});
    }
}
