// import { XmDynamicLayout } from '@xm-ngx/dynamic';
import { BaseEntity } from '@xm-ngx/core/entity';
import { XmDynamicControllerDeclaration } from '@xm-ngx/dynamic/presentation/xm-dynamic-presentation-base.directive';
import { JavascriptCode } from '@xm-ngx/interfaces';
// import { Translate } from '@xm-ngx/translation';
import { DashboardWidget } from './dashboard-widget.model';

export interface DashboardConfig {
    selector?: string;
    slug?: string;
    orderIndex?: number;
    condition?: JavascriptCode;
    name?: any;
    hidden?: JavascriptCode;
    permission?: string;
    icon?: string;
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

    /*
     * Backward compatibility, @deprecated
     * TODO: add generics
     */
    [key: string]: any;
}

export interface DashboardLayoutLayout extends Partial<any> {
    controllers?: XmDynamicControllerDeclaration[];
    widget?: number | string | DashboardWidget;
    widgetName?: string;
    content?: DashboardLayoutLayout[];
}

export interface DashboardLayout {
    class?: string;
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

    /*
     * Backward compatibility, @deprecated, use DashboardWithWidgets instead
     * TODO: Backend, improve dashboard-microservice
     */
    widgets?: DashboardWidget[];
}

export interface DashboardWithWidgets<C = DashboardConfig, L = DashboardLayout> extends Dashboard<C, L> {
    widgets?: DashboardWidget[];
}
