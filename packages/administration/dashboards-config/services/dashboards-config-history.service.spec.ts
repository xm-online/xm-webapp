import { TestBed } from '@angular/core/testing';

import { DashboardsConfigHistoryService } from './dashboards-config-history.service';

describe('DashboardsConfigHistoryService', () => {
    let service: DashboardsConfigHistoryService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DashboardsConfigHistoryService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
