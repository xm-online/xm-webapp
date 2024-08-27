import type { Preview } from '@storybook/angular';
import { Title, Subtitle, Description, Primary, Controls, Stories } from '@storybook/blocks';

import { setCompodocJson } from '@storybook/addon-docs/angular';
import docJson from '../documentation.json';

setCompodocJson(docJson);

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        docs: {
            page: () => (
                <>
                  <Title />
                  <Subtitle />
                  <Description />
                  <Primary />
                  <Controls />
                  <Stories />
                </>
            ),
        },
    },
};

export default preview;
