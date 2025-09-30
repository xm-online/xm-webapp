import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef, inject, NgZone,
    OnDestroy,
    OnInit, QueryList,
    ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { XmTranslationModule } from '@xm-ngx/translation';
import { BrandLogo, HoveredMenuCategory, MenuCategory } from '../menu.interface';
import { MenuService } from '../menu.service';
import {
    concatMap,
    from,
    fromEvent,
    Observable,
    of,
    Subscription,
    take,
    timer,
    merge,
    combineLatest,
    startWith,
} from 'rxjs';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { hideCategories } from '../menu.animation';
import { MenuCategoriesClassesEnum } from '../menu.model';
import { map } from 'rxjs/operators';

@Component({
    selector: 'xm-menu-categories',
    templateUrl: './menu-categories.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    animations: [hideCategories],
    imports: [CommonModule, MatIconModule, XmTranslationModule, MatButtonModule, RouterLink],
})
export class MenuCategoriesComponent implements OnInit, OnDestroy, AfterViewInit {
    public readonly DEFAULT_LOGO_SIZE: number = 32;
    public readonly menuCategoriesClassesEnum: typeof MenuCategoriesClassesEnum = MenuCategoriesClassesEnum;
    public categories$: Observable<MenuCategory[]>;
    public selectedCategory: MenuCategory;
    public hoveredCategory: MenuCategory;
    public isSidenavPinned: boolean;
    public isCategoriesHidden$: Observable<boolean>;
    public brandLogo$: Observable<BrandLogo>;
    private hoverSubscription: Subscription;
    @ViewChildren('menuCategory', {read: ElementRef}) private menuCategories: QueryList<ElementRef>;
    private ngZone: NgZone = inject(NgZone);

    constructor(
        private menuService: MenuService,
        private router: Router,
        private cdr: ChangeDetectorRef,
    ) {
    }

    public ngOnInit(): void {
        this.assignSidenavObservers();
        this.observeSelectedCategory();
        this.observeIsSidenavPinned();
        this.observeHoveredCategory();
    }

    public ngAfterViewInit() {
        combineLatest([
            this.categories$,
            this.menuCategories.changes.pipe(
                startWith(this.menuCategories),
                takeUntilOnDestroy(this),
            ),
        ]).subscribe(([items, list]) => {
            if (!list.length) {
                return;
            }
            this.initListeners(list.toArray(), items);
        });
    }

    public initListeners(elements: ElementRef[], items: MenuCategory[]) {
        this.ngZone.runOutsideAngular(() => {
            const enterStream$ = elements.map((elRef, i) => {
                return fromEvent(elRef.nativeElement, 'mouseenter').pipe(map(() => ({
                    category: items[i],
                    isEnter: true,
                })));
            });

            const leaveStream$ = elements.map((elRef) => {
                return fromEvent(elRef.nativeElement, 'mouseleave').pipe(map(() => ({
                    isEnter: false,
                    category: null,
                })));
            });

            const all$ = merge(...enterStream$, ...leaveStream$);
            all$
                .pipe(
                    takeUntilOnDestroy(this),
                )
                .subscribe(({isEnter, category}) => {
                    if (isEnter) {
                        this.onHoverCategory(category);
                    } else {
                        this.closeHoverSubscription();
                    }
                });
        });
    }

    private assignSidenavObservers(): void {
        this.categories$ = this.menuService.menuCategories;
        this.isCategoriesHidden$ = this.menuService.isCategoriesHidden$;
        this.brandLogo$ = this.menuService.brandLogo;
    }

    private observeIsSidenavPinned(): void {
        this.menuService.isSidenavOpen
            .pipe(takeUntilOnDestroy(this))
            .subscribe((isOpened: boolean) => {
                this.isSidenavPinned = this.menuService.isMenuPinned(isOpened);
                this.cdr.markForCheck();
            });
    }

    private observeSelectedCategory(): void {
        this.menuService.selectedCategory.asObservable()
            .pipe(takeUntilOnDestroy(this))
            .subscribe((selectedCategory: MenuCategory) => {
                this.selectedCategory = selectedCategory;
                this.cdr.markForCheck();
            });
    }

    private observeHoveredCategory(): void {
        this.menuService.hoveredCategory
            .pipe(takeUntilOnDestroy(this))
            .subscribe((res: HoveredMenuCategory) => {
                this.hoveredCategory = res.hoveredCategory;
                this.cdr.markForCheck();
            });
    }

    public onHoverCategory(category?: MenuCategory): void {
        this.closeHoverSubscription();
        this.hoverSubscription = timer(200).pipe(
            concatMap(() => {
                if (!category.isLinkWithoutSubcategories || category?.hasChildren) {
                    this.ngZone.run(() => {
                        this.menuService.setHoveredCategory(category);
                    });
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
        this.isSidenavPinned = !this.isSidenavPinned;
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
