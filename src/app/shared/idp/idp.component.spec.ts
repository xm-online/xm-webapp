import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdpComponent } from './idp.component';
import { LoginService } from '@xm-ngx/core/auth';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('IdpComponent', () => {
    let component: IdpComponent;
    let fixture: ComponentFixture<IdpComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                {provide: LoginService, useValue: {}},
            ],
            declarations: [IdpComponent]
        })
            .compileComponents();
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
