export const ADMIN_ELEMENTS = [
    {
        provide: '@xm-ngx/administration/audits',
        useFactory: () => import('@xm-ngx/administration/audits').then(m => m.AuditsModule),
    },
    {
        provide: '@xm-ngx/administration/docs',
        useFactory: () => import('@xm-ngx/administration/docs').then(m => m.DocsModule),
    },
    {
        provide: '@xm-ngx/administration/form-playground',
        useFactory: () => import('@xm-ngx/administration/form-playground').then(m => m.FormPlaygroundModule),
    },
    {
        provide: '@xm-ngx/administration/gateway',
        useFactory: () => import('@xm-ngx/administration/gateway').then(m => m.GatewayModule),
    },
    {
        provide: '@xm-ngx/administration/health',
        useFactory: () => import('@xm-ngx/administration/health').then(m => m.HealthModule),
    },
    {
        provide: '@xm-ngx/administration/logs',
        useFactory: () => import('@xm-ngx/administration/logs').then(m => m.LogsModule),
    },
    {
        provide: '@xm-ngx/administration/maintenance',
        useFactory: () => import('@xm-ngx/administration/maintenance').then(m => m.MaintenanceModule),
    },
    {
        provide: '@xm-ngx/administration/roles-matrix',
        useFactory: () => import('@xm-ngx/administration/roles-matrix').then(m => m.RolesMatrixModule),
    },
    {
        provide: '@xm-ngx/administration/metrics',
        useFactory: () => import('@xm-ngx/administration/metrics').then(m => m.MetricModule),
    },

];
