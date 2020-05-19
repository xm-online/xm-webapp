import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeysViewComponent } from './keys-view.component';

describe('KeysViewComponent', () => {
  let component: KeysViewComponent;
  let fixture: ComponentFixture<KeysViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeysViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeysViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
