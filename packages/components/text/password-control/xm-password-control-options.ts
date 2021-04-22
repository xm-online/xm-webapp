import { XmTextTitleOptions } from '@xm-ngx/components/text/text-title';
import { DataQa } from '@xm-ngx/shared/interfaces';

export interface XmPasswordControlOptions extends XmTextTitleOptions, DataQa {
    id?: string,
    required?: boolean,
}
