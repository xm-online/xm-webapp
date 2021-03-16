import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginErrorComponent } from './login-error.component';
import { ActivatedRoute } from '@angular/router';

describe('LoginErrorComponent', () => {
    let component: LoginErrorComponent;
    let fixture: ComponentFixture<LoginErrorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                {provide: ActivatedRoute, useValue: null},
            ],
            declarations: [LoginErrorComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginErrorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
