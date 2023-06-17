import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XmCopyIconComponent } from '@xm-ngx/components/copy';
import { HintModule } from '@xm-ngx/components/hint';
import { XmLinkViewCopyComponent } from '@xm-ngx/components/link';
import { XmTextViewModule } from '@xm-ngx/components/text';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { XmTranslationModule } from '@xm-ngx/translation';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';


export default {
    title: 'Core/Presentation/Link/View copy',
    component: XmLinkViewCopyComponent,
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
                XmTranslationModule,
                RouterModule,
                XmCopyIconComponent,
            ],
        }),
    ],
    parameters: {
        layout: 'centered',
    },
} as Meta;

const Template: Story<XmLinkViewCopyComponent> = (args: XmLinkViewCopyComponent) => ({
    component: XmLinkViewCopyComponent,
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
