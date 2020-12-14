import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UaaLoginMngComponent } from './uaa-login-mng.component';

describe('UaaLoginMngComponent', () => {
  let component: UaaLoginMngComponent;
  let fixture: ComponentFixture<UaaLoginMngComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UaaLoginMngComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UaaLoginMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
