import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { XmTranslationModule } from '@xm-ngx/translation';
import { BrandLogo, MenuCategory } from '../menu.interface';
import { MenuService } from '../menu.service';
import { concatMap, from, Observable, of, Subscription, take, timer } from 'rxjs';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { hideCategories } from '../menu.animation';
import { MenuCategoriesClassesEnum } from '../menu.model';

@Component({
    selector: 'xm-menu-categories',
    templateUrl: './menu-categories.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    animations: [hideCategories],
    imports: [CommonModule, MatIconModule, XmTranslationModule, MatButtonModule, RouterLinkActive, RouterLink],
})
export class MenuCategoriesComponent implements OnInit, OnDestroy {
    public readonly DEFAULT_LOGO_SIZE: number = 32;
    public readonly menuCategoriesClassesEnum: typeof MenuCategoriesClassesEnum = MenuCategoriesClassesEnum;
    public categories$: Observable<MenuCategory[]>;
    public selectedCategory: MenuCategory;
    public isSidenavOpened$: Observable<boolean>;
    public isCategoriesHidden$: Observable<boolean>;
    public brandLogo$: Observable<BrandLogo>;
    private hoverSubscription: Subscription;


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
        this.brandLogo$ = this.menuService.brandLogo;
    }

    private observeSelectedCategory(): void {
        this.menuService.selectedCategory.asObservable()
            .pipe(takeUntilOnDestroy(this))
            .subscribe((selectedCategory: MenuCategory) => {
                this.selectedCategory = selectedCategory;
                this.cdr.markForCheck();
            });
    }

    public onHoverCategory(category?: MenuCategory): void {
        this.closeHoverSubscription();
        this.hoverSubscription = timer(200).pipe(
            concatMap(() => {
                if (!category.isLinkWithoutSubcategories || category?.hasChildren) {
                    this.menuService.setHoveredCategory(category);
                    return of(null);
                }

                return this.menuService.sidenav.opened && !this.selectedCategory?.hasChildren ? from(this.menuService.sidenav.close()) : of(null);
            }),
            take(1),
        ).subscribe();
    }

    public closeHoverSubscription(): void {
        this.hoverSubscription && !this.hoverSubscription.closed && this.hoverSubscription.unsubscribe();
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
