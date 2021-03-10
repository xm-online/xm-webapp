import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { PageLocationService } from './page-location.service';

describe('PageLocationService', () => {
    let service: PageLocationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [PageLocationService],
            imports: [RouterTestingModule],
        });
        service = TestBed.inject<PageLocationService>(PageLocationService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
