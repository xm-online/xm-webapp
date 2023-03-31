const path = require('path');
module.exports = {
  stories: ["../../../src/**/*.stories.mdx", "../../../src/**/*.stories.@(js|jsx|ts|tsx)", "../../../packages/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials", "@storybook/addon-interactions"],
  framework: "@storybook/angular",
  core: {
    builder: 'webpack5',
  },
  docs: {
    autodocs: true,
  },
  webpackFinal: async (config, { configType }) => {
    config.module.rules.push({
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      include: path.resolve(__dirname, '../'),
    });
    return config;
  },
};
