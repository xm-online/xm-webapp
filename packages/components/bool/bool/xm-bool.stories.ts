import { Meta, Story, moduleMetadata } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { XmBoolComponent } from '@xm-ngx/components/bool';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';

export default {
    title: 'Core/Presentation/Bool',
    component: XmBoolComponent,
    decorators: [
        moduleMetadata({
            imports: [
                CommonModule,
                MatIconModule,
                BrowserAnimationsModule,
                ControlErrorModule.forRoot({errorTranslates: XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES}),
                XmTranslationTestingModule,
            ],
        }),
    ],
    parameters: {
        layout: 'centered',
    },
} as Meta;

const Template: Story<XmBoolComponent> = (args: XmBoolComponent) => ({
    component: XmBoolComponent,
    props: args,
});

export const Default = Template.bind({});
Default.args = {
    value: true,
};

export const CustomIcon = Template.bind({});
CustomIcon.args = {
    value: true,
    config: {
        icons: {
            true: 'favorite',
            false: 'sick',
        },
    },
};

export const CustomValue = Template.bind({});
CustomValue.args = {
    value: 'done',
    config: {
        acceptableValue: ['done'],
    },
};
