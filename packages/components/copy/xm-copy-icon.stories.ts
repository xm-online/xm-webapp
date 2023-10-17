import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { XmCopyIconComponent, XmCopyIconOptions } from '../copy';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';

export default {
    title: 'Core/Presentation/Copy to clipboard',
    component: XmCopyIconComponent,
    decorators: [
        moduleMetadata({
            imports: [
                CommonModule,
                MatButtonModule,
                MatIconModule,
                ClipboardModule,
                MatSnackBarModule,
                BrowserAnimationsModule,
                ControlErrorModule.forRoot({errorTranslates: XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES}),
                XmTranslationTestingModule,
            ],
        }),
    ],
    parameters: {
        layout: 'centered',
    },
} as Meta;

const Template: Story<XmCopyIconComponent> = (args: XmCopyIconComponent) => ({
    component: XmCopyIconComponent,
    props: args,
});

export const Default = Template.bind({});
Default.args = {
    value: 'Copy this value',
    config: {
        template: 'This is the template: {{value}}',
        copiedMessage: 'This is the copied message',
    } as XmCopyIconOptions,
};

export const DifferentMessages = Template.bind({});
DifferentMessages.args = {
    value: 'Copy another value',
    config: {
        template: 'This is another template: {{value}}',
        copiedMessage: 'This is another copied message',
    } as XmCopyIconOptions,
};
