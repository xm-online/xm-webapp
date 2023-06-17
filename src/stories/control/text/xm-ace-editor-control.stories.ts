import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import {
    XmAceEditorControl,
    XmAceEditorDirective,
    XmAceEditorThemeSchemeAdapterDirective,
} from '@xm-ngx/components/ace-editor';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';

export default {
    title: 'Core/Control/Text/Ace editor',
    component: XmAceEditorControl,
    decorators: [
        moduleMetadata({
            imports: [
                CommonModule,
                FormsModule,
                ReactiveFormsModule,
                MatFormFieldModule,
                MatOptionModule,
                ControlErrorModule,
                XmTranslationTestingModule,
                BrowserAnimationsModule,
                ControlErrorModule.forRoot({errorTranslates: XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES}),

                XmAceEditorDirective,
                XmAceEditorThemeSchemeAdapterDirective,
            ],
        }),
    ],
    parameters: {
        layout: 'centered',
    },
} as Meta;

const Template: Story<XmAceEditorControl> = (args: XmAceEditorControl) => ({
    component: XmAceEditorControl,
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
