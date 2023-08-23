import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XmEnumControl, XmEnumControlOptions } from '@xm-ngx/components/enum';
import { HintModule } from '@xm-ngx/components/hint';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { XmPermissionModule, XmPermissionService } from '@xm-ngx/core/permission';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EntityCollectionFactoryService } from '@xm-ngx/repositories';
import { XmUserService } from '@xm-ngx/core/user';
import { MockUserService } from '@xm-ngx/core/user/testing';

export default {
    title: 'Core/Control/Enum',
    component: XmEnumControl,
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
                HttpClientTestingModule,
                MatSelectModule,
                MatIconModule,
                XmPermissionModule,
                HintModule,
            ],
            providers: [
                EntityCollectionFactoryService,
                XmPermissionService,
                { provide: XmUserService, useClass: MockUserService }
            ],
        }),
    ],
    parameters: {
        layout: 'centered',
    },
} as Meta;


const Template: Story<XmEnumControl> = (args: XmEnumControl) => ({
    component: XmEnumControl,
    props: args,
});

export const Default = Template.bind({});
Default.args = {
    config: {
        hint: null,
        title: 'Default Enum Control',
        dataQa: 'enum-control',
        required: false,
        items: [
            {
                value: 'option1',
                title: 'Option 1',
                icon: 'star',
                iconColor: 'blue',
            },
            {
                value: 'option2',
                title: 'Option 2',
                icon: 'star',
                iconColor: 'red',
            },
        ],
        showClearButton: false,
        clearButtonText: 'admin-config.common.cancel',
    } as XmEnumControlOptions,
};

export const WithCustomOptions = Template.bind({});
WithCustomOptions.args = {
    config: {
        hint: null,
        title: 'Custom Enum Control',
        dataQa: 'enum-control',
        required: true,
        items: [
            {
                value: 'option1',
                title: 'Option 1',
                icon: 'star',
                iconColor: 'blue',
            },
            {
                value: 'option2',
                title: 'Option 2',
                icon: 'star',
                iconColor: 'red',
            },
        ],
        showClearButton: true,
        clearButtonText: 'admin-config.common.cancel',
    } as XmEnumControlOptions,
};
