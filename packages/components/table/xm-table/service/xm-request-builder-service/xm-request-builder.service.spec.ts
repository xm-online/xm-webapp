import {TestBed} from '@angular/core/testing';

import {XmRequestBuilderService} from './xm-request-builder.service';

describe('RequestBuilderService', () => {
    let service: XmRequestBuilderService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(XmRequestBuilderService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
