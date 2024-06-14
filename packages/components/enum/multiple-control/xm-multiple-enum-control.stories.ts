import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata } from '@storybook/angular';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XmMultipleEnumControl } from './xm-multiple-enum-control.component';
import { HintModule } from '@xm-ngx/components/hint';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { XmPermissionModule } from '@xm-ngx/core/permission';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';

export default {
    title: 'Core/Control/Enum multiple',
    component: XmMultipleEnumControl,
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

                MatSelectModule,
                MatIconModule,
                XmPermissionModule,
                HintModule,
            ],
        }),
    ],
    parameters: {
        layout: 'centered',
    },
} as Meta;

const Template = (args: XmMultipleEnumControl) => ({
    component: XmMultipleEnumControl,
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
