import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { XmPublicIdpConfigService } from './xm-public-idp-config.service';
import { XmCoreConfig } from '@xm-ngx/core';

describe('XmPublicIdpConfigService', () => {
    let service: XmPublicIdpConfigService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: XmCoreConfig, useValue: {} },
            ],
            imports: [HttpClientTestingModule],
        });
        service = TestBed.inject(XmPublicIdpConfigService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
