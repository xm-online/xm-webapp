import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleLockClientComponent } from './toggle-lock-client.component';

describe('ToggleLockClientComponent', () => {
  let component: ToggleLockClientComponent;
  let fixture: ComponentFixture<ToggleLockClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToggleLockClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleLockClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
