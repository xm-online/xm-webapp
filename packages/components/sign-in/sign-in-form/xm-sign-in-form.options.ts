import { XmEmailControlOptions, XmPasswordControlOptions } from '@xm-ngx/components/text';
import { Translate } from '@xm-ngx/translation';

export interface XmSignInFormOptions {
  subtitle: Translate;
  title: Translate;
  username: XmEmailControlOptions;
  password: XmPasswordControlOptions;
}
