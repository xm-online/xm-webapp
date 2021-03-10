import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, forwardRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DashboardEditorService } from '@xm-ngx/administration/dashboards-config';
import {
    DashboardCollection,
    DashboardConfig,
    WidgetCollection,
} from '@xm-ngx/administration/dashboards-config/injectors';
import { XmAlertService } from '@xm-ngx/alert';
import { MockEntityCollection } from '@xm-ngx/components/entity-collection/testing/mock-entity-collection';
import { NgModelWrapper } from '@xm-ngx/components/ng-accessor';
import { XmEventManager } from '@xm-ngx/core';
import { XmToasterService } from '@xm-ngx/toaster';
import { XmTranslationTestingModule } from '@xm-ngx/translation';

import { WidgetEditComponent } from './widget-edit.component';

@Component({
    selector: 'xm-text-control, xm-selector-text-control, xm-ace-editor-control',
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

describe('WidgetEditComponent', () => {
    let component: WidgetEditComponent;
    let fixture: ComponentFixture<WidgetEditComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                XmTranslationTestingModule,
                HttpClientTestingModule,
                FormsModule,
            ],
            declarations: [WidgetEditComponent, MockXmTextControlComponent],
            providers: [
                { provide: WidgetCollection, useClass: MockEntityCollection },
                { provide: DashboardCollection, useClass: MockEntityCollection },
                { provide: DashboardEditorService, useValue: null },
                { provide: DashboardConfig, useValue: {} },
                { provide: XmAlertService, useValue: null },
                { provide: XmToasterService, useValue: null },
                XmEventManager,
            ],
            schemas: [NO_ERRORS_SCHEMA],
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
