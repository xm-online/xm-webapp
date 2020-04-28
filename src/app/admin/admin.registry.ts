export const ADMIN_ELEMENTS = [
    {
        provide: 'xm-audits',
        useFactory: () => import('@xm-ngx/administration/audits').then(m => m.AuditsModule),
    },
];
