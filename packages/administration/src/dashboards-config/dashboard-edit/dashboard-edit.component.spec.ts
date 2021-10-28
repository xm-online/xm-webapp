import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, forwardRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateService } from '@ngx-translate/core';
import { DashboardEditorService } from '@xm-ngx/administration/dashboards-config';
import { DashboardCollection, DashboardConfig } from '@xm-ngx/administration/dashboards-config/injectors';
import { XmAlertService } from '@xm-ngx/alert';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { MockEntityCollection } from '@xm-ngx/components/entity-collection/testing/mock-entity-collection';
import { NgModelWrapper } from '@xm-ngx/components/ng-accessor';
import { XmEventManager } from '@xm-ngx/core';
import { Principal } from '@xm-ngx/core/auth';
import { XmToasterService } from '@xm-ngx/toaster';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';

import { DashboardEditComponent } from './dashboard-edit.component';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';

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

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                XmTranslationTestingModule,
                NoopAnimationsModule,
                HttpClientTestingModule,
                FormsModule,
                ControlErrorModule.forRoot({errorTranslates: XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES}),
            ],
            declarations: [DashboardEditComponent, MockXmTextControlComponent],
            providers: [
                { provide: DashboardCollection, useClass: MockEntityCollection },
                { provide: DashboardEditorService, useValue: null },
                { provide: XmAlertService, useValue: null },
                { provide: DashboardConfig, useValue: {} },
                { provide: XmEventManager, useValue: null },
                { provide: Principal, useValue: null },
                { provide: TranslateService, useValue: null },
                { provide: XmToasterService, useValue: null },
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
