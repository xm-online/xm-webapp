import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { HttpClientRest } from './http-client.rest';

describe('HttpClientRestService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [HttpClientRest],
    }));

    it('should be created', () => {
        const service: HttpClientRest = TestBed.inject(HttpClientRest);
        expect(service).toBeTruthy();
    });
});
