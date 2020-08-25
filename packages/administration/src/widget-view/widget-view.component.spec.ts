import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetViewComponent } from './widget-view.component';

describe('WidgetViewComponent', () => {
  let component: WidgetViewComponent;
  let fixture: ComponentFixture<WidgetViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
