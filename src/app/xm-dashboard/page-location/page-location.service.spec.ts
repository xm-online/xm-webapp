import { TestBed } from '@angular/core/testing';

import { PageLocationService } from './page-location.service';

describe('PageLocationService', () => {
    let service: PageLocationService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject<PageLocationService>(PageLocationService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
