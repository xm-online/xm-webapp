import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';

import { XmMultilingualControlComponent } from './xm-multilingual-control.component';

describe('XmMultilingualComponent', () => {
    let component: XmMultilingualControlComponent;
    let fixture: ComponentFixture<XmMultilingualControlComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [XmTranslationTestingModule],
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [XmMultilingualControlComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(XmMultilingualControlComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
