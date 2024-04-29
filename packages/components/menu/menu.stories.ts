import { Meta, StoryObj } from '@storybook/angular';
import { MenuComponent } from './menu.component';

const meta: Meta = {
    title: 'Core/Presentation/Menu',
    component: MenuComponent,
    render: () => ({
        template: `
            <h1>Open Doc page</h1>
        `,
    }),
};
export default meta;
export const MenuStory: StoryObj = {};
