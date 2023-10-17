import { Meta, Story, moduleMetadata } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { XmBoolControl } from './xm-bool-control';

export default {
    title: 'Core/Control/Bool/Select',
    component: XmBoolControl,
    decorators: [
        moduleMetadata({
            imports: [
                CommonModule,
                FormsModule,
                ReactiveFormsModule,
                MatIconModule,
                MatFormFieldModule,
                MatSelectModule,
                MatOptionModule,
                ControlErrorModule,
                XmTranslationTestingModule,
                BrowserAnimationsModule,
                ControlErrorModule.forRoot({errorTranslates: XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES}),
            ],
        }),
    ],
    parameters: {
        layout: 'centered',
    },
} as Meta;

const Template: Story<XmBoolControl> = (args: XmBoolControl) => ({
    component: XmBoolControl,
    props: args,
});

export const Default = Template.bind({});
Default.args = {
    config: {
        title: 'Choose an option',
    },
    value: true,
};

export const Empty = Template.bind({});
Empty.args = {
    config: {
        title: 'Choose an option',
    },
    value: null,
};
