import { TestBed } from '@angular/core/testing';

import { XmSuperAdminService } from './xm-super-admin.service';

describe('XmSuperAdminService', () => {
    let service: XmSuperAdminService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(XmSuperAdminService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
