import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WidgetListService } from '@xm-ngx/administration/dashboards-config/widget-edit/widget-list.service';
import { of } from 'rxjs';

import { SelectorTextControlComponent } from './selector-text-control.component';

describe('SelectorTextControlComponent', () => {
    let component: SelectorTextControlComponent;
    let fixture: ComponentFixture<SelectorTextControlComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: WidgetListService, useValue: { widgets$: of(null) } }],
            declarations: [SelectorTextControlComponent],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SelectorTextControlComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
