import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XmSignInFormComponent } from './xm-sign-in-form.component';

describe('SignInFormComponent', () => {
    let component: XmSignInFormComponent;
    let fixture: ComponentFixture<XmSignInFormComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [XmSignInFormComponent],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(XmSignInFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
