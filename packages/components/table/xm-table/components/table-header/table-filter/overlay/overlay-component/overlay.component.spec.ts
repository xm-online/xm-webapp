import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomOverlayRef } from '@xm-ngx/components/table/xm-table/components/table-header/table-filter/overlay/custom-overlay-ref';

import { OverlayComponent } from './overlay.component';

describe('OverlayComponent', () => {
    let component: OverlayComponent;
    let fixture: ComponentFixture<OverlayComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [OverlayComponent],
            providers: [
                { provide: CustomOverlayRef, useValue: {} },
            ],
        })
            .compileComponents();

        fixture = TestBed.createComponent(OverlayComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
