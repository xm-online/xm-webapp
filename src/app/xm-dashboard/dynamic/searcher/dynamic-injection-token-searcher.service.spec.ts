import { TestBed } from '@angular/core/testing';

import { DynamicInjectionTokenSearcherService } from './dynamic-injection-token-searcher.service';

describe('DynamicInjectionTokenSearcherService', () => {
    let service: DynamicInjectionTokenSearcherService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DynamicInjectionTokenSearcherService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
