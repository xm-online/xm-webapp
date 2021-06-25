import { TestBed } from '@angular/core/testing';
import { DashboardWrapperService } from '@xm-ngx/dashboard';
import { XmLoggerService } from '@xm-ngx/logger';
import { MockXmLogger } from '@xm-ngx/logger/testing';
import { MockDashboardStore } from '@xm-ngx/dashboards/testing';

import { PageService } from './page.service';

describe('PageService', () => {
    let service: PageService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: DashboardWrapperService, useClass: MockDashboardStore },
                { provide: XmLoggerService, useClass: MockXmLogger },
            ],
        });
        service = TestBed.inject<PageService>(PageService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
