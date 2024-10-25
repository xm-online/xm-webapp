import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, forwardRef } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DashboardEditorService } from '../../index';
import {
    DashboardCollection,
    DashboardConfig,
    WidgetCollection,
} from '../../injectors';
import { XmAlertService } from '@xm-ngx/alert';
import { MockEntityCollection } from '@xm-ngx/repositories/testing';
import { NgModelWrapper } from '@xm-ngx/components/ng-accessor';
import { XmEventManager } from '@xm-ngx/core';
import { XmToasterService } from '@xm-ngx/toaster';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';

import { WidgetEditComponent } from './widget-edit.component';
import { JsonSchemaFormModule } from '@ajsf/core';
import { MatMenuModule } from '@angular/material/menu';
import { XM_CONTROL_ERRORS_TRANSLATES, XM_CONTROL_ERRORS_TRANSLATES_DEFAULT } from '@xm-ngx/components/control-error';
import { XmDynamicExtensionModule, XmDynamicModule } from '@xm-ngx/dynamic';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { XmUiConfigService } from '@xm-ngx/core/config';
import { MockUiConfigService } from '@xm-ngx/core/config/testing';

@Component({
    selector: 'xm-schema-editor, xm-text-control, xm-selector-text-control, xm-ace-editor-control',
    template: '',
    standalone: true,
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

describe('WidgetEditComponent', () => {
    let component: WidgetEditComponent;
    let fixture: ComponentFixture<WidgetEditComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                XmTranslationTestingModule,
                HttpClientTestingModule,
                FormsModule,
                JsonSchemaFormModule,
                MatMenuModule,
                MockXmTextControlComponent,
                WidgetEditComponent,
                XmDynamicExtensionModule.forRoot([]),
                XmDynamicModule.forRoot([]),
                NoopAnimationsModule,
                MatDialogModule,
            ],
            declarations: [],
            providers: [
                { provide: XM_CONTROL_ERRORS_TRANSLATES, useValue: XM_CONTROL_ERRORS_TRANSLATES_DEFAULT },
                { provide: WidgetCollection, useClass: MockEntityCollection },
                { provide: DashboardCollection, useClass: MockEntityCollection },
                { provide: XmUiConfigService, useClass: MockUiConfigService },
                { provide: DashboardEditorService, useValue: null },
                { provide: DashboardConfig, useValue: {} },
                { provide: XmAlertService, useValue: null },
                { provide: XmToasterService, useValue: null },
                XmEventManager,
            ],
            schemas: [],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(WidgetEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
