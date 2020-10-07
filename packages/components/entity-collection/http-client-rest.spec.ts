import { TestBed } from '@angular/core/testing';

import { HttpClientRest } from './http-client.rest';

describe('HttpClientRestService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: HttpClientRest = TestBed.get(HttpClientRest);
        expect(service).toBeTruthy();
    });
});
