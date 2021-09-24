import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { XmUiConfigService } from '@xm-ngx/core/config';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { MockUiConfigService } from '@xm-ngx/core/config/testing';

import { xmSidebarComponent } from './xm-sidebar.component';

describe('XmSidebarComponent', () => {
    let component: xmSidebarComponent;
    let fixture: ComponentFixture<xmSidebarComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [XmTranslationTestingModule, HttpClientTestingModule],
            providers: [
                { provide: XmUiConfigService, useClass: MockUiConfigService },
            ],
            declarations: [xmSidebarComponent],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(xmSidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
