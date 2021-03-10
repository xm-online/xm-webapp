import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { DashboardsManagerService } from './dashboards-manager.service';

describe('DashboardsManagerService', () => {
    let service: DashboardsManagerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [DashboardsManagerService],
        });
        service = TestBed.inject<DashboardsManagerService>(DashboardsManagerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
