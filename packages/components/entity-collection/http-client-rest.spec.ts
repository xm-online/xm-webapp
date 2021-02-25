import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { HttpClientRest } from './http-client.rest';

describe('HttpClientRestService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
    }));

    it('should be created', () => {
        const http = TestBed.inject(HttpClient);
        const service: HttpClientRest = new HttpClientRest('test', http);
        expect(service).toBeTruthy();
    });
});
