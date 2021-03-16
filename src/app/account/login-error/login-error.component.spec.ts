import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginErrorComponent } from './login-error.component';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from '@xm-ngx/core/auth';
import { HttpClient } from '@angular/common/http';

describe('LoginErrorComponent', () => {
    let component: LoginErrorComponent;
    let fixture: ComponentFixture<LoginErrorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                {provide: LoginService, useValue: null},
                {provide: HttpClient, useValue: null},
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
