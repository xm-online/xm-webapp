import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { XmUserService } from './xm-user.service';
import { XmCoreConfig } from '@xm-ngx/core';

describe('XmUserService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        providers: [{ provide: XmCoreConfig, useValue: {} }],
        imports: [HttpClientTestingModule],
    }));

    it('should be created', () => {
        const service: XmUserService = TestBed.inject<XmUserService>(XmUserService);
        expect(service).toBeTruthy();
    });
});
