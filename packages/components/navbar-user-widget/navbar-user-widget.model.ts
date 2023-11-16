import { ITranslate } from '@xm-ngx/translation';
import { XmUser } from '@xm-ngx/core/user';
import { SidebarUserSubtitleOptions } from '@xm-ngx/components/sidebar-user';
import { Observable } from 'rxjs';
import { MenuItem } from '@xm-ngx/components/menu';

export interface LinkItem {
    url: string,
    title: ITranslate
}

export interface UserOptions {
    roleKey: string;
    username: string;
    avatarUrl: string;
    user: XmUser;
}

export interface ChangeAccount {
    url: string;
    title: ITranslate;
    icon?: string;
}

export interface SettingsBtn {
    url: string;
    title: ITranslate;
}


export interface UserNavBar {
    user: UserOptions;
    config: {
        subtitles: SidebarUserSubtitleOptions[];
    };
    avatarSize?: string,
    menu$: Observable<MenuItem[]>;
    subtitles: SidebarUserSubtitleOptions[],
    links: LinkItem[];
    changeAccount?: ChangeAccount;
    changePhoto?: boolean;
    settings?: SettingsBtn;
    primaryBtnUrl: string;
}
