import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineMngComponent } from './timeline-mng.component';

describe('TimelineMngComponent', () => {
  let component: TimelineMngComponent;
  let fixture: ComponentFixture<TimelineMngComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimelineMngComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
