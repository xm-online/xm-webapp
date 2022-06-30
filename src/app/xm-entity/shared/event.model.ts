import { BaseEntity } from './base-entity';
import { XmEntity } from './xm-entity.model';

export interface Event extends BaseEntity {
    id?: number;
    typeKey?: string;
    repeatRuleKey?: string;
    title?: string;
    description?: string;
    startDate?: string | Date;
    endDate?: string | Date;
    calendar?: number;
    assigned?: XmEntity;
    eventDataRef?: XmEntity;
    color?: string;
}
