import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, forwardRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { XmAlertService } from '@xm-ngx/alert';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { NgModelWrapper } from '@xm-ngx/components/ng-accessor';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { XmEventManager } from '@xm-ngx/core';
import { XmUiConfigService } from '@xm-ngx/core/config';
import { MockUiConfigService } from '@xm-ngx/core/config/testing';
import { MockDashboardStore } from '@xm-ngx/core/dashboard/testing';
import { Principal } from '@xm-ngx/core/user';
import { DashboardStore } from '@xm-ngx/dashboard';
import { MockEntityCollection } from '@xm-ngx/repositories/testing';
import { XmToasterService } from '@xm-ngx/toaster';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { DashboardCollection, DashboardConfig, WidgetCollection } from '../../injectors';
import { DashboardEditorService } from '../../services/dashboard-editor.service';
import { DashboardsManagerService } from '../../services/dashboards-manager.service';

import { DashboardEditComponent } from './dashboard-edit.component';

@Component({
    selector: 'xm-text-control, xm-ace-editor-control',
    template: '',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MockXmTextControlComponent),
            multi: true,
        },
    ],
})
export class MockXmTextControlComponent extends NgModelWrapper<undefined> {
}

describe('DashboardEditComponent', () => {
    let component: DashboardEditComponent;
    let fixture: ComponentFixture<DashboardEditComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                XmTranslationTestingModule,
                NoopAnimationsModule,
                HttpClientTestingModule,
                FormsModule,
                ReactiveFormsModule,
                DashboardEditComponent,
                RouterTestingModule,
                ControlErrorModule.forRoot({errorTranslates: XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES}),
                MatDialogModule,
                MockXmTextControlComponent,
            ],
            providers: [
                {provide: DashboardCollection, useClass: MockEntityCollection},
                {provide: XmUiConfigService, useClass: MockUiConfigService},
                {provide: DashboardEditorService, useValue: null},
                {provide: XmAlertService, useValue: null},
                {provide: DashboardConfig, useValue: {}},
                {provide: XmEventManager, useValue: null},
                {provide: Principal, useValue: null},
                {provide: XmToasterService, useValue: null},
                {provide: DashboardStore, useClass: MockDashboardStore},
                {provide: WidgetCollection, useClass: MockEntityCollection},
                {provide: DashboardsManagerService, useValue: null},
            ],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DashboardEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
