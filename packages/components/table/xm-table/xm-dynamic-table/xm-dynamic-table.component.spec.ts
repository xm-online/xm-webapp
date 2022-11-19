import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XmDynamicTableComponent } from './xm-dynamic-table.component';

describe('XmDynamicTableComponent', () => {
    let component: XmDynamicTableComponent;
    let fixture: ComponentFixture<XmDynamicTableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [XmDynamicTableComponent],
        })
            .compileComponents();

        fixture = TestBed.createComponent(XmDynamicTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
