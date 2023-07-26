import type { StorybookConfig } from '@storybook/angular';
import { dirname, join, resolve } from 'path';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
    return dirname(require.resolve(join(value, "package.json")));
}

const config: StorybookConfig = {
    stories: [
        resolve('src/**/*.mdx'),
        resolve('src/**/*.stories.@(js|jsx|mjs|ts|tsx)'),
        resolve('packages/**/*.stories.@(js|jsx|mjs|ts|tsx)'),
        resolve('packages/**/*.mdx'),
    ],
    addons: [
        getAbsolutePath("@storybook/addon-links"),
        getAbsolutePath("@storybook/addon-essentials"),
        getAbsolutePath("@storybook/addon-interactions"),
    ],
    framework: {
        name: getAbsolutePath("@storybook/angular"),
        options: {},
    },
    staticDirs: [
        { from: resolve('src/assets'), to: '/assets' },
    ],
    docs: {
        autodocs: 'tag',
    },
};
export default config;
