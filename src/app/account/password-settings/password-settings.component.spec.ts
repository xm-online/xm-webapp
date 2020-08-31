import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordSettingsComponent } from './password-settings.component';

describe('PasswordSettingsComponent', () => {
  let component: PasswordSettingsComponent;
  let fixture: ComponentFixture<PasswordSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
