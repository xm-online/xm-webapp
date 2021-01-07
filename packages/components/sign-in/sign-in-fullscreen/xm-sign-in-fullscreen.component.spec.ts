import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XmSignInFullscreenComponent } from './xm-sign-in-fullscreen.component';

describe('SignInFullscreenComponent', () => {
    let component: XmSignInFullscreenComponent;
    let fixture: ComponentFixture<XmSignInFullscreenComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [XmSignInFullscreenComponent],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(XmSignInFullscreenComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
