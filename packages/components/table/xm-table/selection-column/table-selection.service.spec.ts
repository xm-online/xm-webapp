import {TestBed} from '@angular/core/testing';

import {TableSelectionService} from './table-selection.service';

describe('TableSelectionService', () => {
    let service: TableSelectionService<any>;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TableSelectionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
