import {ITranslate, Translate} from '@xm-ngx/translation';
import {MenuPositionEnum} from '@xm-ngx/components/menu/menu.model';

export interface MenuOptions {
    /**
     * toggle: Just open like accordion
     * click: Open like accordion and navigate to first child
     */
    mode: 'toggle' | 'click';
    /**
     * start = left side of the screen
     * end = right side of the screen
     * More info: https://material.angular.io/components/sidenav/api#MatDrawer (`position` property)
     */
    mobileMenuPositioning: MenuPositionEnum;
}

export interface MenuItem {
    path: string;
    /**
     * @deprecated
     *
     * Previous version use class for hide menu item
     */
    class?: string;
    position: number;
    permission?: string | string[];
    url: string[];
    icon: string;
    title: Translate;
    parent: MenuItem,
    category?: MenuCategory;
    /**
     * @deprecated
     *
     * Not use anymore
     */
    key?: string
    /**
     * @deprecated
     *
     * If children empty is link
    */
    isLink?: boolean;
    children: MenuItem[];

    activeItemPathPatterns?: string[];
}

export interface MenuCategory {
    name?: ITranslate;
    icon?: string;
    url?: string[];
    order?: number;
    isLogo?: boolean;
    logo?: BrandLogo;
    hasChildren?: boolean;
    isLinkWithoutSubcategories?: boolean;
}

export interface BrandLogo {
    logoUrl: string;
    size: number;
}

export interface HoveredMenuCategory {
    hoveredCategory: MenuCategory;
    isOpenMenu: boolean;
}
