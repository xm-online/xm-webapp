import { Story, Meta } from '@storybook/angular/types-6-0';
import { XmTextComponent } from './xm-text.component';
import { moduleMetadata } from '@storybook/angular';
import { XmTextModule } from '@xm-ngx/components/text';

export default {
    title: 'Core/Text Control',
    component: XmTextComponent,
    decorators: [
        moduleMetadata({
            imports: [XmTextModule],
        }),
    ],
} as Meta;

const Template: Story<XmTextComponent> = (args: XmTextComponent) => ({
    props: args,
});

export const Default = Template.bind({});
Default.args = {
    value: 'Simple test text',
};


export const WithTemplate = Template.bind({});
WithTemplate.args = {
    value: 'Robert Martin',
    config : {
        template: 'Hi <%= value%>!',
    },
};
