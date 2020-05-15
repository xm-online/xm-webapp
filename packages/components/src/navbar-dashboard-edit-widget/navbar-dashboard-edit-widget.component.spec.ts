import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarDashboardEditWidgetComponent } from './navbar-dashboard-edit-widget.component';

describe('NavbarDashboardEditComponent', () => {
  let component: NavbarDashboardEditWidgetComponent;
  let fixture: ComponentFixture<NavbarDashboardEditWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarDashboardEditWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarDashboardEditWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
