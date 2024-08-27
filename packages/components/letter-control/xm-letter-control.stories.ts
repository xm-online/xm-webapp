import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata } from '@storybook/angular';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { LettersControl } from './letter-control';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { IConfig, NgxMaskModule, initialConfig } from 'ngx-mask';

const ngxMaskConfig = (): IConfig | object => {
    return {
        ...(initialConfig ?? {}),
        patterns: {
            ...(initialConfig.patterns ?? {}),
            'C': {
                pattern: new RegExp('[а-яА-Я]'),
            },
        },
    };
};

export default {
    title: 'Core/Control/Text/Letter',
    component: LettersControl,
    decorators: [
        moduleMetadata({
            imports: [
                CommonModule,
                FormsModule,
                ReactiveFormsModule,
                MatFormFieldModule,
                MatOptionModule,
                ControlErrorModule,
                NgxMaskModule.forRoot(ngxMaskConfig),
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

const Template = (args: LettersControl) => ({
    component: LettersControl,
    props: args,
});

export const Default = Template.bind({});
Default.args = {
    config: {
        mask: '****',
    },
    value: true,
};

export const CustomMask = Template.bind({});
CustomMask.args = {
    config: {
        mask: '000AA',
    },
    value: true,
};

export const Empty = Template.bind({});
Empty.args = {
    config: {},
    value: null,
};
