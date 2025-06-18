import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuCategoriesComponent } from './menu-categories.component';
import { Principal } from '@xm-ngx/core/user';
import { AccountService } from '@xm-ngx/core/user';
import { DashboardStore } from '@xm-ngx/core/dashboard';

describe('MenuCategoriesComponent', () => {
    let component: MenuCategoriesComponent;
    let fixture: ComponentFixture<MenuCategoriesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MenuCategoriesComponent],
            providers: [
                { provide: Principal, useValue: {} },
                { provide: AccountService, useValue: {} },
                { provide: DashboardStore, useValue: {} },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(MenuCategoriesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
