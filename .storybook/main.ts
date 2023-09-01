import type { StorybookConfig } from "@storybook/angular";
const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)",
    "../packages/**/*.stories.@(js|jsx|ts|tsx)",
    "../packages/**/*.mdx",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/angular",
    options: {},
  },
  staticDirs: [
    { from: '../src/assets', to: '/assets' },
  ],
  docs: {
    autodocs: "tag",
  },
};
export default config;
