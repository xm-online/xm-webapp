import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XmAngularEditorControl } from './xm-angular-editor-control.component';

describe('AngularEditorControlComponent', () => {
    let component: XmAngularEditorControl;
    let fixture: ComponentFixture<XmAngularEditorControl>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [XmAngularEditorControl],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(XmAngularEditorControl);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
