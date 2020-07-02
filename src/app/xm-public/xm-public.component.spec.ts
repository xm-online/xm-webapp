import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XmPublicComponent } from './xm-public.component';

describe('XmPublicComponent', () => {
  let component: XmPublicComponent;
  let fixture: ComponentFixture<XmPublicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XmPublicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XmPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
