import { NgModuleFactoryLoader } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DynamicSearcher } from '@xm-ngx/dynamic';

import { DynamicLoaderService } from './dynamic-loader.service';

describe('DynamicLoaderService', () => {
    let service: DynamicLoaderService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: DynamicSearcher, useValue: null },
                { provide: NgModuleFactoryLoader, useValue: null },
                DynamicLoaderService,
            ],
        });
        service = TestBed.inject<DynamicLoaderService>(DynamicLoaderService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
