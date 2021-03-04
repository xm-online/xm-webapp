import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { XmPublicUiConfigService } from './xm-public-ui-config.service';

describe('XmPublicUiConfigService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
    }));

    it('should be created', () => {
        const service: XmPublicUiConfigService = TestBed.inject<XmPublicUiConfigService>(XmPublicUiConfigService);
        expect(service).toBeTruthy();
    });
});
