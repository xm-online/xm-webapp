import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XmPermissionModule, XmPermissionService } from '@xm-ngx/core/permission';
import { HintModule } from '@xm-ngx/components/hint';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { XmEnumControl } from '@xm-ngx/components/enum';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockPermissionService } from '@xm-ngx/core/permission/testing';

export default {
    title: 'core/enum/XmEnumControl',
    component: XmEnumControl,
    decorators: [
        moduleMetadata({
            imports: [
                ReactiveFormsModule,
                MatFormFieldModule,
                MatSelectModule,
                MatIconModule,
                CommonModule,
                ControlErrorModule,
                XmPermissionModule,
                HintModule,
                CommonModule,
                HttpClientTestingModule,
                BrowserAnimationsModule,
                ControlErrorModule.forRoot({errorTranslates: XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES}),
                XmTranslationTestingModule,
            ],
            providers: [{ provide: XmPermissionService, useClass: MockPermissionService }],
        }),
    ],
} as Meta;

const Template: Story<XmEnumControl> = (args: XmEnumControl) => ({
    component: XmEnumControl,
    props: args,
});

export const Default = Template.bind({});
Default.args = {
    value: 'option1',
    config: {
        title: 'Select an option',
        items: [
            {title: 'Option1', value: 'option1'},
            {title: 'Option2', value: 'option2'},
        ],
        showClearButton: true,
        clearButtonText: 'Clear Selection',
    },
};

export const WithIcons = Template.bind({});
WithIcons.args = {
    value: 'option1',
    config: {
        title: 'Select an option',
        items: [
            {title: 'Option1', value: 'option1', icon: 'face', iconColor: 'red'},
            {title: 'Option2', value: 'option2', icon: 'tag_faces', iconColor: 'blue'},
        ],
        showClearButton: true,
        clearButtonText: 'Clear Selection',
    },
};
