import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '@xm-ngx/core/auth';
import { XmPrivateUiConfigService } from '@xm-ngx/core/config';
import { of } from 'rxjs';

import { IdpCallbackComponent } from './idp-callback.component';

describe('IdpCallbackComponent', () => {
    let component: IdpCallbackComponent;
    let fixture: ComponentFixture<IdpCallbackComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas:[NO_ERRORS_SCHEMA],
            imports: [HttpClientTestingModule],
            providers: [
                {provide: LoginService, useValue: {}},
                {provide: ActivatedRoute, useValue: {params: of()}},
                {provide: Router, useValue: {}},
                {provide: XmPrivateUiConfigService, useValue: {config$: () => of(null)}},
            ],
            declarations: [IdpCallbackComponent]
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
