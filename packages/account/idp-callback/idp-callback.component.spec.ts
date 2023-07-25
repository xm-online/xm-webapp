import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LoginService } from '@xm-ngx/components/login';
import { XmUiConfigService } from '@xm-ngx/core/config';

import { IdpCallbackComponent } from './idp-callback.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MockUiConfigService } from '@xm-ngx/core/config/testing';

describe('IdpCallbackComponent', () => {
    let component: IdpCallbackComponent;
    let fixture: ComponentFixture<IdpCallbackComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            imports: [HttpClientTestingModule, RouterTestingModule],
            providers: [
                { provide: XmUiConfigService, useClass: MockUiConfigService },
                { provide: LoginService, useValue: {} },
            ],
            declarations: [IdpCallbackComponent],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IdpCallbackComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
