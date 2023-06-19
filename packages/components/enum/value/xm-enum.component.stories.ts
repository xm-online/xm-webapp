import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { XmTextViewModule } from '@xm-ngx/components/text';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { XmEnumComponent } from '@xm-ngx/components/enum';

export default {
    title: 'core/enum/XmEnum',
    component: XmEnumComponent,
    decorators: [
        moduleMetadata({
            imports: [
                CommonModule, XmTextViewModule,
                RouterTestingModule,
                BrowserAnimationsModule,
                ControlErrorModule.forRoot({errorTranslates: XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES}),
                XmTranslationTestingModule,

            ],

        }),
    ],
    argTypes: {
        config: {
            options: ['Option1', 'Option2'],
            control: {type: 'select'},
        },
    },
} as Meta;

const Template: Story<XmEnumComponent> = (args: XmEnumComponent) => ({
    component: XmEnumComponent,
    props: args,
});

export const Default = Template.bind({});
Default.args = {
    value: 'option1',
    config: {
        items: [
            {title: 'Option1', value: 'option1'},
            {title: 'Option2', value: 'option2'},
        ],
    },
};

export const WithCustomTitles = Template.bind({});
WithCustomTitles.args = {
    value: 'option1',
    config: {
        items: [
            {title: 'Custom Title1', value: 'option1'},
            {title: 'Custom Title2', value: 'option2'},
        ],
    },
};
