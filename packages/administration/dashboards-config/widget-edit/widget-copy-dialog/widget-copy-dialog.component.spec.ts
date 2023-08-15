import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetCopyDialogComponent } from './widget-copy-dialog.component';

describe('WidgetCopyDialogComponent', () => {
    let component: WidgetCopyDialogComponent;
    let fixture: ComponentFixture<WidgetCopyDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [WidgetCopyDialogComponent],
        })
            .compileComponents();

        fixture = TestBed.createComponent(WidgetCopyDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
