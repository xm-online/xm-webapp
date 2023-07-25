import { TestBed } from '@angular/core/testing';
import { DashboardStore } from '@xm-ngx/dashboard';
import { XmLoggerService } from '@xm-ngx/logger';
import { MockXmLogger } from '@xm-ngx/logger/testing';
import { MockDashboardStore } from '@xm-ngx/core/dashboard/testing';

import { PageService } from '@xm-ngx/dashboard';

describe('PageService', () => {
    let service: PageService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: DashboardStore, useClass: MockDashboardStore },
                { provide: XmLoggerService, useClass: MockXmLogger },
            ],
        });
        service = TestBed.inject<PageService>(PageService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
