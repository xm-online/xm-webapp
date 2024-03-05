import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';

import { DashboardsConfigComponent } from './dashboards-config.component';
import {RouterTestingModule} from '@angular/router/testing';
import { DatePipe } from '@angular/common';
import {XmToasterService} from '@xm-ngx/toaster';
import {MatDialogModule} from '@angular/material/dialog';
import {XmAlertService} from '@xm-ngx/alert';
import { XM_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/control-error';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe('DashboardsConfigComponent', () => {
    let component: DashboardsConfigComponent;
    let fixture: ComponentFixture<DashboardsConfigComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                XmTranslationTestingModule,
                RouterTestingModule,
                HttpClientTestingModule,
                DashboardsConfigComponent,
                MatDialogModule,
                NoopAnimationsModule,
            ],
            declarations: [],
            providers: [
                DatePipe,
                { provide: XmToasterService, useValue: {} },
                { provide: XmAlertService, useValue: {} },
                { provide: XM_CONTROL_ERRORS_TRANSLATES, useValue: [] },
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DashboardsConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
