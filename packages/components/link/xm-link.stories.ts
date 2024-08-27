import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Meta, moduleMetadata } from '@storybook/angular';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { HintModule } from '@xm-ngx/components/hint';
import { XmLink } from './xm-link';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { XmTranslationModule } from '@xm-ngx/translation';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';


export default {
    title: 'Core/Presentation/Link/Default',
    component: XmLink,
    decorators: [
        moduleMetadata({
            imports: [
                BrowserAnimationsModule,
                ControlErrorModule,
                XmTranslationTestingModule,
                HintModule,
                ControlErrorModule.forRoot({errorTranslates: XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES}),

                CommonModule,
                RouterTestingModule,
                XmTranslationModule,
                MatIconModule,
            ],
        }),
    ],
    parameters: {
        layout: 'centered',
    },
} as Meta;

const Template = (args: XmLink) => ({
    component: XmLink,
    props: args,
});

const entity = {
    id: '12345',
    name: 'John',
    data: {
        country: 'UA',
    },
};

export const Default = Template.bind({});
Default.args = {
    value: entity,
};


export const WithTitle = Template.bind({});
WithTitle.args = {
    value: entity,
    config: {
        valueTitle: 'User ID',
    },
};

export const CustomField = Template.bind({});
CustomField.args = {
    value: entity,
    config: {
        valueField: 'name',
    },
};

export const CustomNestedField = Template.bind({});
CustomNestedField.args = {
    value: entity,
    config: {
        valueField: 'data.country',
    },
};
