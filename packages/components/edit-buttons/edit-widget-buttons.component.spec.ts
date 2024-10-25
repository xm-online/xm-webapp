import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';

import { EditWidgetButtonsComponent } from './edit-widget-buttons.component';
import { XmDynamicModule } from '@xm-ngx/dynamic';

describe('EditWidgetButtonsComponent', () => {
    let component: EditWidgetButtonsComponent;
    let fixture: ComponentFixture<EditWidgetButtonsComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                XmTranslationTestingModule,
                HttpClientTestingModule,
                XmDynamicModule,
                XmDynamicModule.forRoot([]),
            ],
            declarations: [EditWidgetButtonsComponent],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditWidgetButtonsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
