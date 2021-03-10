import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { XmAlertService } from '@xm-ngx/alert';
import { XM_DYNAMIC_TABLE_ROW } from '@xm-ngx/dynamic';
import { XmToasterService } from '@xm-ngx/toaster';
import { XmTranslationTestingModule } from '@xm-ngx/translation';
import { UserService } from '../../../../../src/app/shared';

import { UnblockLockUserComponent } from './unblock-lock-user.component';

describe('UnblockLockUserComponent', () => {
    let component: UnblockLockUserComponent;
    let fixture: ComponentFixture<UnblockLockUserComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [XmTranslationTestingModule],
            providers: [
                { provide: XmAlertService, useValue: {} },
                { provide: XmToasterService, useValue: {} },
                { provide: UserService, useValue: {} },
                { provide: XM_DYNAMIC_TABLE_ROW, useValue: {} },
            ],
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [UnblockLockUserComponent],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UnblockLockUserComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
