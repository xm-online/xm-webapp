import { ButtonIconsInput, ToolbarInput, ViewOptionsInput } from '@fullcalendar/core/types/input-types';
import { DateInput } from '@fullcalendar/core/datelib/env';
import { LocaleSingularArg } from '@fullcalendar/core/datelib/locale';

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
    events?: (data, cb) => void;
    select?: (data) => void;
    eventClick?: (data) => void;
    timezone?: string;
}
