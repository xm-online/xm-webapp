import type { StorybookConfig } from "@storybook/angular";
const config: StorybookConfig = {
  stories: [
    "../src/app/ext/common-webapp-ext/**/*.stories.@(js|jsx|ts|tsx)",
    "../src/app/ext/common-webapp-ext/**/*.mdx",
    "../packages/**/*.stories.@(js|jsx|ts|tsx)",
    "../packages/**/*.mdx"
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions"
  ],
  framework: {
    name: "@storybook/angular",
    options: {}
  },
  staticDirs: [
    { from: '../src/assets', to: '/assets' }
  ]
};
export default config;
