import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
    /** If you face an issue that Storybook starts locally with an error like:
     * Error: EMFILE: too many open files, watch
     *
     * then make path to your extensions more strict, for example:
     * '../src/app/ext/ext-name/**\/*.stories.@(js|jsx|ts|tsx)'
     *
     * or comment out extensions if you don't need to watch.
     *
     * But don't forget to rollback them before the commit.
     * */
    stories: [
        '../src/app/ext/**/*.stories.@(js|jsx|ts|tsx)',
        '../src/app/ext/**/*.mdx',
        '../packages/**/*.stories.@(js|jsx|ts|tsx)',
        '../packages/**/*.mdx',
    ],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-interactions',
    ],
    framework: {
        name: '@storybook/angular',
        options: {},
    },
    staticDirs: [
        {from: '../src/assets', to: '/assets'},
    ],
};
export default config;
