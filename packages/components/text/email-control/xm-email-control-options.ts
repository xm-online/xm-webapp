import { DataQa } from '@xm-ngx/shared/interfaces';
import { Translate } from '@xm-ngx/translation';
import { HintText } from '@xm-ngx/components/hint/hint.interface';

export interface XmEmailControlOptions extends DataQa {
    hint?: HintText;
    title: Translate,
    id?: string,
    required?: boolean,
}
