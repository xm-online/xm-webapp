import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {
    MockWidgetListService
} from '../../testing/mock-widget-list.service';
import { WidgetListService } from '../widget-edit/widget-list.service';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';

import { SelectorTextControlComponent } from './selector-text-control.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SelectorTextControlComponent', () => {
    let component: SelectorTextControlComponent;
    let fixture: ComponentFixture<SelectorTextControlComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: WidgetListService, useClass: MockWidgetListService },
            ],
            imports: [
                NoopAnimationsModule,
                XmTranslationTestingModule,
                HttpClientTestingModule,
                MatAutocompleteModule,
                SelectorTextControlComponent
            ],
            declarations: [],
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
