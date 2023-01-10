import { Overlay } from '@angular/cdk/overlay';
import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { XmOverlayService } from './xm-overlay.service';

describe('XmOverlayService', () => {
    let service: XmOverlayService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                Overlay,
                { provide: Injector, useValue: null },
            ],
        });
        service = TestBed.inject(XmOverlayService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
