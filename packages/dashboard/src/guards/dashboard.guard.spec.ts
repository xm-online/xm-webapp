import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { XmLoggerService } from '@xm-ngx/logger';
import { MockXmLogger } from '@xm-ngx/logger/testing';

import { DashboardGuard } from './dashboard.guard';
import { DashboardStore } from '@xm-ngx/core/dashboard';
import { DefaultDashboardService } from '../services/default-dashboard.service';
import { MockDashboardStore } from '@xm-ngx/core/dashboard/testing';
import { XmDynamicControllerInjectorFactoryService, XmDynamicInjectionTokenStoreService } from '@xm-ngx/dynamic';
import { Injector } from '@angular/core';

describe('DashboardGuard', () => {
    let guard: DashboardGuard;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                DashboardGuard,
                { provide: XmLoggerService, useClass: MockXmLogger },
                { provide: DashboardStore, useClass: MockDashboardStore },
                { provide: DefaultDashboardService, useValue: {} },
                { provide: XmDynamicControllerInjectorFactoryService, useValue: {}},
                { provide: XmDynamicInjectionTokenStoreService, useValue: {}},
                { provide: Injector, useValue: {}},
            ],
            imports: [RouterTestingModule],
        });
        guard = TestBed.inject<DashboardGuard>(DashboardGuard);
    });

    it('should be created', () => {
        expect(guard).toBeTruthy();
    });
});
