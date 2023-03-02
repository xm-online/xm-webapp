import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';

import { EntitySpecEditorComponent } from './entity-spec-editor.component';

describe('EntitySpecEditorComponent', () => {
    let component: EntitySpecEditorComponent;
    let fixture: ComponentFixture<EntitySpecEditorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [XmTranslationTestingModule],
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [EntitySpecEditorComponent],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EntitySpecEditorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
