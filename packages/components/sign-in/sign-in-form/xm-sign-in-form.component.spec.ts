import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SignInService } from '@xm-ngx/components/sign-in';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { of } from 'rxjs';

import { XmSignInFormComponent } from './xm-sign-in-form.component';

describe('SignInFormComponent', () => {
    let component: XmSignInFormComponent;
    let fixture: ComponentFixture<XmSignInFormComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [XmTranslationTestingModule],
            providers: [{ provide: SignInService, useValue: { loading$: () => of(false) } }],
            declarations: [XmSignInFormComponent],
            schemas: [NO_ERRORS_SCHEMA],
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
