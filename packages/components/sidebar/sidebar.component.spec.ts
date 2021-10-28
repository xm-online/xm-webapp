import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { XmSidebarStoreService } from '@xm-ngx/components/sidebar/stores/xm-sidebar-store.service';
import { XmUiConfigService } from '@xm-ngx/core/config';
import { MockUiConfigService } from '@xm-ngx/core/config/testing';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { of } from 'rxjs';

import { XmSidebarComponent } from './sidebar.component';

describe('XmSidebarComponent', () => {
    let component: XmSidebarComponent;
    let fixture: ComponentFixture<XmSidebarComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [XmTranslationTestingModule, HttpClientTestingModule],
            providers: [
                { provide: XmUiConfigService, useClass: MockUiConfigService },
                { provide: XmSidebarStoreService, useValue: {onPresentationChange:of(null)} },
            ],
            declarations: [XmSidebarComponent],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(XmSidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
