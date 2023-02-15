import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';

import { StatesEditorComponent } from './states-editor.component';

describe('StatesEditorComponent', () => {
    let component: StatesEditorComponent;
    let fixture: ComponentFixture<StatesEditorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [XmTranslationTestingModule],
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [StatesEditorComponent],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StatesEditorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
