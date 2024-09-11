import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata } from '@storybook/angular';
import { ConditionModule } from '@xm-ngx/components/condition';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XmFormLayoutComponent} from './xm-form-layout.component';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { XmDynamicExtensionModule, XmDynamicModule } from '@xm-ngx/dynamic';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { XmFormLayoutControl } from './xm-form-layout-control.component';

export default {
    title: 'Core/Control/Form layout',
    component: XmFormLayoutComponent,
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
                XmDynamicExtensionModule.forRoot([]),
                XmDynamicModule.forRoot([].concat()),
                ConditionModule,
                XmFormLayoutControl,
            ],
        }),
    ],
    parameters: {
        layout: 'centered',
    },
} as Meta;

const Template = (args: XmFormLayoutComponent) => ({
    component: XmFormLayoutComponent,
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
