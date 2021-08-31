import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { NgxMaskModule } from 'ngx-mask';

import { XmPhoneNumberControlComponent } from './xm-phone-number-control.component';

describe('XmPhoneNumberControlComponent', () => {
    let component: XmPhoneNumberControlComponent;
    let fixture: ComponentFixture<XmPhoneNumberControlComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                XmTranslationTestingModule,
                MatFormFieldModule,
                MatInputModule,
                FormsModule,
                ReactiveFormsModule,
                ControlErrorModule,
                NgxMaskModule.forRoot(),
                NoopAnimationsModule,
            ],
            declarations: [XmPhoneNumberControlComponent],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(XmPhoneNumberControlComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
