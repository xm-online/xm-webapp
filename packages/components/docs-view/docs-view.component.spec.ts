import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocsViewComponent } from './docs-view.component';

describe('DocsViewComponent', () => {
  let component: DocsViewComponent;
  let fixture: ComponentFixture<DocsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
