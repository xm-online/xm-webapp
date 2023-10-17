import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { HintModule } from '@xm-ngx/components/hint';
import { XmIconComponent } from './xm-icon.component';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';

export default {
    title: 'Core/Presentation/Icon',
    component: XmIconComponent,
    decorators: [
        moduleMetadata({
            imports: [
                BrowserAnimationsModule,
                ControlErrorModule,
                XmTranslationTestingModule,
                HintModule,
                ControlErrorModule.forRoot({errorTranslates: XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES}),
                MatIconModule,
            ],
        }),
    ],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'For this componnent use selector <code>@xm-ngx/components/icon</code>',
            },
        },
    },
    tags: ['autodocs'],
} as Meta;

const Template: Story<XmIconComponent> = (args: XmIconComponent) => ({
    component: XmIconComponent,
    props: args,
});
/**
 * Default story for XmIconComponent
 */
export const Defaults = Template.bind({});
Defaults.args = {
    config: {
        icon: 'info',
    },
};
/**
 * Story for XmIconComponent with tooltips
 */
export const WithTooltip = Template.bind({});
WithTooltip.args = {
    value: 'me',
    config: {
        icon: 'person',
        tooltip: {
            en: 'Its me',
        },
        showTooltipDelay: 500,
        tooltipPosition: 'above'
    },
};
