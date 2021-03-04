import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { XmConfigService } from '../../../../../src/app/shared';

import { TimelineMngComponent } from './timeline-mng.component';

describe('TimelineMngComponent', () => {
    let component: TimelineMngComponent;
    let fixture: ComponentFixture<TimelineMngComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: XmConfigService, useValue: { getConfig: () => of(null) } },
            ],
            declarations: [TimelineMngComponent],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TimelineMngComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
