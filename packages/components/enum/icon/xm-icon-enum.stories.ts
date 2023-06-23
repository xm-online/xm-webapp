import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XmIconEnumComponent } from '@xm-ngx/components/enum';
import { HintModule } from '@xm-ngx/components/hint';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';


export default {
    title: 'Core/Presentation/Enum/Icon',
    component: XmIconEnumComponent,
    decorators: [
        moduleMetadata({
            imports: [
                BrowserAnimationsModule,
                ControlErrorModule,
                XmTranslationTestingModule,
                HintModule,
                ControlErrorModule.forRoot({errorTranslates: XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES}),

                MatIconModule,
            ],
        }),
    ],
    parameters: {
        layout: 'centered',
    },
} as Meta;

const Template: Story<XmIconEnumComponent> = (args: XmIconEnumComponent) => ({
    component: XmIconEnumComponent,
    props: args,
});

export const Default = Template.bind({});
Default.args = {
    value: 'like',
    config: {
        items: [
            {
                icon: 'person',
                value: 'me',
            },
            {
                icon: 'favorite',
                value: 'like',
            },
            {
                icon: 'cross',
                value: false,
            },
        ],
    },
};

export const ValueNotMatch = Template.bind({});
ValueNotMatch.args = {
    value: 'uniq-value',
    config: {
        items: [
            {
                icon: 'person',
                value: 'me',
            },
            {
                icon: 'favorite',
                value: 'like',
            },
            {
                icon: 'cross',
                value: false,
            },
        ],
    },
};
