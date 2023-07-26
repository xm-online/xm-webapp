import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';

import { ArchitectureComponent } from './architecture.component';

describe('HighLevelArchitectureWidgetComponent', () => {
    let component: ArchitectureComponent;
    let fixture: ComponentFixture<ArchitectureComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [XmTranslationTestingModule, HttpClientTestingModule, NoopAnimationsModule],
            declarations: [ArchitectureComponent],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ArchitectureComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
