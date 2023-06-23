import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { XM_ADMINISTRATION_ELEMENTS } from '@xm-ngx/administration/xm-administration.registry';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { HintModule } from '@xm-ngx/components/hint';
import { XmTextDynamicOptions, XmTextDynamicView } from '@xm-ngx/components/text';
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
import { Primitive } from '@xm-ngx/shared/interfaces';
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
                    XM_COMPONENTS_ELEMENTS)),
            ],
        }),
    ],
    parameters: {
        layout: 'centered',
    },
} as Meta<XmTextDynamicView>;

interface XmTextDynamicViewStoryProps {
    value: Primitive;
    config: XmTextDynamicOptions;
}

const Template: Story<XmTextDynamicViewStoryProps> = (args) => ({
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
