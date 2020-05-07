import { BaseEntity } from '@xm-ngx/entity';
import { Translate } from '@xm-ngx/translation';
import { Layout } from './layout.model';
import { Widget } from './widget.model';

export interface DashboardConfig {
    slug?: string;
    orderIndex?: number;
    name?: Translate;
}

export interface DashboardLayout {
    class?: string;
    layout?: Layout[];
    /** @deprecated use layout instead */
    grid?: Layout[];
}

export interface Dashboard<C = DashboardConfig, L = DashboardLayout> extends BaseEntity {
    id?: number;
    name?: string;
    owner?: string;
    typeKey?: string;
    layout?: L;
    config?: C;
    isPublic?: boolean;
}

export interface DashboardWithWidgets<C = DashboardConfig, L = DashboardLayout> extends Dashboard<C, L> {
    widgets?: Widget[];
}
