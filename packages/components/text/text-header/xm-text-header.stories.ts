import { XmTextHeaderComponent } from '@xm-ngx/components/text';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { HintModule } from '@xm-ngx/components/hint';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';


export default {
    title: 'Core/Presentation/Text/text-header',
    component: XmTextHeaderComponent,
    decorators: [
        moduleMetadata({
            imports: [
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

const Template: Story<XmTextHeaderComponent> = (args: XmTextHeaderComponent) => ({
    props: args,
});

export const Default = Template.bind({});
Default.args = {
    value: 'Default Title',
    config: {
        title: 'Configured Title',
        layout: {
            theme: {
                style: 'color: blue;',
                class: 'custom-class',
            },
        },
    },
};

export const WithCustomStyle = Template.bind({});
WithCustomStyle.args = {
    config: {
        title: 'Custom Styled Title',
        layout: {
            theme: {
                style: 'color: red; font-size: 24px;',
                class: '',
            },
        },
    },
};

export const WithCustomClass = Template.bind({});
WithCustomClass.args = {
    config: {
        title: 'Custom Class Title',
        layout: {
            theme: {
                style: '',
                class: 'custom-header-class',
            },
        },
    },
};
