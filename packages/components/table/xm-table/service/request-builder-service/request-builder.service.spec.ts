import {TestBed} from '@angular/core/testing';

import {RequestBuilderService} from './request-builder.service';

describe('RequestBuilderService', () => {
    let service: RequestBuilderService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(RequestBuilderService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
