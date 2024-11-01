import { NO_ERRORS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { XmUiConfigService } from '@xm-ngx/core/config';
import { MockUiConfigService } from '@xm-ngx/core/config/testing';

import { XmRibbonComponent } from './xm-ribbon.component';

describe('XmRibbonComponent', () => {
    let component: XmRibbonComponent;
    let fixture: ComponentFixture<XmRibbonComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [XmRibbonComponent],
            providers: [{ provide: XmUiConfigService, useClass: MockUiConfigService }],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(XmRibbonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
