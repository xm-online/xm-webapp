import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportEntitiesDetailsComponent } from './export-entities-details.component';

describe('ExportEntitiesDetailsComponent', () => {
  let component: ExportEntitiesDetailsComponent;
  let fixture: ComponentFixture<ExportEntitiesDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportEntitiesDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportEntitiesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
