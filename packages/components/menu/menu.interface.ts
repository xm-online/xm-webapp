import { Translate } from '@xm-ngx/translation';

export interface MenuItem {
    path: string;
    /**
     * @deprecated
     *
     * Previous version use class for hide menu item
     */
    class?: string;
    position: number;
    permission?: string | string[];
    url: string[];
    icon: string;
    title: Translate;
    parent: MenuItem,
    /**
     * @deprecated
     *
     * Not use anymore
     */
    key?: string
    /**
     * @deprecated
     *
     * If children empty is link
    */
    isLink?: boolean;
    children: MenuItem[];
}
