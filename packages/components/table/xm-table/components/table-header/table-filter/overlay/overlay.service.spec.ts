import { Overlay } from '@angular/cdk/overlay';
import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { OverlayService } from './overlay.service';

describe('OverlayService', () => {
    let service: OverlayService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                Overlay,
                { provide: Injector, useValue: null },
            ],
        });
        service = TestBed.inject(OverlayService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
