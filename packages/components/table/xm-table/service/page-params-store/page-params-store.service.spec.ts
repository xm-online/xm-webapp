import {TestBed} from '@angular/core/testing';

import {PageParamsStore} from './page-params-store.service';

describe('PageParamsStoreService', () => {
    let service: PageParamsStore;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PageParamsStore);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
