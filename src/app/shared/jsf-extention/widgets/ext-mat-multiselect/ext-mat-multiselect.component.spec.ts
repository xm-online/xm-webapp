import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ExtMatMultiselectComponent} from './ext-mat-multiselect.component';

describe('ExtMatMultiselectComponent', () => {
  let component: ExtMatMultiselectComponent;
  let fixture: ComponentFixture<ExtMatMultiselectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtMatMultiselectComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtMatMultiselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
