import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularEditorControlComponent } from './angular-editor-control.component';

describe('AngularEditorControlComponent', () => {
    let component: AngularEditorControlComponent;
    let fixture: ComponentFixture<AngularEditorControlComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AngularEditorControlComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AngularEditorControlComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
