import {TestBed} from '@angular/core/testing';

import {XmUiConfigService} from './xm-ui-config.service';

describe('UiConfigService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: XmUiConfigService = TestBed.get(XmUiConfigService);
        expect(service).toBeTruthy();
    });
});
