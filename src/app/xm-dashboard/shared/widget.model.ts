import { BaseEntity } from '@xm-ngx/entity';

export interface Widget<C = unknown> extends BaseEntity {
    id?: number;
    config?: C;
    dashboard?: number;
    isPublic?: boolean;
    name?: string;
    selector?: string;
}
