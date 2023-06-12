import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { HintModule } from '@xm-ngx/components/hint';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { XmPhoneNumberControlComponent } from '@xm-ngx/components/phone-number-control';
import { MatIconModule } from '@angular/material/icon';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { NgxMaskModule } from 'ngx-mask';

const getCaptionForLocale = (locale) => {
    switch (locale) {
        case 'en':
            return 'Phone Number';
        case 'ua':
            return 'Номер телефону';
        default:
            return 'Phone Number';
    }
};

export default {
    title: 'core/text/XmPhoneNumberControlComponent',
    component: XmPhoneNumberControlComponent,
    decorators: [
        moduleMetadata({
            imports: [
                ReactiveFormsModule,
                FormsModule,
                MatFormFieldModule,
                MatInputModule,
                BrowserAnimationsModule,
                ControlErrorModule,
                XmTranslationTestingModule,
                MatIconModule,
                HintModule,
                NgxMaskModule.forRoot(),
                ControlErrorModule.forRoot({errorTranslates: XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES}),
            ],
        }),
    ],
    parameters: {
        layout: 'centered',
    },
} as Meta;

const Template: Story<XmPhoneNumberControlComponent> = (args: XmPhoneNumberControlComponent, {globals: {locale}}) => ({
    component: XmPhoneNumberControlComponent,
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
        id: 'phoneNumber-1',
        defaultPrefix: '38',
        pattern: '\\d+',
        mask: '(000)-000-00-00',
        required: true,
        placeHolderCharacter: '_',
        hint: {en: 'Enter your phone number.', ua: 'Введіть свій номер телефону.'},
    },
};

export const NotRequired = Template.bind({});
NotRequired.args = {
    config: {
        id: 'phoneNumber-2',
        defaultPrefix: '38',
        pattern: '\\d+',
        mask: '(000)-000-00-00',
        required: false,
        placeHolderCharacter: '_',
        hint: {en: 'Enter your phone number (optional).', ua: 'Введіть свій номер телефону (необов’язково).'},
    },
};
