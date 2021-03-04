import { BaseEntity } from '@xm-ngx/entity';

export interface DashboardWidget<C = any> extends BaseEntity {
    id?: number;
    config?: C;
    dashboard?: number
        /*
         * Backward compatibility,
         * TODO: Backend, improve dashboard-microservice
         */
        | { id?: number } | any;
    isPublic?: boolean;
    name?: string;
    selector?: string;

    /*
     * Backward compatibility, @deprecated
     * TODO: add generics
     */
    [key: string]: any;

}
