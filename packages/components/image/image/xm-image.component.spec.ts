import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XmImageComponent } from './xm-image.component';

describe('ImageViewComponent', () => {
    let component: XmImageComponent;
    let fixture: ComponentFixture<XmImageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [XmImageComponent],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(XmImageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
