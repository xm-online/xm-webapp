import { Translate } from '@xm-ngx/translation';

interface Controller {
    key: string;
    method: string;
    config: any;
}

export interface ButtonConfigInterface {
    title?: Translate;
    icon?: string;
    tooltip?: string;
    class?: string;
    style?: string;
    permissions?: string[];
    controller?: Controller;
    dataQa: string;
}
