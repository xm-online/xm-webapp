import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MockWidgetListService } from '@xm-ngx/administration/dashboards-config/widget-edit/testing/mock-widget-list.service';
import { WidgetListService } from '@xm-ngx/administration/dashboards-config/widget-edit/widget-list.service';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';

import { SelectorTextControlComponent } from './selector-text-control.component';

describe('SelectorTextControlComponent', () => {
    let component: SelectorTextControlComponent;
    let fixture: ComponentFixture<SelectorTextControlComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: WidgetListService, useClass: MockWidgetListService },
            ],
            imports: [XmTranslationTestingModule, HttpClientTestingModule, MatAutocompleteModule],
            declarations: [SelectorTextControlComponent],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .compileComponents();
        TestBed.overrideComponent(SelectorTextControlComponent, {
            set: {
                providers: [
                    { provide: WidgetListService, useClass: MockWidgetListService },
                ],
            },
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SelectorTextControlComponent);
        component = fixture.componentInstance;
        component.options = {} as any;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
