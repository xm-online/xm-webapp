import { XmDynamicEntries } from '@xm-ngx/dynamic';

export default [
    {
        selector: '@xm-ngx/documentation/examples',
        loadChildren: () => import('./doc-examples/xm-doc-examples.module').then(m => m.XmDocExamplesModule),
    },
] as XmDynamicEntries;
