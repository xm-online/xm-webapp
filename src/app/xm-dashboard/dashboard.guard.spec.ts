import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { DashboardGuard } from './dashboard.guard';
import { DashboardWrapperService } from './shared/dashboard-wrapper.service';
import { DefaultDashboardService } from './shared/default-dashboard.service';

describe('DashboardGuard', () => {
    let guard: DashboardGuard;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                DashboardGuard,
                { provide: DashboardWrapperService, useValue: {} },
                { provide: DefaultDashboardService, useValue: {} },
            ],
            imports: [RouterTestingModule],
        });
        guard = TestBed.inject<DashboardGuard>(DashboardGuard);
    });

    it('should be created', () => {
        expect(guard).toBeTruthy();
    });
});
