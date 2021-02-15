import { NgModuleFactoryLoader } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DynamicSearcher } from '@xm-ngx/dynamic';

import { DynamicTenantLoaderService } from './dynamic-tenant-loader.service';

describe('DynamicTenantLoaderService', () => {
    let service: DynamicTenantLoaderService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: DynamicSearcher, useValue: null },
                { provide: NgModuleFactoryLoader, useValue: null },
                DynamicTenantLoaderService,
            ],
        });
        service = TestBed.inject(DynamicTenantLoaderService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
