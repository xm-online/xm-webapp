import { Translate } from '@xm-ngx/translation';

export interface XmHtml {
    /** Provide class name you want to use */
    class?: string;
    /** Provide inline styles you want to use */
    style?: string;
    /** Provide HTML string or ITranslate object with the HTML values */
    html: Translate;
}
