import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XmTableComponent } from './xm-table.component';

describe('XmTableComponent', () => {
    let component: XmTableComponent<unknown>;
    let fixture: ComponentFixture<XmTableComponent<unknown>>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [XmTableComponent],
        })
            .compileComponents();

        fixture = TestBed.createComponent(XmTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
