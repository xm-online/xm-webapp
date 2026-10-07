import { Translate } from '@xm-ngx/translation';

export interface XmTableWarningMessageConfig {
    controller: {
        key: string;
        method: string;
    };
    title?: Translate;
}
