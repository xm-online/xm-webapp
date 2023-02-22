import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XmPhoneNumberControlComponent } from './xm-phone-number-control.component';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { NgxMaskModule } from 'ngx-mask';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('XmPhoneNumberControlComponent', () => {
    let component: XmPhoneNumberControlComponent;
    let fixture: ComponentFixture<XmPhoneNumberControlComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                ControlErrorModule.forRoot({ errorTranslates: XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES }),
                NgxMaskModule.forRoot(),
                NoopAnimationsModule,
                XmPhoneNumberControlComponent,
                XmTranslationTestingModule,
            ],
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
