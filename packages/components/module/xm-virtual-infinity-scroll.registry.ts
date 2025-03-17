import { XmDynamicEntry } from '@xm-ngx/dynamic';

export const XM_VIRTUAL_INFINITY_SCROLL_ELEMENTS: XmDynamicEntry[] = [
    {
        selector: 'virtual-infinite-scroll',
        loadChildren: () => import('@xm-ngx/components/virtual-infinite-scroll').then(m => m.XmVirtualInfiniteScrollWidget),
    },
    {
        selector: 'virtual-infinite-scroll-controller',
        loadChildren: () => import('@xm-ngx/components/virtual-infinite-scroll').then(m => m.XmVirtualInfiniteScrollController),
    }
];
