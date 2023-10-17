import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { XmHtmlComponent } from './xm-html';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';


export default {
    title: 'Core/Presentation/html',
    component: XmHtmlComponent,
    decorators: [
        moduleMetadata({
            imports: [
                XmTranslationTestingModule,
                XmHtmlComponent,
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
        html: '<strong>Strong text</strong> with <span class="text-white bg-dark">custom classes</span>',
    },
};
