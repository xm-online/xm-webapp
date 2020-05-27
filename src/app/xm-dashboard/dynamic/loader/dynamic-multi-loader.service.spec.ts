import { TestBed } from '@angular/core/testing';

import { DynamicMultiLoaderService } from './dynamic-multi-loader.service';

describe('DynamicMultiLoaderService', () => {
    let service: DynamicMultiLoaderService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DynamicMultiLoaderService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
