import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';

import { DashboardsConfigComponent } from './dashboards-config.component';

describe('DashboardsConfigComponent', () => {
    let component: DashboardsConfigComponent;
    let fixture: ComponentFixture<DashboardsConfigComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [XmTranslationTestingModule, HttpClientTestingModule],
            declarations: [DashboardsConfigComponent],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DashboardsConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
