import { XmTextTitleOptions } from '../text-title';
import { DataQa } from '@xm-ngx/shared/interfaces';
import { HintText } from '@xm-ngx/components/hint/hint.interface';

export interface XmPasswordControlOptions extends XmTextTitleOptions, DataQa {
    hint?: HintText;
    id: string;
    autocomplete: string | 'off';
    required: boolean;
}
