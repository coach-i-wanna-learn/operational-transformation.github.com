
jest 配置路径别名


```js
module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
```

## jest 环境搭建

要快速搭建一个React Jest TypeScript测试环境，您可以按照以下步骤进行操作：

1. 安装 Node.js 和 npm。这是运行React、Jest和TypeScript所必需的。

2. 使用 create-react-app 创建一个新的 React 应用程序。在命令行中输入以下命令：

   `````
   npx create-react-app my-app --template typescript
   cd my-app
   ```

   这将创建一个名为“my-app”的新React TypeScript应用程序，并将您的命令行导航到该应用程序的根目录中。

3. 安装 Jest 和相关的依赖项。在命令行中输入以下命令：

   ````
   pnpm install --save-dev jest @types/jest ts-jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
   ````

   > jest-environment-jsdom 需要额外安装

   这将安装Jest，以及其他一些必要的库和插件，用于在React TypeScript中运行测试。

4. 配置 Jest。在项目根目录中创建一个名为“jest.config.js”的新文件，并将以下内容复制到其中：

   ````
   module.exports = {
     preset: 'ts-jest',
     testEnvironment: 'jsdom'
   };
   这将提供Jest配置，以便Jest可以正确地解析和编译您的TypeScript代码。

5. 修改 package.json。将以下内容添加到 package.json 文件中：

   ````
   "jest": {
     "preset": "ts-jest",
     "testEnvironment": "jsdom"
   },
   ```

   这将告诉 Jest 使用 TypeScript 预设，并设置测试环境为 jsdom。

6. 创建一个简单的测试文件。在您的项目根目录中创建一个名为“App.test.tsx”的新文件，并将以下内容复制到其中：

   `````
   import React from 'react';
   import { render } from '@testing-library/react';
   import App from './App';

   test('renders learn react link', () => {
     const { getByText } = render(<App />);
     const linkElement = getByText(/learn react/i);
     expect(linkElement).toBeInTheDocument();
   });
   ```

   这将创建一个简单的测试，用于验证您的应用程序能够正确地渲染并包含“learn react”链接。

7. 运行测试。在命令行中输入以下命令：

   ````
   npm test
   ````

   这将使用Jest运行您的测试文件，并在命令行中输出测试结果。

这样，您就可以快速搭建一个React Jest TypeScript测试环境，并开始编写和运行测试了。请注意，这只是一个简单的示例，您可以根据您的需求和项目进行更改和扩展。


## 处理 css

pnpm i -D identity-obj-proxy

https://jestjs.io/docs/webpack#mocking-css-modules

```js
module.exports = {
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css)$": "identity-obj-proxy",
  },
  preset: "ts-jest",
  testEnvironment: "jsdom",
};

```