import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {XmTranslationModule} from '@xm-ngx/translation';
import {MenuCategory} from '../menu.interface';
import {MenuService} from '../menu.service';
import {Observable} from 'rxjs';
import {takeUntilOnDestroy, takeUntilOnDestroyDestroy} from '@xm-ngx/operators';
import {MatButtonModule} from '@angular/material/button';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {hideCategories} from '@xm-ngx/components/menu/menu.animation';
import {MenuCategoriesClassesEnum} from '@xm-ngx/components/menu/menu.model';

@Component({
    selector: 'xm-menu-categories',
    templateUrl: './menu-categories.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    animations: [hideCategories],
    imports: [CommonModule, MatIconModule, XmTranslationModule, MatButtonModule, RouterLinkActive, RouterLink, NgOptimizedImage],
})
export class MenuCategoriesComponent implements OnInit, OnDestroy {
    public readonly DEFAULT_LOGO_SIZE: number = 32;
    public readonly menuCategoriesClassesEnum: typeof MenuCategoriesClassesEnum = MenuCategoriesClassesEnum;
    public categories$: Observable<MenuCategory[]>;
    public selectedCategory: MenuCategory;
    public isSidenavOpened$: Observable<boolean>;
    public isCategoriesHidden$: Observable<boolean>;
    public logoCategory$: Observable<MenuCategory>;


    constructor(
        private menuService: MenuService,
        private router: Router,
        private cdr: ChangeDetectorRef,
    ) {
    }

    public ngOnInit(): void {
        this.assignSidenavObservers();
        this.observeSelectedCategory();
    }

    private assignSidenavObservers(): void {
        this.categories$ = this.menuService.menuCategories;
        this.isSidenavOpened$ = this.menuService.isSidenavOpen;
        this.isCategoriesHidden$ = this.menuService.isCategoriesHidden$;
        this.logoCategory$ = this.menuService.logoCategory;
    }

    private observeSelectedCategory(): void {
        this.menuService.selectedCategory.asObservable()
            .pipe(takeUntilOnDestroy(this))
            .subscribe((selectedCategory: MenuCategory) => {
                if (selectedCategory) {
                    this.selectedCategory = selectedCategory;
                    this.cdr.markForCheck();
                }
            });
    }

    public async onHoverCategory(category?: MenuCategory): Promise<void> {
        if (!category.isLinkWithoutSubcategories || category?.hasChildren) {
            this.menuService.setHoveredCategory(category);
        } else {
            this.menuService.sidenav.opened && !this.selectedCategory?.hasChildren && await this.menuService.sidenav.close();
        }
    }

    public async toggleSidenav(): Promise<void> {
        await this.menuService.complexToggleSidenav();
    }

    public async onNavigate(category: MenuCategory): Promise<void> {
        if (category.isLinkWithoutSubcategories && category.url && !category?.hasChildren) {
            this.menuService.selectedCategory.next(category);
            await this.router.navigate(category.url);
        }
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }
}
