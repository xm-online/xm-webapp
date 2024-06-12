import { applicationConfig, Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { XmTableWidget } from './xm-table-widget.component';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { XmToasterService } from '@xm-ngx/toaster';
import { XmAlertService } from '@xm-ngx/alert';
import { XmDynamicExtensionModule, XmDynamicModule, XmDynamicService } from '@xm-ngx/dynamic';
import { XmLogger, XmLoggerModule } from '@xm-ngx/logger';
import { RouterTestingModule } from '@angular/router/testing';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { LocalStorageService } from 'ngx-webstorage';
import { XmRepositoryConfig } from '@xm-ngx/repositories';
import { Observable, of } from 'rxjs';
import { DateAdapter, MatNativeDateModule, NativeDateAdapter } from '@angular/material/core';
import { XmTableWidgetConfig } from './xm-table-widget.config';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { XmTextComponent, XmTextControl } from '@xm-ngx/components/text';
import { XmDateComponent, XmDateControl } from '@xm-ngx/components/date';
import { XmTableSettingStore } from '../controllers/config/xm-table-columns-setting-storage.service';


const mockLocalStorage = {
    retrieve(key: string): any {
        return {};
    },
    store(key: string): any {
        return {};
    },
};

export class MockXmRepositoryService implements XmDynamicService<XmRepositoryConfig> {
    public config: XmRepositoryConfig;

    public query(): Observable<{ body: { date: string }[] }> {
        const data = [{date: '2023-07-26T19:55:19.923Z'}];
        const pagination = {total: 1};
        const res = Object.assign(data, pagination);
        return of({body: res});
    }
}

export default {
    title: 'Core/Widget/Table',
    component: XmTableWidget,
    decorators: [
        applicationConfig({
            providers: [
                {provide: LocalStorageService, useValue: mockLocalStorage},
                {provide: DateAdapter, useClass: NativeDateAdapter},
            ],
        }),
        moduleMetadata({
            imports: [
                RouterTestingModule,
                MatTableModule,
                BrowserAnimationsModule,
                HttpClientModule,
                HttpClientTestingModule,
                MatNativeDateModule,
                XmLoggerModule,
                XmDynamicExtensionModule.forRoot([]),
                XmTranslationTestingModule,
                ControlErrorModule.forRoot({errorTranslates: XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES}),
                XmDynamicModule.forRoot([].concat(
                    [
                        {
                            selector: 'xm-repository-mock-service',
                            loadChildren: () => MockXmRepositoryService,
                        },
                        {
                            selector: '@xm-ngx/components/text',
                            loadChildren: () => XmTextComponent,
                        },
                        {
                            selector: '@xm-ngx/components/text-control',
                            loadChildren: () => XmTextControl,
                        },
                        {
                            selector: '@xm-ngx/components/date',
                            loadChildren: () => XmDateComponent,
                        },
                        {
                            selector: '@xm-ngx/components/date-control',
                            loadChildren: () => XmDateControl,
                        },
                    ],
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
} as Meta<XmTableWidget>;


export const Config: StoryObj<XmTableWidget> = {
    args: {
        config: {
            collection: {
                type: 'config',
                path: 'staticData',
                staticData: [{id: 111, name: 'test', age: '25'}],
            },
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
                    class: '',
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
            showFilterChips: false,
            filters: [
                {
                    selector: '@xm-ngx/components/text-control',
                    name: 'name',
                    class: 'col-6',
                    condition: '',
                    value: '',
                    options: {
                        title: {en: 'name'},
                        required: false,
                    },
                },
                {
                    selector: '@xm-ngx/components/text-control',
                    name: 'id',
                    class: 'col-6',
                    condition: '',
                    value: '',
                    options: {
                        title: {en: 'id'},
                        required: false,
                    },
                }
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
            title: {en: 'Test table'},
        } as XmTableWidgetConfig,
    },
};

export const ConfigFilterPopPup: StoryObj<XmTableWidget> = {
    args: {
        config: {
            collection: {
                type: 'config',
                path: 'staticData',
                staticData: [{id: 111, name: 'test', age: '25'}],
            },
            columns: [
                {
                    selector: '@xm-ngx/components/text',
                    title: {en: 'Name'},
                    field: 'name',
                    sortable: true,
                    name: 'name',
                    class: 'data',
                    style: 'data',
                },
            ],
            popUpFilter: true,
            showFilterChips: true,
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
            pageableAndSortable: {
                pageIndex: 0,
                pageSize: 10,
                total: 0,
                sortOrder: 'asc',
                sortBy: 'id',
                pageSizeOptions: [10, 20, 50],
                hidePagination: false,

            },
            title: {en: 'Test table'},
        } as XmTableWidgetConfig,
    },
};


export const Repository: StoryObj<XmTableWidget> = {
    args: {
        config: {
            'chips': [
                {
                    'selector': '@xm-ngx/components/date',
                    'name': 'date',
                    'config': {
                        'format': 'dd.MM.yyyy HH:mm',
                    },
                },
            ],
            'collection': {
                'type': 'repository',
                'repository': {
                    'config': {
                        'resourceUrl': 'api/v1/rest',
                    },
                    'selector': 'xm-repository-mock-service',
                },
            },
            'columns': [
                {
                    'selector': '@xm-ngx/components/date',
                    'title': {
                        'en': 'Date',
                        'uk': 'Дата',
                    },
                    'field': 'date',
                    'config': {
                        'format': 'dd.MM.yyyy HH:mm',
                    },
                },
            ],
            'filters': [
                {
                    'selector': '@xm-ngx/components/date-control',
                    'options': {
                        'title': {
                            'en': 'Phone',
                            'uk': 'Телефон',
                        },
                        'required': false,
                    },
                    'name': 'date',
                },
            ],
        } as XmTableWidgetConfig,
    },
};


export const Entity: StoryObj<XmTableWidget> = {
    args: {
        config: {
            'chips': [
                {
                    'selector': '@xm-ngx/components/date',
                    'name': 'date',
                    'config': {
                        'format': 'dd.MM.yyyy HH:mm',
                    },
                },
            ],
            'collection': {
                'type': 'repository',
                'repository': {
                    'config': {
                        'query': {
                            'typeKey': 'TYPEKEY'
                        },
                        'resourceUrl': 'entity/api/xm-entities',
                    } as XmRepositoryConfig,
                    'selector': '@xm-ngx/components/entity-repository',
                },
            },
            'columns': [
                {
                    'selector': '@xm-ngx/components/date',
                    'title': {
                        'en': 'Date',
                        'uk': 'Дата',
                    },
                    'field': 'date',
                    'config': {
                        'format': 'dd.MM.yyyy HH:mm',
                    },
                },
            ],
            'filters': [
                {
                    'selector': '@xm-ngx/components/date-control',
                    'options': {
                        'title': {
                            'en': 'Phone',
                            'uk': 'Телефон',
                        },
                        'required': false,
                    },
                    'name': 'date',
                },
            ],
        } as XmTableWidgetConfig,
    },
};

export const TinyTableConfig: StoryObj<XmTableWidget> = {
    args: {
        config: {
            collection: {
                type: 'config',
                path: 'staticData',
                staticData: [
                    {indicator: 'Indicator 1', score: 8.2},
                    {indicator: 'Indicator 2', score: 7.4},
                    {indicator: 'Indicator 3', score: 9.9},
                    {indicator: 'Indicator 4', score: 4.5},
                    {indicator: 'Indicator 5', score: 8.8},
                ],
            },
            isTitleHidden: true,
            isCardMarginBottom: false,
            columns: [
                {
                    name: 'indicator',
                    field: 'indicator',
                    title: {en: 'Indicator'},
                    sortable: true,
                    dataClass: '',
                    dataStyle: 'min-width: 300px;',
                    selector: '@xm-ngx/components/text',
                    class: '',
                    style: '',
                },
                {
                    name: 'score',
                    field: 'score',
                    title: {en: 'Score'},
                    sortable: true,
                    dataClass: '',
                    dataStyle: 'min-width: 100px;',
                    selector: '@xm-ngx/components/text',
                    class: '',
                    style: '',
                },
            ],
            showFilterChips: false,
            pageableAndSortable: {
                hidePagination: true,
            },
            title: {en: 'Test table'},
        } as XmTableWidgetConfig,
    },
};
