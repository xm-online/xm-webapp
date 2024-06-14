import { Meta, moduleMetadata } from '@storybook/angular';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { XmHtmlValueComponent } from './xm-html-value.component';
import { XmHtmlComponent } from './xm-html';

export default {
    title: 'Core/Presentation/HTML',
    component: XmHtmlValueComponent,
    decorators: [
        moduleMetadata({
            imports: [
                XmTranslationTestingModule,
                XmHtmlValueComponent,
                XmHtmlComponent,
            ],
        }),
    ],
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
} as Meta;

const Template = (args: XmHtmlValueComponent) => {
    return {
        component: XmHtmlValueComponent,
        props: args,
    };
};

export const HtmlValue = Template.bind({});
HtmlValue.args = {
    value: `<strong>Here displayed sanitized HTML</strong>
                <ul>
                    <li>First item</li>
                    <li>Second item</li>
                    <li>Third item</li>
                </ul>
`,
};
