import type { Preview } from '@storybook/angular'
import * as DocBlocks  from '@storybook/blocks';
import * as React from 'react';

import { setCompodocJson } from '@storybook/addon-docs/angular';
import docJson from '../documentation.json';
setCompodocJson(docJson);

const preview: Preview = {
  parameters: {
    docs: {
      page: () => (
        <>
          <DocBlocks.Title />
          <DocBlocks.Description />
          <DocBlocks.Primary />
          <DocBlocks.Controls />
          <DocBlocks.Stories />
        </>
      )
    }
  }
}

export default preview;
