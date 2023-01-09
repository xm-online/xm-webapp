import { TestBed } from '@angular/core/testing';
import { XmDynamicServiceLoader } from '@xm-ngx/components/table/xm-table/service/xm-dynamic-service-loader.service';
import { XmRequestBuilderService } from '@xm-ngx/components/table/xm-table/service/xm-request-builder-service/xm-request-builder.service';

import { XmTableDataLoaderService } from './xm-table-data-loader.service';

describe('DataService', () => {
    let service: XmTableDataLoaderService<unknown>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: XmDynamicServiceLoader, useValue: null },
                { provide: XmRequestBuilderService, useValue: null },
            ],
        });
        service = TestBed.inject(XmTableDataLoaderService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
