import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XmUserLoginWidgetComponent } from './xm-user-login-widget.component';

describe('XmUserLoginWidgetComponent', () => {
  let component: XmUserLoginWidgetComponent;
  let fixture: ComponentFixture<XmUserLoginWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XmUserLoginWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XmUserLoginWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
