import { BaseEntity } from '@xm-ngx/entity';
import { Metric } from './metric.model';
import { Pocket } from './pocket.model';

export class Balance implements BaseEntity {
    constructor(
        public id?: number,
        public key?: string,
        public typeKey?: string,
        public measureKey?: string,
        public amount?: number,
        public reserved?: number,
        public entityId?: number,
        public createdBy?: string,
        public pockets?: Pocket[],
        public metrics?: Metric[],
    ) {
    }
}
