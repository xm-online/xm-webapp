import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdpCallbackComponent } from './idp-callback.component';

describe('IdpCallbackComponent', () => {
  let component: IdpCallbackComponent;
  let fixture: ComponentFixture<IdpCallbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdpCallbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdpCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
