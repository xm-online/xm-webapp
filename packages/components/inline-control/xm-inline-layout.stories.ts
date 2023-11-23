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
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XmInlineControlComponent } from '../inline-control';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
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
                XmDynamicModule.forRoot([]),
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
