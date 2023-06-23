import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { XM_ADMINISTRATION_ELEMENTS } from '@xm-ngx/administration/xm-administration.registry';
import { ConditionModule } from '@xm-ngx/components/condition';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XmFormLayoutComponent, XmFormLayoutControl } from '@xm-ngx/components/form-layout/index';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { XM_ARRAY_ELEMENTS } from '@xm-ngx/components/xm-array.registry';
import { XM_BOOL_ELEMENTS } from '@xm-ngx/components/xm-bool.registry';
import { XM_COPY_ELEMENTS } from '@xm-ngx/components/xm-copy.registry';
import { XM_DATE_ELEMENTS } from '@xm-ngx/components/xm-date.registry';
import { XM_ENUM_ELEMENTS } from '@xm-ngx/components/xm-enum.registry';
import { XM_HTML_ELEMENTS } from '@xm-ngx/components/xm-html.registry';
import { XM_LINK_ELEMENTS } from '@xm-ngx/components/xm-link.registry';
import { XM_NAVBAR_ELEMENTS } from '@xm-ngx/components/xm-navbar.registry';
import { XM_TABLE_ELEMENTS } from '@xm-ngx/components/xm-table.registry';
import { XM_TEXT_ELEMENTS } from '@xm-ngx/components/xm-text.registry';
import { XM_COMPONENTS_ELEMENTS } from '@xm-ngx/components/xm.registry';
import { XM_DASHBOARD_ELEMENTS } from '@xm-ngx/dashboard/xm-dashboard.registry';
import { XmDynamicExtensionModule, XmDynamicModule } from '@xm-ngx/dynamic';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';

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
                XmDynamicModule.forRoot([].concat(
                    XM_DATE_ELEMENTS,
                    XM_HTML_ELEMENTS,
                    XM_TEXT_ELEMENTS,
                    XM_BOOL_ELEMENTS,
                    XM_COPY_ELEMENTS,
                    XM_LINK_ELEMENTS,
                    XM_ENUM_ELEMENTS,
                    XM_ARRAY_ELEMENTS,
                    XM_TABLE_ELEMENTS,
                    XM_NAVBAR_ELEMENTS,
                    XM_DASHBOARD_ELEMENTS,
                    XM_ADMINISTRATION_ELEMENTS,
                    XM_COMPONENTS_ELEMENTS,
                )),
                ConditionModule,
                XmFormLayoutControl,
            ],
        }),
    ],
    parameters: {
        layout: 'centered',
    },
} as Meta;

const Template: Story<XmFormLayoutComponent> = (args: XmFormLayoutComponent) => ({
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
