import { TestBed } from '@angular/core/testing';

import { WidgetListService } from './widget-list.service';

describe('WidgetListService', () => {
    let service: WidgetListService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(WidgetListService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
