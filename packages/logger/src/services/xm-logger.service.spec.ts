import { TestBed } from '@angular/core/testing';

import { XmLogBroker, XmLoggerFactory, XmLoggerService } from '@xm-ngx/logger';

describe('XmLoggerService', () => {
    let service: XmLoggerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                XmLoggerService,
                { provide: XmLoggerFactory, useValue: null },
                { provide: XmLogBroker, useValue: null },
            ],
        });
        service = TestBed.inject(XmLoggerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
