import { Meta, moduleMetadata } from '@storybook/angular';
import { NavbarUserWidgetComponent } from './navbar-user-widget.component';
import { MockDashboardStore } from '@xm-ngx/core/dashboard/testing';
import { DashboardStore } from '@xm-ngx/core/dashboard';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { XmDynamicExtensionModule, XmDynamicModule } from '@xm-ngx/dynamic';
import { XmLink } from '@xm-ngx/components/link';
import { XmUserService } from '@xm-ngx/core/user';
import { of } from 'rxjs';

export default {
    title: 'Core/Widget/Navbar user',
    component: NavbarUserWidgetComponent,
    decorators: [
        moduleMetadata({
            imports: [
                XmTranslationTestingModule,
                RouterTestingModule,
                BrowserAnimationsModule,
                XmDynamicExtensionModule.forRoot([]),
                XmDynamicModule.forRoot([{
                    selector: '@xm-ngx/components/link',
                    loadChildren: () => XmLink,
                }]),
            ],
            providers: [
                {provide: DashboardStore, useClass: MockDashboardStore},
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

const Template = (args: NavbarUserWidgetComponent) => ({
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
