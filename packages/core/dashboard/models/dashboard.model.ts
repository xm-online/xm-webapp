import { BaseEntity } from '@xm-ngx/core/entity';
import { JavascriptCode } from '@xm-ngx/interfaces';
import { DashboardWidget } from './dashboard-widget.model';
import { ActivatedRouteSnapshot } from '@angular/router';

export interface DashboardConfig {
    selector?: string;
    slug?: string;
    orderIndex?: number;
    condition?: JavascriptCode;
    name?: any;
    hidden?: JavascriptCode;
    permission?: string;
    icon?: string;
    activeItemPathPatterns?: string[];
    canActivateGuards?: {
        key: string,
        config: unknown,
        selector: string,
    }[];
    menu?: {
        section?: string;
        name?: string;
        groupIsLink?: boolean;
        group?: {
            name?: any;
            icon?: string;
            permission?: string;
            orderIndex?: number;
            key?: string;
        };
    };

    /**
     * Backward compatibility, @deprecated
     * TODO: add generics
     */
    [key: string]: any;
}

export interface DashboardLayoutLayout extends Partial<any> {
    // todo: there was XmDynamicControllerDeclaration interface usage, but according to high coupling we need to separate that dependency
    controllers?: {
        key: string,
        config: unknown,
        selector: string,
    }[];
    widget?: number | string | DashboardWidget;
    widgetName?: string;
    content?: DashboardLayoutLayout[];
}

export interface DashboardLayout {
    class?: string;
    style?: string;
    layout?: DashboardLayoutLayout | DashboardLayoutLayout[];
    /** @deprecated use layout instead */
    grid?: DashboardLayoutLayout[];
}

export interface Dashboard<C = DashboardConfig, L = DashboardLayout> extends BaseEntity {
    id?: number;
    name?: string;
    owner?: string;
    typeKey?: string;
    layout?: L;
    config?: C;
    isPublic?: boolean;

    /**
     * Backward compatibility
     * @deprecated use DashboardWithWidgets instead.
     * TODO: Backend, improve dashboard-microservice
     */
    widgets?: DashboardWidget[];
}

export interface DashboardWithWidgets<C = DashboardConfig, L = DashboardLayout> extends Dashboard<C, L> {
    widgets?: DashboardWidget[];
    targetId?: number;
}


export interface XmCanActivate {
    canActivate(value: DashboardConfig, route: ActivatedRouteSnapshot): boolean;
}
