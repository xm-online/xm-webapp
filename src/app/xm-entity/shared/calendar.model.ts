import { BaseEntity } from '../../shared';
import { Event } from './event.model';
import { XmEntity } from './xm-entity.model';

export interface Calendar extends BaseEntity {
    id?: number;
    uuid?: string;
    readonly?: boolean;
    typeKey?: string;
    name?: string;
    description?: string;
    startDate?: string | Date;
    endDate?: string | Date;
    events?: Event[];
    xmEntity?: XmEntity;
}
