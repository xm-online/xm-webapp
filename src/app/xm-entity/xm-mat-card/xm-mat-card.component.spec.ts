import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PageChangesStore } from '../../xm-dashboard/page-changes-store';
import { MockPageChangesStore } from '../../xm-dashboard/testing/mock-page-changes-store';

import { XmMatCardComponent } from './xm-mat-card.component';

describe('XmMatCardComponent', () => {
    let component: XmMatCardComponent;
    let fixture: ComponentFixture<XmMatCardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [XmMatCardComponent],
            providers: [
                { provide: PageChangesStore, useClass: MockPageChangesStore },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(XmMatCardComponent);
        component = fixture.componentInstance;
        component.options = {} as any;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
