import { BaseEntity } from '@xm-ngx/entity';
import { Layout } from '../dynamic/dynamic-widget-layout.component';
import { Widget } from './widget.model';

export interface DashboardConfig {
    slug?: string;
}

export interface DashboardLayout {
    layout?: Layout[];
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
    widgets?: Widget[];
}
