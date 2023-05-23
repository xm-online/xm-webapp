// Button.stories.ts

import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { XmTableComponent } from '@xm-ngx/components/table';
import { LanguageService, XmTranslationModule } from '@xm-ngx/translation';
import { TranslateService } from '@ngx-translate/core';
import { XmToasterService } from '@xm-ngx/toaster';
import { XmAlertService } from '@xm-ngx/alert';
import { XmDynamicExtensionModule, XmDynamicModule } from '@xm-ngx/dynamic';
import { XmLogger, XmLoggerModule } from '@xm-ngx/logger';
import { XmCoreModule } from '@xm-ngx/core';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { XmUserService } from '@xm-ngx/core/user';

const meta: Meta<XmTableComponent> = {
    /* 👇 The title prop is optional.
     * See https://storybook.js.org/docs/angular/configure/overview#configure-story-loading
     * to learn how to generate automatic titles
     */
    title: 'table',
    component: XmTableComponent,
    decorators: [
        moduleMetadata({
            imports: [
                XmTranslationModule.forRoot(),
                XmTranslationModule.forChild(),
                XmDynamicModule.forRoot([]),
                XmDynamicModule.forChild([]),
                XmLoggerModule.forRoot(),
                XmCoreModule.forRoot(),
                NgxWebstorageModule.forRoot(),
                XmDynamicExtensionModule.forRoot([]),
                /*                TranslateModule.forRoot({
                                    isolate: false,
                                    loader: {deps: [HttpClient], provide: TranslateLoader, useFactory: HttpLoaderFactory},
                                }),*/
            ],
            declarations: [],
            providers: [
                /*                {
                                    provide: APP_INITIALIZER,
                                    multi: true,
                                    deps: [TranslateService,XmAlertService],
                                },*/
                {provide: XmToasterService, useValue: {}},
                {provide: TranslateService, useValue: {}},
                {provide: XmAlertService, useValue: {}},
                {provide: XmLogger, useValue: {}},
                {provide: XmUserService, useValue: {}},
                {provide: LanguageService, useValue: {}},


            ],
        }),
    ],
};

export default meta;
type Story = StoryObj<XmTableComponent>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/angular/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
    render: () => ({
        props: {
            label: 'table',
            backgroundColor: '#ff0',
        },
    }),
};

export const Secondary: Story = {
    render: () => ({
        props: {
            label: '😄👍😍💯',
            backgroundColor: '#ff0',
        },
    }),
};

export const Tertiary: Story = {
    render: () => ({
        props: {
            label: '📚📕📈🤓',
            backgroundColor: '#ff0',
        },
    }),
};
