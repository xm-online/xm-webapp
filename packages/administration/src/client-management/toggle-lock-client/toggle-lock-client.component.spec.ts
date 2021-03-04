import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { XmAlertService } from '@xm-ngx/alert';
import { XmToasterService } from '@xm-ngx/toaster';
import { ClientService } from '../../../../../src/app/shared';

import { ToggleLockClientComponent } from './toggle-lock-client.component';

describe('ToggleLockClientComponent', () => {
    let component: ToggleLockClientComponent;
    let fixture: ComponentFixture<ToggleLockClientComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: XmAlertService, useValue: {} },
                { provide: XmToasterService, useValue: {} },
                { provide: ClientService, useValue: {} },
            ],
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [ToggleLockClientComponent],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ToggleLockClientComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
