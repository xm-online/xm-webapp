import { TestBed } from '@angular/core/testing';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';

import { XmToasterService } from './xm-toaster.service';

describe('XmToasterService', () => {
    beforeEach(() => TestBed.configureTestingModule({imports: [XmTranslationTestingModule]}));

    it('should be created', () => {
        const service: XmToasterService = TestBed.inject<XmToasterService>(XmToasterService);
        expect(service).toBeTruthy();
    });
});
