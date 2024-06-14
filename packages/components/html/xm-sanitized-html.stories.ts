import { Meta, moduleMetadata } from '@storybook/angular';
import { XmSanitizedHtmlComponent } from '@xm-ngx/components/html/xm-sanitized-html.component';


export default {
    title: 'Core/Presentation/html',
    component: XmSanitizedHtmlComponent,
    decorators: [
        moduleMetadata({
            imports: [
                XmSanitizedHtmlComponent,
            ],
        }),
    ],
    parameters: {
        layout: 'centered',
    },
} as Meta;

const Template = (args: XmSanitizedHtmlComponent) => {
    return {
        component: XmSanitizedHtmlComponent,
        props: args,
    };
};

export const SanitizedHtml = Template.bind({});
SanitizedHtml.args = {
    value: `<strong>Here displayed sanitized HTML</strong>
                <ul>
                    <li>First item</li>
                    <li>Second item</li>
                    <li>Third item</li>
                </ul>
`,
};
