import { TestBed } from '@angular/core/testing';
import { DynamicLoaderService, DynamicSearcher, DynamicTenantLoaderService } from '@xm-ngx/dynamic';

import { DynamicMultiLoaderService } from './dynamic-multi-loader.service';

describe('DynamicMultiLoaderService', () => {
    let service: DynamicMultiLoaderService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: DynamicLoaderService, useValue: null },
                { provide: DynamicTenantLoaderService, useValue: null },
                { provide: DynamicSearcher, useValue: null },
            ],
        });
        service = TestBed.inject<DynamicMultiLoaderService>(DynamicMultiLoaderService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
