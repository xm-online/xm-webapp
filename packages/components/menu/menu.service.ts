import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, debounceTime, from, Observable, of, Subject, switchMap } from 'rxjs';
import { BrandLogo, HoveredMenuCategory, MenuCategory, MenuItem } from './menu.interface';
import { MatDrawerMode, MatDrawerToggleResult, MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { cloneDeep, groupBy, orderBy, uniqBy } from 'lodash';
import { Router } from '@angular/router';
import { MenuCategoriesClassesEnum, MenuPositionEnum } from './menu.model';

@Injectable({providedIn: 'root'})
export class MenuService {
    private readonly DESKTOP_BIG_SCREEN: string = '(min-width: 1401px)';
    private readonly DESKTOP_SMALL_SCREEN: string = '(max-width: 1400px)';
    private readonly TABLET_SCREEN: string = '(min-width: 992px)';
    private readonly MOBILE_SCREEN: string = '(max-width: 991px)';
    private _sidenav: MatSidenav;
    private _menuCategories: BehaviorSubject<MenuCategory[]> = new BehaviorSubject<MenuCategory[]>([]);
    private _brandLogo: BehaviorSubject<BrandLogo> = new BehaviorSubject<BrandLogo>(null);
    private _hoveredCategory: Subject<HoveredMenuCategory> = new Subject<HoveredMenuCategory>();
    private _isSidenavOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private _isMaterial3Menu: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
    public selectedCategory: BehaviorSubject<MenuCategory> = new BehaviorSubject<MenuCategory>(null);
    public initialSidenavOpenedState: boolean;
    public isCategoriesHidden$: Observable<boolean>;
    public mobileMenuPositioning: MenuPositionEnum;
    public categories: Record<string, MenuCategory>;

    constructor(
        private breakpointObserver: BreakpointObserver,
        private router: Router,
    ) {
        this.initialSidenavOpenedState = breakpointObserver.isMatched(this.DESKTOP_BIG_SCREEN);
        this.isCategoriesHidden$ = this.getHiddenCategoriesObserver();
    }

    private getHiddenCategoriesObserver(): Observable<boolean> {
        return this.breakpointObserver.observe([this.MOBILE_SCREEN, this.TABLET_SCREEN])
            .pipe(
                switchMap((breakpointState: BreakpointState) => breakpointState.breakpoints[this.MOBILE_SCREEN] ? this.isSidenavOpen : of(true)),
            );
    }

    public get sidenav(): MatSidenav {
        return this._sidenav;
    }

    public set sidenav(sidenav: MatSidenav) {
        this._sidenav = sidenav;
        this.setIsSidenavOpen(sidenav?.opened);
    }

    public get menuCategories(): Observable<MenuCategory[]> {
        return this._menuCategories.asObservable();
    }

    public setMenuCategories(menuCategories: MenuCategory[]): void {
        const orderedCategories: MenuCategory[] = orderBy(menuCategories, 'order', 'asc');
        this._menuCategories.next(orderedCategories);
    }

    public setBrandLogo(brandLogo: BrandLogo): void {
        this._brandLogo.next(brandLogo);
    }

    public get brandLogo(): Observable<BrandLogo> {
        return this._brandLogo.asObservable();
    }

    public get hoveredCategory(): Observable<HoveredMenuCategory> {
        return this._hoveredCategory.asObservable();
    }

    public setHoveredCategory(category: MenuCategory, isOpenMenu: boolean = true): void {
        const hoveredCategory: HoveredMenuCategory = {
            hoveredCategory: category,
            isOpenMenu,
        };
        this._hoveredCategory.next(hoveredCategory);
    }

    public get isSidenavOpen(): Observable<boolean> {
        return this._isSidenavOpen.asObservable();
    }

    public setIsSidenavOpen(isOpen: boolean): void {
        this._isSidenavOpen.next(isOpen);
    }

    public get isMaterial3Menu(): Observable<boolean> {
        return this._isMaterial3Menu.asObservable();
    }

    public setIsMaterial3Menu(isMaterial3Menu: boolean): void {
        this._isMaterial3Menu.next(isMaterial3Menu);
    }

    public observeWindowSizeChange(): Observable<BreakpointState | MatDrawerToggleResult> {
        const windowSize$ = this.breakpointObserver.observe([this.TABLET_SCREEN, this.DESKTOP_SMALL_SCREEN, this.MOBILE_SCREEN, this.DESKTOP_BIG_SCREEN]);
        return combineLatest([windowSize$, this.isMaterial3Menu])
            .pipe(
                debounceTime(150),
                switchMap(([breakpointState, isMaterial3Menu]: [BreakpointState, boolean]) => {
                    const { value } = this._menuCategories;
                    const { breakpoints } = breakpointState;

                    this.sidenav.mode = this.getSidenavModeForCurrentWindowSize(breakpoints, isMaterial3Menu);
                    const isMobileScreen: boolean = breakpoints[this.MOBILE_SCREEN];
                    this.sidenav.position = isMobileScreen && !value.length ? this.mobileMenuPositioning : MenuPositionEnum.START;

                    if (isMobileScreen && this.sidenav.opened) {
                        return from(this.sidenav.close());
                    }

                    if (!this._menuCategories.value?.length && !this.sidenav.opened && !isMaterial3Menu) {
                        this.setHoveredCategory(this.otherCategory);
                        return this.breakpointObserver.isMatched(this.DESKTOP_BIG_SCREEN) ? from(this.sidenav.open()) : of(null);
                    }

                    if (this._menuCategories.value?.length && isMaterial3Menu) {
                        const isBigScreen: boolean = breakpoints[this.DESKTOP_BIG_SCREEN];
                        const isLargeAndClosed: boolean = isBigScreen && !this.sidenav.opened;
                        return this.selectedCategory.value && isLargeAndClosed && !this.selectedCategory.value?.isLinkWithoutSubcategories ?
                            from(this.sidenav.open()) : of(breakpointState);
                    }
                    return of(null);
                }),
            );
    }

    private getSidenavModeForCurrentWindowSize(breakpoints: Record<string, boolean>, isMaterial3Menu: boolean): MatDrawerMode {
        if (!isMaterial3Menu || breakpoints[this.DESKTOP_BIG_SCREEN]) {
            return 'side';
        }

        if (!breakpoints[this.MOBILE_SCREEN] &&
                (breakpoints[this.DESKTOP_SMALL_SCREEN] || breakpoints[this.TABLET_SCREEN]) &&
                    this._menuCategories.value?.length) {
            return 'over';
        }

        if (breakpoints[this.MOBILE_SCREEN]) {
            return 'push';
        }

        return 'side';
    }

    public mapMenuCategories(menu: MenuItem[]): MenuItem[] {
        return menu.map((menuItem: MenuItem) => {
            const { children, url } = menuItem || {};
            const category: MenuCategory = menuItem.category || this.checkCategoryExistence(menuItem.categoryKey);
            menuItem.category = {
                ...category,
                hasChildren: !!children?.length,
                url: category?.isLinkWithoutSubcategories ? url : null,
            };
            return menuItem;
        });
    }

    private checkCategoryExistence(categoryKey: string): MenuCategory {
        if (!categoryKey || !this.categories?.hasOwnProperty(categoryKey)) {
            return this.otherCategory;
        }
        return cloneDeep(this.categories[categoryKey]);
    }

    public getUniqMenuCategories(menu: MenuItem[]): MenuCategory[] {
        return uniqBy(
            menu.map((menuItem: MenuItem) => menuItem.category),
            (item: MenuCategory) => item.name?.en,
        );
    }

    public getGroupedMenuCategories(menu: MenuItem[]): Record<string, MenuItem[]> {
        return groupBy(menu, (item: MenuItem) => item?.category?.name?.en?.toLowerCase() || 'other');
    }

    public async hideMenuRightSide(selectedCategory?: MenuCategory, event?: any): Promise<void> {
        const isCategoriesContainer: boolean = event?.toElement?.classList?.contains(MenuCategoriesClassesEnum.MENU_CATEGORIES) as boolean;
        if (!this.breakpointObserver.isMatched(this.MOBILE_SCREEN) && !isCategoriesContainer) {
            !this.isOverMode && this.sidenav.opened && this.setHoveredCategory(selectedCategory);
            this.selectedCategory.next(selectedCategory);
        }
        let isCategoriesEl: boolean;
        if (event) {
            isCategoriesEl = Object.values(MenuCategoriesClassesEnum)
                .some((className: string) => event?.toElement?.classList?.contains(className));
        }
        !isCategoriesEl && ((this.isOverMode || selectedCategory?.isLinkWithoutSubcategories) && this.sidenav.opened) && await this.sidenav.close();
    }

    public async complexToggleSidenav(): Promise<void> {
        if (!this.breakpointObserver.isMatched(this.DESKTOP_SMALL_SCREEN)) {
            await this.sidenav.toggle();
            return;
        }

        this.sidenav.mode = this.isOverMode ? 'side' : 'over';
        await this.sidenav.toggle();
    }

    public setCategoryOnRouteChange(active: MenuItem, menu: MenuItem[]): MenuCategory {
        if (!this._isMaterial3Menu.value) {
            this.selectedCategory.next(this.otherCategory);
            this.setHoveredCategory(this.otherCategory, false);
            return this.otherCategory;
        }
        const singleCategory: MenuCategory = this._menuCategories.value?.find((category: MenuCategory) => this.isActiveUrl(category));
        const selectedCategory: MenuCategory = active?.parent?.category || active?.category || singleCategory || this.findPossibleCategoryForHiddenSection(menu) || this.reservedCategory;
        this.selectedCategory.next(selectedCategory);
        this.setHoveredCategory(selectedCategory, false);
        return selectedCategory;
    }

    public isActiveUrl(menuItem: MenuItem | MenuCategory): boolean {
        const isActiveRoute: boolean = this.router.isActive(menuItem.url?.join('/'), {
            fragment: 'ignored',
            matrixParams: 'ignored',
            queryParams: 'ignored',
            paths: 'exact',
        });
        /** For the case when page is hidden (doesn't display in menu) but we have to highlight the parent menu section */
        if (!isActiveRoute && menuItem.hasOwnProperty('activeItemPathPatterns')) {
            return (menuItem as MenuItem)?.activeItemPathPatterns?.some(pattern => new RegExp(pattern).test(this.router.url));
        }

        return isActiveRoute;
    }

    private findPossibleCategoryForHiddenSection(menu: MenuItem[]): MenuCategory {
        const parentPath: string = this.router.url.split('/')[2];
        return menu.find((item: MenuItem) => item.url[1] === parentPath)?.category;
    }

    private get reservedCategory(): MenuCategory {
        const isOtherCategoryExists: boolean = this._menuCategories.value.some((category: MenuCategory) => category.name === this.otherCategory.name);
        return isOtherCategoryExists ? this.otherCategory : null;
    }

    public get isOverMode(): boolean {
        return this.sidenav.mode === 'over';
    }

    public get isMobileView(): Observable<boolean> {
        return this.breakpointObserver.observe([this.MOBILE_SCREEN, this.TABLET_SCREEN])
            .pipe(
                switchMap((breakpointState: BreakpointState) => {
                    const {breakpoints} = breakpointState;
                    return of(breakpoints[this.MOBILE_SCREEN]);
                }),
            );
    }

    public get otherCategory(): MenuCategory {
        return {
            name: {
                en: 'Other',
                ru: 'Інше',
                uk: 'Інше',
            },
            order: 1,
            icon: 'more_horiz',
            hasChildren: true,
        };
    }
}
