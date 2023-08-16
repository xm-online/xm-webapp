import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardsListCopyDialogComponent } from './dashboards-list-copy-dialog.component';

describe('DashboardsListCopyDialogComponent', () => {
    let component: DashboardsListCopyDialogComponent;
    let fixture: ComponentFixture<DashboardsListCopyDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DashboardsListCopyDialogComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DashboardsListCopyDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
