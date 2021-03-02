import { XmCheckboxControlOptions } from '@xm-ngx/components/checkbox-control';
import { XmEmailControlOptions, XmPasswordControlOptions } from '@xm-ngx/components/text';
import { Translate } from '@xm-ngx/translation';

export interface XmSignInFormOptions {
    rememberMe: XmCheckboxControlOptions | null;
    subtitle: Translate;
    title: Translate;
    username: XmEmailControlOptions;
    password: XmPasswordControlOptions;
}
