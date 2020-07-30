import { TestBed } from '@angular/core/testing';
import { DashboardWrapperService } from '@xm-ngx/dashboard';

import { PageService } from './page.service';

describe('PageService', () => {
    let service: PageService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: DashboardWrapperService, useValue: {} }],
        });
        service = TestBed.inject<PageService>(PageService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
