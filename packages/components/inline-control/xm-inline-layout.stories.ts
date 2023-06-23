import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { XM_ADMINISTRATION_ELEMENTS } from '@xm-ngx/administration/xm-administration.registry';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XmInlineControlComponent } from '@xm-ngx/components/inline-control/inline-control.component';
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
    title: 'Core/Control/Inline layout',
    component: XmInlineControlComponent,
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
                OverlayModule,
                PortalModule,
                MatCardModule,
                MatButtonModule,
                MatIconModule,
                MatTooltipModule,
            ],
        }),
    ],
    parameters: {
        layout: 'centered',
    },
} as Meta;

const Template: Story<XmInlineControlComponent> = (args: XmInlineControlComponent) => ({
    component: XmInlineControlComponent,
    props: args,
});

export const Default = Template.bind({});
Default.args = {
    config: {
        view: {
            selector: '@xm-ngx/components/text',
        },
        edit: {
            selector: '@xm-ngx/components/text-control',
        },
    },
    value: 'Hello world',
};

export const TextArea = Template.bind({});
TextArea.args = {
    config: {
        view: {
            selector: '@xm-ngx/components/text',
        },
        edit: {
            selector: '@xm-ngx/components/text-range-control',
        },
    },
    value: 'Hello long world',
};
