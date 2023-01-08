import { TestBed } from '@angular/core/testing';

import { XmTableDataLoaderService } from './xm-table-data-loader.service';

describe('DataService', () => {
    let service: XmTableDataLoaderService<unknown>;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(XmTableDataLoaderService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
