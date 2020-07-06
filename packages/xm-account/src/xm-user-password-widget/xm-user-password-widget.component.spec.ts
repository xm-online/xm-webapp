import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XmUserPasswordWidgetComponent } from './xm-user-password-widget.component';

describe('XmUserPasswordWidgetComponent', () => {
  let component: XmUserPasswordWidgetComponent;
  let fixture: ComponentFixture<XmUserPasswordWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XmUserPasswordWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XmUserPasswordWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
