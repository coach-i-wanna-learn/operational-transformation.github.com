import type { StorybookConfig } from "@storybook/react-vite";
import path from 'path'
const config: StorybookConfig = {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  viteFinal: (config, {configType}) => {

    config.resolve!.alias = {
      ...config.resolve?.alias,
      '@': path.resolve(__dirname, '../src/')
    }
    console.log(config.resolve?.alias)

    return config
  }
};
export default config;
