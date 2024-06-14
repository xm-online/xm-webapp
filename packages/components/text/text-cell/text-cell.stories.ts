import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Meta, moduleMetadata } from '@storybook/angular';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XmTextCellComponent, XmTextCellConfig } from './text-cell.component';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';

export default {
    title: 'Core/Cell/Text/Default',
    component: XmTextCellComponent,
    decorators: [
        moduleMetadata({
            imports: [
                CommonModule,
                MatButtonModule,
                MatIconModule,
                ControlErrorModule.forRoot({errorTranslates: XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES}),
                XmTranslationTestingModule,
                BrowserAnimationsModule,
                RouterTestingModule,
            ],
        }),
    ],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'For this component use selector <code>@xm-ngx/components/text-cell</code>',
            },
        },
    },
    tags: ['autodocs'],
} as Meta;

const Template = (args: XmTextCellComponent) => ({
    component: XmTextCellComponent,
    props: args,
});

export const Default = Template.bind({});
Default.args = {
    value: 'text value',
    config: {} as XmTextCellConfig,
};

export const AsLink = Template.bind({});
AsLink.args = {
    value: 'Some value',
    config: {
        transformQueryParams: {id: 'id'},
        routerLink: '/defined-route',
    } as XmTextCellConfig,
};

