import { NgModule } from '@angular/core';
import { XmDynamicModule } from '@xm-ngx/dynamic';
import { XM_ARRAY_ELEMENTS } from './xm-array.registry';
import { XM_BOOL_ELEMENTS } from './xm-bool.registry';
import { XM_COPY_ELEMENTS } from './xm-copy.registry';
import { XM_DATE_ELEMENTS } from './xm-date.registry';
import { XM_HTML_ELEMENTS } from './xm-html.registry';
import { XM_TABLE_ELEMENTS } from './xm-table.registry';
import { XM_NAVBAR_ELEMENTS } from './xm-navbar.registry';
import { XM_LINK_ELEMENTS } from './xm-link.registry';
import { XM_COMPONENTS_ELEMENTS } from './xm.registry';
import { XM_TEXT_ELEMENTS } from './xm-text.registry';
import { XM_ENUM_ELEMENTS } from './xm-enum.registry';
import { XM_ICON_ELEMENTS } from './xm-icon.registry';
import { XM_LAYOUT_ELEMENTS } from './xm-layout.registry';
import { XM_VIRTUAL_INFINITY_SCROLL_ELEMENTS } from '@xm-ngx/components/module/xm-virtual-infinity-scroll.registry';


@NgModule({
    imports: [
        XmDynamicModule.forChild([
            XM_DATE_ELEMENTS,
            XM_HTML_ELEMENTS,
            XM_ICON_ELEMENTS,
            XM_TEXT_ELEMENTS,
            XM_BOOL_ELEMENTS,
            XM_COPY_ELEMENTS,
            XM_LINK_ELEMENTS,
            XM_ENUM_ELEMENTS,
            XM_ARRAY_ELEMENTS,
            XM_TABLE_ELEMENTS,
            XM_NAVBAR_ELEMENTS,
            XM_COMPONENTS_ELEMENTS,
            XM_LAYOUT_ELEMENTS,
            XM_VIRTUAL_INFINITY_SCROLL_ELEMENTS,
        ]),
    ],
})
export class XmNgxComponentsModule {
}
