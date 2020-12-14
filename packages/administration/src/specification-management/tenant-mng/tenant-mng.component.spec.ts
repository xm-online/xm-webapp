import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantMngComponent } from './tenant-mng.component';

describe('TenantMngComponent', () => {
  let component: TenantMngComponent;
  let fixture: ComponentFixture<TenantMngComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenantMngComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
