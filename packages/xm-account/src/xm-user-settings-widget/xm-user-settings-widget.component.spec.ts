import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XmUserSettingsWidgetComponent } from './xm-user-settings-widget.component';

describe('XmUserSettingsWidgetComponent', () => {
  let component: XmUserSettingsWidgetComponent;
  let fixture: ComponentFixture<XmUserSettingsWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XmUserSettingsWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XmUserSettingsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
