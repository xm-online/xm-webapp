import { ButtonIconsInput, ToolbarInput, ViewOptionsInput } from '@fullcalendar/core/types/input-types';
import { DateInput } from '@fullcalendar/core/datelib/env';
import { LocaleSingularArg } from '@fullcalendar/core/datelib/locale';

interface EventsFunc {
    (data, successCallback): void;
}

interface SelectFunc {
    (data): void;
}

interface EventClickFunc {
    (data): void;
}

export interface IFullCalendarOptions {
    header?: ToolbarInput;
    buttonIcons?: ButtonIconsInput;
    views?: { [index: string]: ViewOptionsInput };
    locale?: LocaleSingularArg;
    defaultDate?: DateInput;
    selectable?: boolean;
    editable?: boolean;
    eventLimit?: boolean | number;
    defaultView?: string;
    events?: EventsFunc;
    select?: SelectFunc;
    eventClick?: EventClickFunc;
}
