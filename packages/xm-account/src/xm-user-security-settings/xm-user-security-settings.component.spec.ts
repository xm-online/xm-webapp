import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XmUserSecuritySettingsComponent } from './xm-user-security-settings.component';

describe('XmUserSecuritySettingsComponent', () => {
  let component: XmUserSecuritySettingsComponent;
  let fixture: ComponentFixture<XmUserSecuritySettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XmUserSecuritySettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XmUserSecuritySettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
