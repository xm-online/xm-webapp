import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { HintModule } from '@xm-ngx/components/hint';
import { XmLink, XmLinkViewComponent } from '@xm-ngx/components/link';
import { XmTextViewModule } from '@xm-ngx/components/text';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';


export default {
    title: 'Core/Presentation/Link/View',
    component: XmLinkViewComponent,
    decorators: [
        moduleMetadata({
            imports: [
                BrowserAnimationsModule,
                ControlErrorModule,
                XmTranslationTestingModule,
                HintModule,
                ControlErrorModule.forRoot({errorTranslates: XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES}),

                CommonModule,
                XmTextViewModule,
                RouterModule,
                MatIconModule,
                XmLink,
            ],
        }),
    ],
    parameters: {
        layout: 'centered',
    },
} as Meta;

const Template: Story<XmLinkViewComponent> = (args: XmLinkViewComponent) => ({
    component: XmLinkViewComponent,
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
