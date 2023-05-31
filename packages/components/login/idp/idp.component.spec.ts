import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdpComponent } from '@xm-ngx/components/login';
import { LoginService } from '@xm-ngx/components/login';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { XmPublicIdpConfigService } from '@xm-ngx/core';
import { MockUiConfigService } from '@xm-ngx/core/config/testing';

describe('IdpComponent', () => {
    let component: IdpComponent;
    let fixture: ComponentFixture<IdpComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, IdpComponent],
        }).overrideComponent(IdpComponent, {
            set: {
                providers: [
                    { provide: LoginService, useValue: {} },
                    { provide: XmPublicIdpConfigService, useClass: MockUiConfigService },
                ],
            },
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IdpComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
