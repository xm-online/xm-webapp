import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
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
                ControlErrorModule.forRoot({ errorTranslates: XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES }),
                XmAceEditorDirective,
                XmAceEditorThemeSchemeAdapterDirective,
            ],
        }),
    ],
    parameters: {},
} as Meta<XmAceEditorControl>;


export const ModeJson: StoryObj<XmAceEditorControl> = {
    args: {
        config: { mode: 'json' },
        value: '{"prop1":"value1","prop2":true}',
    },
};

export const ModeObjectToJson: StoryObj<XmAceEditorControl> = {
    args: {
        config: { mode: 'object-to-json' },
        value: {'prop1':'value1','prop2':true},
    },
};

export const ModeYaml: StoryObj<XmAceEditorControl> = {
    args: {
        config: { mode: 'yaml' },
        value: 'prop1:value1,prop2:true',
    },
};

export const ModeObjectToYaml: StoryObj<XmAceEditorControl> = {
    args: {
        config: { mode: 'object-to-yaml' },
        value: {'prop1':'value1','prop2':true},
    },
};
