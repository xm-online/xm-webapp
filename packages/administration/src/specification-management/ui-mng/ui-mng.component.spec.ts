import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiMngComponent } from './ui-mng.component';

describe('UiMngComponent', () => {
  let component: UiMngComponent;
  let fixture: ComponentFixture<UiMngComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiMngComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
