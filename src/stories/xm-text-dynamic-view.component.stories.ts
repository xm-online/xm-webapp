import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { HintModule } from '@xm-ngx/components/hint';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { Primitive } from '@xm-ngx/shared/interfaces';
import { XmTextDynamicOptions, XmTextDynamicView } from '@xm-ngx/components/text';
import { XmDynamicExtensionModule, XmDynamicModule } from '@xm-ngx/dynamic';
import { XM_DATE_ELEMENTS } from '@xm-ngx/components/xm-date.registry';
import { XM_HTML_ELEMENTS } from '@xm-ngx/components/xm-html.registry';
import { XM_TEXT_ELEMENTS } from '@xm-ngx/components/xm-text.registry';
import { XM_BOOL_ELEMENTS } from '@xm-ngx/components/xm-bool.registry';
import { XM_COPY_ELEMENTS } from '@xm-ngx/components/xm-copy.registry';
import { XM_LINK_ELEMENTS } from '@xm-ngx/components/xm-link.registry';

export default {
    title: 'core/text/XmTextDynamicView',
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
                    XM_LINK_ELEMENTS)),
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
