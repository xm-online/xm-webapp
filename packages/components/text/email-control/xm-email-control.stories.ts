import { Meta, moduleMetadata } from '@storybook/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { HintModule } from '@xm-ngx/components/hint';
import { XmEmailControl } from '../email-control';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';

export default {
    title: 'Core/Control/Text/Email',
    component: XmEmailControl,
    decorators: [
        moduleMetadata({
            imports: [
                ReactiveFormsModule,
                MatFormFieldModule,
                MatInputModule,
                BrowserAnimationsModule,
                ControlErrorModule,
                XmTranslationTestingModule,
                HintModule,
                ControlErrorModule.forRoot({errorTranslates: XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES}),
            ],
        }),
    ],
    parameters: {
        layout: 'centered',
    },
} as Meta;

const Template = (args: XmEmailControl) => ({
    component: XmEmailControl,
    props: args,
});

export const Default = Template.bind({});
Default.args = {
    config: {
        id: 'email-1',
        title: {en: 'Email', ua: 'Email'},
        required: true,
        dataQa: 'email-input',
        hint: {en: 'Enter your email address.'},
    },
};

export const NotRequired = Template.bind({});
NotRequired.args = {
    config: {
        id: 'email-2',
        title: {en: 'Email', ua: 'Email'},
        required: false,
        dataQa: 'email-input',
        hint: {en: 'Enter your email address.'},
    },
};
