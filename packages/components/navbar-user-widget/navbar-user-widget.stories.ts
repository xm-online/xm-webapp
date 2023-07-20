import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { XmToasterService } from '@xm-ngx/toaster';
import { DashboardStore } from '@xm-ngx/dashboard';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import {
    PageCollectionService,
} from '@xm-ngx/ext/entity-webapp-ext/module/page-entity-widget/entities/page-collection.service';
import { Principal, XmUserService } from '@xm-ngx/core/user';
import { XmDynamicExtensionModule, XmDynamicModule } from '@xm-ngx/dynamic';
import { XmPermissionService } from '@xm-ngx/core/permission';
import { MockPermissionService } from '@xm-ngx/core/permission/testing';
import { MockDashboardStore } from '@xm-ngx/core/dashboard/testing';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { XM_DATE_ELEMENTS } from '@xm-ngx/components/registry';
import { XM_HTML_ELEMENTS } from '@xm-ngx/components/registry';
import { XM_TEXT_ELEMENTS } from '@xm-ngx/components/registry';
import { XM_BOOL_ELEMENTS } from '@xm-ngx/components/registry';
import { XM_COPY_ELEMENTS } from '@xm-ngx/components/registry';
import { XM_LINK_ELEMENTS } from '@xm-ngx/components/registry';
import { XM_ENUM_ELEMENTS } from '@xm-ngx/components/registry';
import { XM_ARRAY_ELEMENTS } from '@xm-ngx/components/registry';
import { XM_TABLE_ELEMENTS } from '@xm-ngx/components/registry';
import { XM_NAVBAR_ELEMENTS } from '@xm-ngx/components/registry';
import { XM_DASHBOARD_ELEMENTS } from '@xm-ngx/dashboard/registry';
import { XM_ADMINISTRATION_ELEMENTS } from '@xm-ngx/administration/registry';
import { XM_COMPONENTS_ELEMENTS } from '@xm-ngx/components/registry';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { NavbarUserWidgetComponent } from '@xm-ngx/dashboard/navbar-user-widget';
import { MockUserService } from '@xm-ngx/core/user/testing';
import { ActivatedRoute } from '@angular/router';
import { EntityCollectionFactoryService } from '@xm-ngx/components/entity-collection';

export default {
    title: 'Core/Widget/Navbar user',
    component: NavbarUserWidgetComponent,
    decorators: [
        moduleMetadata({
            imports: [
                HttpClientTestingModule,
                XmTranslationTestingModule,
                BrowserAnimationsModule,
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
                EntityCollectionFactoryService,
                {provide: DashboardStore, useClass: MockDashboardStore},
                {provide: XmUserService, useClass: MockUserService},
                {provide: ActivatedRoute, useValue: {params: of()}},
                {provide: Principal, useValue: {getUserKey: () => true}},
                {provide: XmPermissionService, useClass: MockPermissionService},
                {provide: XmToasterService, useValue: {}},
                {provide: PageCollectionService, useValue: {}},
                {
                    provide: XmUserService,
                    useValue: {
                        user$: () => of({
                            id: '111',
                            username: 'firstName lastName',
                            firstName: ' firstName',
                            lastName: 'lastName',
                            roleKey: 'TEST',
                            logins: [{login: 'login'}],
                            user: {
                                roleKey: 'TEST',
                                userKey: 'userKey',
                                logins: [{login: 'login'}],
                                firstName: 'FirstName',
                                lastName: 'LastName',
                                avatarUrl: 'https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/female/10.png',
                            },
                            avatarUrl: 'https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/female/10.png',
                        }),
                    },
                },
            ],
        }),
    ],
    parameters: {
        layout: 'centered',
    },
} as Meta;

const Template: Story<NavbarUserWidgetComponent> = (args: NavbarUserWidgetComponent) => ({
    component: NavbarUserWidgetComponent,
    props: args,
});

export const Default = Template.bind({});
Default.args = {
    config: {
        class: 'holder',
        subtitles: [
            {
                role: 'TEST',
                field: 'userKey',
                selector: '@xm-ngx/components/link',
                options: {
                    queryParams:'',
                    routerLink:'/test',
                    fieldTitle: {en: 'text:', uk: 'text:'},
                    fieldValue: '/link',
                    valueTitle:'title link',
                },
            },
        ],
    },
    user: {
        id: '111',
        username: 'FirstName LastName',
        firstName: 'FirstName',
        lastName: 'LastName',
        roleKey: 'TEST',
        logins: [{login: 'login'}],
        user: {
            roleKey: 'TEST',
            userKey: 'userKey',
            logins: [{login: 'login'}],
            firstName: 'FirstName',
            lastName: 'LastName',
            avatarUrl: 'https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/female/10.png',
        },
        avatarUrl: 'https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/female/10.png',
    } as any,
};
