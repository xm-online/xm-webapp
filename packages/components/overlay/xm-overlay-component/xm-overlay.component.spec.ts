import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomOverlayRef } from '../custom-overlay-ref';

import { XmOverlayComponent } from './xm-overlay.component';

describe('OverlayComponent', () => {
    let component: XmOverlayComponent;
    let fixture: ComponentFixture<XmOverlayComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [XmOverlayComponent],
            providers: [
                { provide: CustomOverlayRef, useValue: {} },
            ],
        })
            .compileComponents();

        fixture = TestBed.createComponent(XmOverlayComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
