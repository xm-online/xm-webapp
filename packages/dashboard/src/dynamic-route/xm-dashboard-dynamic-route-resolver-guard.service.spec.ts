import { TestBed } from '@angular/core/testing';
import { DashboardStore, XmDashboardDynamicRouteResolverGuard } from '@xm-ngx/dashboard';
import { MockDashboardStore } from '@xm-ngx/dashboard/testing';
import { DynamicComponentLoaderService } from '@xm-ngx/dynamic';

describe('XmDashboardDynamicRouteResolverGuard', () => {
    let guard: XmDashboardDynamicRouteResolverGuard;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                XmDashboardDynamicRouteResolverGuard,
                { provide: DashboardStore, useClass: MockDashboardStore },
                { provide: DynamicComponentLoaderService, useValue: null },
            ],
        });
        guard = TestBed.inject(XmDashboardDynamicRouteResolverGuard);
    });

    it('should be created', () => {
        void expect(guard).toBeTruthy();
    });

});
