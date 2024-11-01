import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { XmConfigService } from '@xm-ngx/core/config';

import { UaaLoginMngComponent } from './uaa-login-mng.component';
import { of } from 'rxjs';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';

describe('UaaLoginMngComponent', () => {
    let component: UaaLoginMngComponent;
    let fixture: ComponentFixture<UaaLoginMngComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, XmTranslationTestingModule],
            declarations: [UaaLoginMngComponent],
            providers: [
                { provide: XmConfigService, useValue: { getConfig: () => of(null) } },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UaaLoginMngComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
