import { applicationConfig, Meta, moduleMetadata } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { XmAlertConfig, XmAlertModule, XmAlertService } from '@xm-ngx/alert';
import { Component, importProvidersFrom, Input } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { XmTranslationModule } from '@xm-ngx/translation';
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { XmCoreConfigModule } from '@xm-ngx/core/config';
import { XmLoggerModule } from '@xm-ngx/logger';
import { XmCoreModule } from '@xm-ngx/core';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { of } from 'rxjs';
import { XmCoreAuthModule } from '@xm-ngx/core/auth';

function StaticLoaderFactory() {
    return of(require('src/i18n/en.json'));
}

@Component({
    selector: 'demo-dialog',
    template: `
        <button (click)="open()">Open dialog</button>
    `,
})
class DemoDialogButtonComponent {
    @Input() public config: XmAlertConfig;

    constructor(private alertService: XmAlertService) {
    }

    public open() {
        this.alertService.open(this.config);
    }
}

export default {
    title: 'Core/Widget/Alert',
    component: DemoDialogButtonComponent,
    decorators: [
        applicationConfig({
            providers: [
                importProvidersFrom(NgxWebstorageModule.forRoot()),
                importProvidersFrom(XmCoreModule.forRoot()),
                importProvidersFrom(XmCoreAuthModule.forRoot()),
                importProvidersFrom(XmLoggerModule.forRoot()),
                importProvidersFrom(XmCoreConfigModule),
                importProvidersFrom(HttpClientModule),
                importProvidersFrom(BrowserAnimationsModule),
                importProvidersFrom(TranslateModule.forRoot({
                    isolate: false,
                    loader: {
                        deps: [HttpClient],
                        provide: TranslateLoader,
                        useFactory: StaticLoaderFactory,
                    },
                })),
            ],
        }),
        moduleMetadata({
            declarations: [
                DemoDialogButtonComponent,
            ],
            imports: [
                CommonModule,
                BrowserAnimationsModule,
                MatDialogModule,
                TranslateModule.forRoot(),
                XmTranslationModule.forRoot(),
                XmAlertModule.forRoot(),
            ],
            providers: [],
        }),
    ],
    parameters: {
        layout: 'centered',
        injectInjectorToProps: true,
    },
} as Meta;

const buttonAlertDialogTemplate = (props): unknown => {
    return {
        props,
        component: DemoDialogButtonComponent,

    };
};

export const SimpleAlert = buttonAlertDialogTemplate.bind({});

SimpleAlert.args = {
    config: {
        aboveTitle: 'Optional label',
        title: 'Title',
        text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Confirm',
    } as Partial<XmAlertConfig>,
};

export const SimpleAlertHtml = buttonAlertDialogTemplate.bind({});

SimpleAlertHtml.args = {
    config: {
        aboveTitle: 'Optional label',
        title: 'Title',
        html: '<strong>Custom html</strong> <strike>Strike</strike> 🦁',
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Confirm',
    } as Partial<XmAlertConfig>,
};

export const SimpleAlertIcon = buttonAlertDialogTemplate.bind({});

SimpleAlertIcon.args = {
    config: {
        title: 'Title',
        icon: 'delete',
        center: true,
        text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Confirm',
    } as Partial<XmAlertConfig>,
};

export const SimpleAlertOops = buttonAlertDialogTemplate.bind({});

SimpleAlertOops.args = {
    config: {
        title: 'Oops',
        icon: 'error_outline',
        center: true,
        dialogActionsAlign: 'center',
        belowTitle: 'Something went wrong.',
        showCancelButton: false,
        confirmButtonText: 'Confirm',
        showConfirmButton: true,
    } as Partial<XmAlertConfig>,
};

export const SimpleAlertConfirm = buttonAlertDialogTemplate.bind({});

SimpleAlertConfirm.args = {
    config: {
        title: 'Are you sure?',
        icon: 'error_outline',
        center: true,
        dialogActionsAlign: 'center',
        belowTitle: 'You won\'t be able to revert this!',
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Yes, delete it',
        showConfirmButton: true,
    } as Partial<XmAlertConfig>,
};
