import { XmTextViewModule } from '@xm-ngx/components/text';
import { XmDateValue, XmDateView, XmDateViewOptions } from '@xm-ngx/components/date/index';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';

// default export to define the component metadata
export default {
    title: 'Core/Presentation/Date/View',
    component: XmDateView,
    decorators: [
        moduleMetadata({
            imports: [
                XmTextViewModule,
                ControlErrorModule.forRoot({errorTranslates: XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES}),
                XmTranslationTestingModule,
            ],
        }),
    ],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        value: {control: 'date'},
        config: {control: 'object'},
    },
} as Meta;

export const Primary: Story<XmDateView> = (args: { value: XmDateValue; config: XmDateViewOptions }) => ({
    component: XmDateView,
    props: args,
});

Primary.args = {
    value: new Date().toISOString(),
    config: {
        format: 'shortDate',
        timezone: '+00:00',
        locale: 'en-US',
        title: 'Date',
        textStyle: 'inline',
    },
};

export const LongBlock: Story<XmDateView> = (args: { value: XmDateValue; config: XmDateViewOptions }) => ({
    component: XmDateView,
    props: args,
});

LongBlock.args = {
    value: new Date().toISOString(),
    config: {
        format: 'longDate',
        timezone: '+00:00',
        locale: 'en-US',
        title: 'Long Title',
    },
};
