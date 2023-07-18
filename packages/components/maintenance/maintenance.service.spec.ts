import { TestBed } from '@angular/core/testing';

import { MaintenanceService } from './maintenance.service';
import { XmThemeLoader } from '@xm-ngx/core/theme';
import { XmApplicationConfigService } from '@xm-ngx/core/config';

describe('MaintenanceService', () => {
    let service: MaintenanceService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: XmThemeLoader, useValue: {} },
                { provide: XmApplicationConfigService, useValue: {} },
            ],
        });
        service = TestBed.inject<MaintenanceService>(MaintenanceService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
