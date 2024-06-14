import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata } from '@storybook/angular';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XmIconEnumComponent } from './xm-icon-enum.component';
import { HintModule } from '@xm-ngx/components/hint';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';

export default {
    title: 'Core/Presentation/Enum/Icon',
    component: XmIconEnumComponent,
    decorators: [
        moduleMetadata({
            imports: [
                BrowserAnimationsModule,
                ControlErrorModule,
                XmTranslationTestingModule,
                HintModule,
                ControlErrorModule.forRoot({ errorTranslates: XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES }),
                MatIconModule,
            ],
        }),
    ],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'For this componnent use selector <code>@xm-ngx/components/icon-enum</code>',
            },
        },
    },
    tags: ['autodocs'],
} as Meta;

const Template = (args: XmIconEnumComponent) => ({
    component: XmIconEnumComponent,
    props: args,
});
/**
 * Default story for XmIconEnumComponent
 */
export const Defaults = Template.bind({});
Defaults.args = {
    value: 'like',
    config: {
        items: [
            {
                icon: 'person',
                value: 'me',
            },
            {
                icon: 'favorite',
                value: 'like',
            },
            {
                icon: 'cross',
                value: false,
            },
        ],
    },
};
/**
 * Story for XmIconEnumComponent with a value that does not match
 */
export const ValueNotMatch = Template.bind({});
ValueNotMatch.args = {
    value: 'uniq-value',
    config: {
        items: [
            {
                icon: 'person',
                value: 'me',
            },
            {
                icon: 'favorite',
                value: 'like',
            },
            {
                icon: 'cross',
                value: false,
            },
        ],
    },
};

/**
 * Story for XmIconEnumComponent with tooltips
 */
export const WithTooltip = Template.bind({});
WithTooltip.args = {
    value: 'me',
    config: {
        items: [
            {
                icon: 'person',
                value: 'me',
                tooltip: {
                    en: 'Its me',
                },
            },
            {
                icon: 'favorite',
                value: 'like',
            },
            {
                icon: 'cross',
                value: false,
            },
        ],
        showTooltipDelay: 500,
        tooltipPosition: 'above'
    },
};
