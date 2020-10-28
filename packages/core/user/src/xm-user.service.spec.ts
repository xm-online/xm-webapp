import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { XmUserService } from './xm-user.service';

describe('XmUserService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
    }));

    it('should be created', () => {
        const service: XmUserService = TestBed.inject(XmUserService);
        expect(service).toBeTruthy();
    });
});
