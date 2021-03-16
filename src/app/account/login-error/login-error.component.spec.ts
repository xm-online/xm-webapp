import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginErrorComponent } from './login-error.component';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from '@xm-ngx/core/auth';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('LoginErrorComponent', () => {
    let component: LoginErrorComponent;
    let fixture: ComponentFixture<LoginErrorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                {provide: LoginService, useValue: null},
                {provide: ActivatedRoute, useValue: {params: of()}},
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
