import { TestBed } from '@angular/core/testing';

import { XmLoggerService } from './xm-logger.service';

describe('XmLoggerService', () => {
    let service: XmLoggerService;

    beforeEach(() => {
        TestBed.configureTestingModule({ providers: [XmLoggerService] });
        service = TestBed.inject(XmLoggerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
