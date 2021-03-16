import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdpCallbackComponent } from './idp-callback.component';
import { LoginService } from '@xm-ngx/core/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { XmPrivateUiConfigService } from '@xm-ngx/core/config';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('IdpCallbackComponent', () => {
    let component: IdpCallbackComponent;
    let fixture: ComponentFixture<IdpCallbackComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                {provide: LoginService, useValue: {}},
                {provide: ActivatedRoute, useValue: {params: of()}},
                {provide: Router, useValue: {}},
                {provide: XmPrivateUiConfigService, useValue: {config$: () => {}}},
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
