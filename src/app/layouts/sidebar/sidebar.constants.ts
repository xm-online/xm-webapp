export interface IAdminMenuItem {
    permitted?: string;
    locale: string;
    localeShort: string;
    isRouterLink: boolean;
    linkTo?: string;
    onClick?: any;
    order?: number;
    id?: string;
}

export const ADMIN_MENU_ITEMS: IAdminMenuItem[] = [
    {
        permitted: 'ACCOUNT.GET_LIST.ITEM',
        order: 0,
        isRouterLink: true,
        localeShort: 'global.menu.account.mini.settings',
        locale: 'global.menu.account.settings',
        linkTo: 'settings',
    },
    {
        permitted: 'ACCOUNT.PASSWORD.UPDATE',
        order: 2,
        isRouterLink: true,
        localeShort: 'global.menu.account.mini.password',
        locale: 'global.menu.account.password',
        linkTo: 'password',
    },
];
