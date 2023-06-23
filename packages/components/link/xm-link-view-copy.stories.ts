import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XmCopyIconComponent } from '@xm-ngx/components/copy';
import { HintModule } from '@xm-ngx/components/hint';
import { XmLinkViewCopyComponent } from '@xm-ngx/components/link/index';
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
                RouterTestingModule,
                XmCopyIconComponent,
                MatSnackBarModule,
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
    config: {
        title: 'Title',
        valueField: 'name',
    },
};

export const CustomCopy = Template.bind({});
CustomCopy.args = {
    value: entity,
    config: {
        title: 'Title',
        valueField: 'name',
        icon: 'person',
        copy: {
            template: 'It is an id: {{value.id}}',
            copiedMessage: 'Id copied to clipboard',
        }
    },
};
