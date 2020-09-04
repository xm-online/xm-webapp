import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportEntitiesDetailsComponent } from './import-entities-details.component';

describe('ImportEntitiesDetailsComponent', () => {
  let component: ImportEntitiesDetailsComponent;
  let fixture: ComponentFixture<ImportEntitiesDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportEntitiesDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportEntitiesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
