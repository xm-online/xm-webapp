import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { MatIconModule } from '@angular/material/icon';
import { HintModule } from '@xm-ngx/components/hint';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { XmPasswordControl } from '../password-control';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';

const getCaptionForLocale = (locale) => {
    switch (locale) {
        case 'en':
            return 'Password';
        case 'ua':
            return 'Пароль';
        default:
            return 'Password';
    }
};
export default {
    title: 'Core/Control/Text/Password',
    component: XmPasswordControl,
    decorators: [
        moduleMetadata({
            imports: [
                ReactiveFormsModule,
                MatFormFieldModule,
                MatInputModule,
                BrowserAnimationsModule,
                ControlErrorModule,
                XmTranslationTestingModule,
                MatIconModule,
                HintModule,
                ControlErrorModule.forRoot({errorTranslates: XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES}),
            ],
        }),
    ],
    parameters: {
        layout: 'centered',
    },
} as Meta;

const Template: Story<XmPasswordControl> = (args: XmPasswordControl,{globals: {locale}}) => ({
    component: XmPasswordControl,
    props: {
        ...args,
        config: {
            ...args.config,
            title: getCaptionForLocale(locale),
            hint: args.config.hint[locale]
        }
    },
});

export const Default = Template.bind({});
Default.args = {
    config: {
        id: 'password-1',
        required: true,
        dataQa: 'password-input',
        autocomplete: 'password',
        hint: {en: 'Enter your password.', ua: 'Пароль'},
    },
};
Default.parameters = { globals: { locale: 'en' } };

export const NotRequired = Template.bind({});
NotRequired.args = {
    config: {
        id: 'password-2',
        required: false,
        dataQa: 'password-input',
        autocomplete: 'password',
        hint: {en: 'Enter your password (optional).', ua: 'Пароль'},
    },
};
