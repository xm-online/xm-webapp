import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { XmToasterService } from '@xm-ngx/toaster';
import { DashboardStore } from '@xm-ngx/dashboard';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
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
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { MockUserService } from '@xm-ngx/core/user/testing';
import { ActivatedRoute } from '@angular/router';
import { EntityCollectionFactoryService } from '@xm-ngx/repositories';
import { NavbarUserWidgetComponent } from '../../dashboard/navbar-user-widget';

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
        docs: {
            description: {
                component: 'For this component use selector <code>@xm-ngx/components/navbar-user-widget</code>',
            },
        },
    },
    tags: ['autodocs'],
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
