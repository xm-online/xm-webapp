import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { XmHtmlComponent } from '@xm-ngx/components/html';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';


export default {
    title: 'Core/Presentation/html',
    component: XmHtmlComponent,
    decorators: [
        moduleMetadata({
            imports: [
                XmTranslationTestingModule,
            ],
        }),
    ],
    parameters: {
        layout: 'centered',
    },
} as Meta;

const Template: Story<XmHtmlComponent> = (args: XmHtmlComponent) => ({
    component: XmHtmlComponent,
    props: args,
});

export const Default = Template.bind({});
Default.args = {
    config: {
        html: '<strong>Test strong</strong>',
    },
};
