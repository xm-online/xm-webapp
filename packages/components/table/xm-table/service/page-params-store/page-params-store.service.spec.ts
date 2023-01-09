import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { PageParamsStore } from './page-params-store.service';

describe('PageParamsStoreService', () => {
    let service: PageParamsStore;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: Router, useValue: null },
                { provide: ActivatedRoute, useValue: null },
            ],
        });
        service = TestBed.inject(PageParamsStore);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
