import { TestBed } from '@angular/core/testing';

import { PageCollectionService } from './page-collection.service';

describe('PageCollectionService', () => {
    let service: PageCollectionService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PageCollectionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
