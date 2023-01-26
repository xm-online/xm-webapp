import { TestBed } from '@angular/core/testing';
import { PageParamsStore } from '@xm-ngx/components/table/xm-table/service/page-params-store/page-params-store.service';
import { PageService } from '@xm-ngx/dashboard';
import { of } from 'rxjs';

import { XmRequestBuilderService } from './xm-request-builder.service';

describe('RequestBuilderService', () => {
    let service: XmRequestBuilderService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                XmRequestBuilderService,
                { provide: PageParamsStore, useValue: { get: () => ({}) } },
                { provide: PageService, useValue: { active$: () => of(null) } },
            ],
        });
        service = TestBed.inject(XmRequestBuilderService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
