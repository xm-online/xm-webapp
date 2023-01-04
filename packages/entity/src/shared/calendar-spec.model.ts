import { BaseSpec } from './base-spec';
import { EventSpec } from './event-spec.model';

export interface CalendarSpec extends BaseSpec {
    key?: string;
    readonly?: boolean;
    name?: any;
    events?: EventSpec[];
    timeZoneStrategy?: string;
    timeZoneDataRef?: string;
}
