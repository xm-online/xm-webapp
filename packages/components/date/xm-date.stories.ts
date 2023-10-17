

// default export to define the component metadata
import { Meta, Story } from '@storybook/angular';
import { XmDateComponent, XmDateConfig, XmDateValue } from './xm-date.component';

export default {
    title: 'Core/Presentation/Date/Standard',
    component: XmDateComponent,
    argTypes: {
        value: { control: 'date' },
        config: { control: 'object' },
    },
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'For this component use selector <code>@xm-ngx/components/date</code>',
            },
        },
    },
    tags: ['autodocs'],
} as Meta;

// named export for the individual story
export const Primary: Story<XmDateComponent> = (args: {value: XmDateValue, config: XmDateConfig}) => ({
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

export const LongFormat: Story<XmDateComponent> = (args: {value: XmDateValue, config: XmDateConfig}) => ({
    component: XmDateComponent,
    props: args,
});

LongFormat.args = {
    value: new Date().toISOString(),
    config: {
        format: 'longDate',
        timezone: '+00:00',
        locale: 'en-US',
    },
};
