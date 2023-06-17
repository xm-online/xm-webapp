import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { HintModule } from '@xm-ngx/components/hint';
import { XmLink } from '@xm-ngx/components/link';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { XmTranslationModule } from '@xm-ngx/translation';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';


export default {
    title: 'Core/Presentation/Link/Standard',
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
                RouterModule,
                XmTranslationModule,
                MatIconModule,
            ],
        }),
    ],
    parameters: {
        layout: 'centered',
    },
} as Meta;

const Template: Story<XmLink> = (args: XmLink) => ({
    component: XmLink,
    props: args,
});

export const Default = Template.bind({});
Default.args = {
    value: 'Example Value',
    config: {template: 'Template String'},
};

export const NoTemplate = Template.bind({});
NoTemplate.args = {
    value: 'Another Example Value',
    config: null,
};
