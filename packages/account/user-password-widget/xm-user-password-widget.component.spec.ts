import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XmUserPasswordWidgetComponent } from './xm-user-password-widget.component';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('XmUserPasswordWidgetComponent', () => {
    let component: XmUserPasswordWidgetComponent;
    let fixture: ComponentFixture<XmUserPasswordWidgetComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [XmUserPasswordWidgetComponent, XmTranslationTestingModule, HttpClientTestingModule],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(XmUserPasswordWidgetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
