import { Meta, Story } from '@storybook/angular';

import { moduleMetadata } from '@storybook/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XmPermissionModule, XmPermissionService } from '@xm-ngx/core/permission';
import { HintModule } from '@xm-ngx/components/hint';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { MockPermissionService } from '@xm-ngx/core/permission/testing';
import { XmMultipleEnumControl } from '@xm-ngx/components/enum';

export default {
    title: 'core/enum/XmMultipleEnumControl',
    component: XmMultipleEnumControl,
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
                HttpClientTestingModule,
                BrowserAnimationsModule,
                ControlErrorModule.forRoot({errorTranslates: XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES}),
                XmTranslationTestingModule,
            ],
            providers: [{ provide: XmPermissionService, useClass: MockPermissionService }],
        }),
    ],
} as Meta;

const Template: Story<XmMultipleEnumControl> = (args: XmMultipleEnumControl) => ({
    component: XmMultipleEnumControl,
    props: args,
});

export const Default = Template.bind({});
Default.args = {
    value: ['option1', 'option2'],
    config: {
        title: 'Select multiple options',
        items: [
            { title: 'Option1', value: 'option1' },
            { title: 'Option2', value: 'option2' },
        ],
    },
};

export const WithIcons = Template.bind({});
WithIcons.args = {
    value: ['option1', 'option2'],
    config: {
        title: 'Select multiple options',
        items: [
            { title: 'Option1', value: 'option1', icon: 'favorite'},
            { title: 'Option2', value: 'option2', icon: 'share'},
        ],
    },
};
