

// default export to define the component metadata
import { Meta, Story } from '@storybook/angular';
import { XmDateComponent, XmDateOptions, XmDateValue } from '@xm-ngx/components/date';

export default {
    title: 'core/XmDateComponent',
    component: XmDateComponent,
    argTypes: {
        value: { control: 'text' },
        config: { control: 'object' },
    },
} as Meta;

// named export for the individual story
export const Primary: Story<XmDateComponent> = (args: {value: XmDateValue, config: XmDateOptions}) => ({
    component: XmDateComponent,
    props: args,
});

Primary.args = {
    value: new Date().toISOString(),
    config: {
        format: 'shortDate',
        timezone: '+00:00',
        locale: 'en-US',
    },
};
