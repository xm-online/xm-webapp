import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdpCallbackComponent } from './idp-callback.component';
import { LoginService } from '@xm-ngx/core/auth';

describe('IdpCallbackComponent', () => {
    let component: IdpCallbackComponent;
    let fixture: ComponentFixture<IdpCallbackComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers:[
                { provide: LoginService, useValue: {} },
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
