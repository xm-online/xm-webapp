import { ITranslate, Translate } from '@xm-ngx/translation';
import { MenuPositionEnum } from './menu.model';
import { DataQa } from '@xm-ngx/interfaces';

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
    /**
     * Your brand logo that will be shown in the top of the categories
     * Applicable only for M3 menu configuration
     */
    logo: BrandLogo;
}

export interface MenuItem extends DataQa {
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
    isActiveRoute?: boolean;
}

export interface MenuCategory extends DataQa {
    name?: ITranslate;
    icon?: string;
    url?: string[];
    order?: number;
    hasChildren?: boolean;
    isLinkWithoutSubcategories?: boolean;
}

export interface BrandLogo {
    url: string;
    size?: number;
}

export interface HoveredMenuCategory {
    hoveredCategory: MenuCategory;
    isOpenMenu: boolean;
}
