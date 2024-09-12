import { Meta, moduleMetadata } from '@storybook/angular';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { HintModule } from '@xm-ngx/components/hint';
import { XmTextDynamicView } from './xm-text-dynamic-view';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { XmDynamicExtensionModule, XmDynamicModule } from '@xm-ngx/dynamic';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';

export default {
    title: 'Core/Presentation/Text/Dynamic view',
    component: XmTextDynamicView,
    decorators: [
        moduleMetadata({
            imports: [
                XmTranslationTestingModule,
                HintModule,
                ControlErrorModule.forRoot({errorTranslates: XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES}),
                XmDynamicExtensionModule.forRoot([]),
                XmDynamicModule.forRoot([].concat()),
            ],
        }),
    ],
    parameters: {
        layout: 'centered',
    },
} as Meta<XmTextDynamicView>;

const Template = (args) => ({
    component: XmTextDynamicView,
    props: args,
});

export const Default = Template.bind({});
Default.args = {
    value: 'Sample Value',
    config: {
        title: 'Sample Title',
        textStyle: 'inline',
        selector: '@xm-ngx/components/text',
        options: { },
    },
};

export const WithBoolean = Template.bind({});
WithBoolean.args = {
    value: 'Sample Value',
    config: {
        title: 'Is selected',
        textStyle: 'inline',
        selector: '@xm-ngx/components/bool',
        options: { },
    },
};

export const WithDynamicLabelTooltip = Template.bind({});
WithDynamicLabelTooltip.args = {
    value: 'Provider',
    config: {
        'dynamicLabel': [
            {
                'selector': '@xm-ngx/components/text',
                'title': {
                    'en': 'Provider name',
                    'ru': 'Ім\'я провайдера',
                    'uk': 'Ім\'я провайдера'
                },
            },
            {
                'selector': '@xm-ngx/components/icon',
                'style': 'margin-left: 2px; height: 14px;',
                'config': {
                    'icon': 'info_outline',
                    'tooltip': {
                        'en': 'Our favorite mobile provider!',
                        'ru': 'Наш улюблений мобільний оператор!',
                        'uk': 'Наш улюблений мобільний оператор!'
                    },
                    'tooltipPosition': 'right',
                    'style': 'font-size: 14px; width: 14px; height: 14px;'
                }
            }
        ],
        'selector': '@xm-ngx/components/text'
    },
};

export const WithDynamicLabelIconFirst = Template.bind({});
WithDynamicLabelIconFirst.args = {
    value: 'Partly cloudy day',
    config: {
        'dynamicLabel': [
            {
                'selector': '@xm-ngx/components/icon',
                'style': 'margin-right: 2px; height: 14px;',
                'config': {
                    'icon': 'cloud',
                    'style': 'font-size: 14px; width: 14px; height: 14px;'
                }
            },
            {
                'selector': '@xm-ngx/components/text',
                'title': {
                    'en': 'Weather',
                    'ru': 'Стать',
                    'uk': 'Стать'
                },
                'style': 'height: 14px'
            }
        ],
        'selector': '@xm-ngx/components/text'
    },
};

export const WithDynamicLabelExtraText = Template.bind({});
WithDynamicLabelExtraText.args = {
    value: 'Enabled',
    config: {
        'dynamicLabel': [
            {
                'selector': '@xm-ngx/components/text',
                'title': {
                    'en': 'Validation',
                    'ru': 'Валідація',
                    'uk': 'Валідація'
                }
            },
            {
                'selector': '@xm-ngx/components/text',
                'title': {
                    'en': 'PRO',
                    'ru': 'PRO',
                    'uk': 'PRO'
                },
                'style': 'background-color: #666666; border-radius: 6px; padding: 1px 2px; margin-left: 2px; color: white;',
            }
        ],
        'selector': '@xm-ngx/components/text'
    },
};
