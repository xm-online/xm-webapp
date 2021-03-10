import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Principal } from '@xm-ngx/core/auth';
import { XmTranslationTestingModule } from '@xm-ngx/translation';
import { of } from 'rxjs';
import { XmConfigService } from '../../../../../src/app/shared';
import { MockPrincipalService } from '../../../../../src/app/shared/auth/testing/mock-principal.service';

import { PrivateUiMngComponent } from './private-ui-mng.component';

describe('PrivateUiMngComponent', () => {
    let component: PrivateUiMngComponent;
    let fixture: ComponentFixture<PrivateUiMngComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            imports: [HttpClientTestingModule, XmTranslationTestingModule],
            declarations: [PrivateUiMngComponent],
            providers: [
                { provide: Principal, useClass: MockPrincipalService },
                { provide: XmConfigService, useValue: { getConfig: () => of(null) } },
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PrivateUiMngComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
