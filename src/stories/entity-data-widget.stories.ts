import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { XmToasterService } from '@xm-ngx/toaster';
import { DashboardStore, PageChangesStore } from '@xm-ngx/dashboard';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder, FormsModule } from '@angular/forms';
import { PageEntityStore } from '@xm-ngx/ext/entity-webapp-ext/module/page-entity-widget/entity/page-entity-store';
import {
    PageCollectionService,
} from '@xm-ngx/ext/entity-webapp-ext/module/page-entity-widget/entities/page-collection.service';
import { Principal, XmUserService } from '@xm-ngx/core/user';
import { XmDynamicExtensionModule, XmDynamicModule } from '@xm-ngx/dynamic';
import { XmPermissionService } from '@xm-ngx/core/permission';
import { MockPermissionService } from '@xm-ngx/core/permission/testing';
import { MockDashboardStore } from '@xm-ngx/dashboard/testing';
import { PageFormService } from '@xm-ngx/ext/entity-webapp-ext/module/page-entity-widget/page-form.service';
import { of } from 'rxjs';
import {
    EntityDataWidgetComponent,
} from '@xm-ngx/ext/entity-webapp-ext/module/entity-data-widget/entity-data-widget.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
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
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
export default {
    title: 'DataWidgetComponent',
    component: EntityDataWidgetComponent,
    decorators: [
        moduleMetadata({
            imports: [
                HttpClientTestingModule,
                XmTranslationTestingModule,
                BrowserAnimationsModule,
                MatCardModule,
                FormsModule,
                ControlErrorModule.forRoot({errorTranslates: XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES}),
                XmDynamicExtensionModule.forRoot([]),
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
                FormBuilder,
                {provide: Principal, useValue: {getUserKey: () => true}},
                {provide: XmPermissionService, useClass: MockPermissionService},
                {provide: DashboardStore, useClass: MockDashboardStore},
                {
                    provide: PageFormService, useValue: {
                        isValid: () => null,
                        relatedValidators: () => [],
                        addGroup: () => {
                        },
                    },
                },
                {
                    provide: PageEntityStore, useValue: {
                        state$: () => of(3),
                        entity$: () => of({
                            id: '1111',
                            data: {
                                number: 'UA073003460000026000099999999',
                            },
                        }),
                    },
                },
                {provide: XmToasterService, useValue: {}},
                {provide: PageCollectionService, useValue: {}},
                {
                    provide: XmUserService,
                    useValue: {user$: () => of({id: '11111', roleKey: 'TEST_ROLE_NO_PERMISSION'})},
                },
                {provide: PageChangesStore, useValue: {}},
            ],
        }),
    ],
} as Meta;

const Template: Story<EntityDataWidgetComponent> = (args: EntityDataWidgetComponent) => ({
    component: EntityDataWidgetComponent,
    props: args,
});

export const Default = Template.bind({});
Default.args = {
    config: {
        condition: '!entity || !entity.data || !entity.data.isVirtual',
        contentHiddenByDefault: false,
        collapsableContent: true,
        title: {
            en: 'Data Widget Component ',
            ru: 'Data Widget Component',
            uk: 'Data Widget Component',
        },
        fields: [
            {
                field: 'id',
                selector: '@xm-ngx/components/text-control',
                col: '4',
                options: {
                    title: {
                        en: 'ID',
                        ru: 'ID',
                        uk: 'ID',
                    },
                },
            },
            {
                field: 'data.number',
                selector: '@xm-ngx/components/text-control',
                col: '6',
                options: {
                    pattern: '^[UA]{2}\\d{27}$',
                    title: {
                        en: 'Number',
                        ru: 'Number',
                        uk: 'Number',
                    },
                },
            },
        ],
    },
    entity: {
        id: '111',
        data: {
            number: 'UA073003460000026000099999999',
        },
    } as any,
};
