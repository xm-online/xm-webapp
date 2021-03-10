import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { XmPrivateUiConfigService } from './xm-private-ui-config.service';

describe('XmPrivateUiConfigService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        providers: [XmPrivateUiConfigService],
        imports: [HttpClientTestingModule],
    }));

    it('should be created', () => {
        const service: XmPrivateUiConfigService = TestBed.inject<XmPrivateUiConfigService>(XmPrivateUiConfigService);
        expect(service).toBeTruthy();
    });
});
