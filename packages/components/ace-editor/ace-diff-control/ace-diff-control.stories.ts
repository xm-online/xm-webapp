import type {Meta, StoryObj} from '@storybook/angular';
import {AceDiffControlComponent} from '@xm-ngx/components/ace-editor/ace-diff-control/ace-diff-control.component';


const meta: Meta<AceDiffControlComponent> = {
    component: AceDiffControlComponent,
};

export default meta;

type Story = StoryObj<AceDiffControlComponent>;

export const Primary: Story = {
    render: () => ({
        props: {
            label: 'Button',
            primary: true,
        },
    })};
