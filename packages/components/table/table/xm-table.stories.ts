import { Meta, moduleMetadata, Story, applicationConfig } from '@storybook/angular';
import { XmTableComponent } from '@xm-ngx/components/table';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { XmToasterService } from '@xm-ngx/toaster';
import { XmAlertService } from '@xm-ngx/alert';
import { XmDynamicExtensionModule, XmDynamicModule } from '@xm-ngx/dynamic';
import { XmLogger, XmLoggerModule } from '@xm-ngx/logger';
import { RouterTestingModule } from '@angular/router/testing';
import { XM_DATE_ELEMENTS } from '@xm-ngx/components/xm-date.registry';
import { XM_HTML_ELEMENTS } from '@xm-ngx/components/xm-html.registry';
import { XM_TEXT_ELEMENTS } from '@xm-ngx/components/xm-text.registry';
import { XM_BOOL_ELEMENTS } from '@xm-ngx/components/xm-bool.registry';
import { XM_COPY_ELEMENTS } from '@xm-ngx/components/xm-copy.registry';
import { XM_LINK_ELEMENTS } from '@xm-ngx/components/xm-link.registry';
import { XM_ENUM_ELEMENTS } from '@xm-ngx/components/xm-enum.registry';
import { XM_ARRAY_ELEMENTS } from '@xm-ngx/components/xm-array.registry';
import { XM_TABLE_ELEMENTS } from '@xm-ngx/components/xm-table.registry';
import { XM_NAVBAR_ELEMENTS } from '@xm-ngx/components/xm-navbar.registry';
import { XM_DASHBOARD_ELEMENTS } from '@xm-ngx/dashboard/xm-dashboard.registry';
import { XM_ADMINISTRATION_ELEMENTS } from '@xm-ngx/administration/xm-administration.registry';
import { XM_COMPONENTS_ELEMENTS } from '@xm-ngx/components/xm.registry';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { LocalStorageService } from 'ngx-webstorage';
import {
    XmTableSettingStore
} from '@xm-ngx/components/table/controllers/config/xm-table-columns-setting-storage.service';


const mockLocalStorage = {
    retrieve(key: string): any {
        return {};
    },
    store(key: string): any {
        return {};
    },
};

export default {
    title: 'Core/Widget/Table',
    component: XmTableComponent,
    decorators: [
        applicationConfig({
            providers: [
                {provide: LocalStorageService, useValue: mockLocalStorage},
            ],
        }),
        moduleMetadata({
            imports: [
                RouterTestingModule,
                MatTableModule,
                BrowserAnimationsModule,
                HttpClientModule,
                XmLoggerModule,
                XmDynamicExtensionModule.forRoot([]),
                XmTranslationTestingModule,
                ControlErrorModule.forRoot({errorTranslates: XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES}),
                XmDynamicModule.forRoot([].concat(
                    XM_DATE_ELEMENTS,
                    XM_HTML_ELEMENTS,
                    XM_TEXT_ELEMENTS,
                    XM_BOOL_ELEMENTS,
                    XM_COPY_ELEMENTS,
                    XM_LINK_ELEMENTS,
                    XM_ENUM_ELEMENTS,
                    XM_ARRAY_ELEMENTS,
                    XM_TABLE_ELEMENTS,
                    XM_NAVBAR_ELEMENTS,
                    XM_DASHBOARD_ELEMENTS,
                    XM_ADMINISTRATION_ELEMENTS,
                    XM_COMPONENTS_ELEMENTS,
                )),
            ],
            providers: [
                XmTableSettingStore,
                {provide: LocalStorageService, useValue: mockLocalStorage},
                {provide: XmToasterService, useValue: {}},
                {provide: XmAlertService, useValue: {}},
                {provide: XmLogger, useValue: {}},
            ],
        }),
    ],
    parameters: {
        layout: 'centered',
    },
} as Meta;

const Template: Story<XmTableComponent> = (args: XmTableComponent) => ({
    component: XmTableComponent,
    props: args,
});

export const Default: Story<XmTableComponent> = Template.bind({});
Default.args = {
    config: {
        collection: {
            repository: null, type: 'config',
        },
        path: 'data',
        data: [{id: 111, name: 'test', age: '25'}],
        title: {en: 'Test table'},
        filters: [{
            selector: '@xm-ngx/components/text-control',
            name: 'name',
            class: 'data',
            style: 'data',
            condition: '',
            value: '',
            options: {
                title: {en: 'name'},
                required: false,
            },
        }],
        columns: [
            {
                selector: '@xm-ngx/components/text',
                title: {en: 'Name'},
                field: 'name',
                sortable: true,
                sticky: true,
                name: 'name',
                dataClass: 'string',
                dataStyle: 'data',
                class: 'data',
                style: 'data',
            },
            {
                name: 'id',
                field: 'id',
                title: {en: 'ID'},
                sortable: true,
                dataClass: '',
                dataStyle: '',
                selector: '@xm-ngx/components/text',
                class: '',
                style: '',
            },
            {
                name: 'age',
                field: 'age',
                title: {en: 'Age'},
                sortable: true,
                dataClass: '',
                dataStyle: '',
                selector: '@xm-ngx/components/text',
                class: '',
                style: '',
            },
        ],
        pageableAndSortable: {
            pageIndex: 0,
            pageSize: 10,
            total: 0,
            sortOrder: 'asc',
            sortBy: 'id',
            pageSizeOptions: [10, 20, 50],
            hidePagination: false,

        },
    } as any,
};
