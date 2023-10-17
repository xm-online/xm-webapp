import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XmEnumComponent } from './xm-enum.component';
import { HintModule } from '@xm-ngx/components/hint';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';

export default {
    title: 'Core/Presentation/Enum/Standard',
    component: XmEnumComponent,
    decorators: [
        moduleMetadata({
            imports: [
                BrowserAnimationsModule,
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

const Template: Story<XmEnumComponent> = (args: XmEnumComponent) => ({
    component: XmEnumComponent,
    props: args,
});

export const ByTitles = Template.bind({});
ByTitles.args = {
    value: 'ua',
    config: {
        titles: {
            'ua': 'Ukraine',
            'pl': 'Poland',
        },
    },
};

export const ByItems = Template.bind({});
ByItems.args = {
    value: 'pl',
    config: {
        items: [
            {title: 'Ukraine', value: 'ua'},
            {title: 'Poland', value: 'pl'},
        ],
    },
};

export const ValueNotMatch = Template.bind({});
ValueNotMatch.args = {
    value: 'uk',
    config: {
        titles: {
            'ua': 'Ukraine',
            'pl': 'Poland',
        },
    },
};
