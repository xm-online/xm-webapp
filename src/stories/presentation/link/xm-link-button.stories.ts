import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { HintModule } from '@xm-ngx/components/hint';
import { IfDashboardSlugModule } from '@xm-ngx/components/if-dashboard-slug';
import { XmLinkButtonComponent } from '@xm-ngx/components/link';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { XmPermissionModule } from '@xm-ngx/core/permission';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';


export default {
    title: 'Core/Presentation/Link/Button',
    component: XmLinkButtonComponent,
    decorators: [
        moduleMetadata({
            imports: [
                BrowserAnimationsModule,
                ControlErrorModule,
                XmTranslationTestingModule,
                HintModule,
                ControlErrorModule.forRoot({errorTranslates: XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES}),

                CommonModule,
                MatButtonModule,
                IfDashboardSlugModule,
                XmPermissionModule,
                MatTooltipModule,
                RouterModule,
                MatIconModule,
            ],
        }),
    ],
    parameters: {
        layout: 'centered',
    },
} as Meta;

const Template: Story<XmLinkButtonComponent> = (args: XmLinkButtonComponent) => ({
    component: XmLinkButtonComponent,
    props: args,
});

export const Default = Template.bind({});
Default.args = {
    value: 'Example Value',
    config: {template: 'Template String'},
};

export const NoTemplate = Template.bind({});
NoTemplate.args = {
    value: 'Another Example Value',
    config: null,
};
