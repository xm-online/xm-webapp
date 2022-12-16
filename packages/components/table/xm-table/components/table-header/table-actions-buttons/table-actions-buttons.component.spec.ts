import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TableActionsButtonsComponent} from './table-actions-buttons.component';

describe('TableActionsButtonsComponent', () => {
    let component: TableActionsButtonsComponent;
    let fixture: ComponentFixture<TableActionsButtonsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TableActionsButtonsComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TableActionsButtonsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
