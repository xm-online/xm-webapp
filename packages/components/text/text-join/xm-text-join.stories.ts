import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { HintModule } from '@xm-ngx/components/hint';
import { XmTextJoinComponent } from './xm-text-join.component';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';

export default {
    title: 'Core/Cell/Text/Join',
    component: XmTextJoinComponent,
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

const Template: Story<XmTextJoinComponent> = (args: XmTextJoinComponent) => ({
    component: XmTextJoinComponent,
    props: args,
});

export const Default = Template.bind({});
Default.args = {
    value: 'Example Value',
    config: {
        templates: [
            {
                condition: false,
                title: 'first',
            },
            {
                condition: false,
                title: 'second',
            },
        ],
        joinSymbol: '&',
    },
};

export const NoTemplate = Template.bind({});
NoTemplate.args = {
    value: 'Another Example Value',
    config: null,
};
