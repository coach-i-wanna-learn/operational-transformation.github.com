要在 VS Code 中快速设置 `prettier`，可以按照以下步骤：

1. 确保已经安装了 `Prettier` 扩展，可以在 VS Code 的 `Extensions` 选项卡中搜索并安装。

2. 在 VS Code 的 `Settings` 中搜索 `format on save`，并勾选 `Editor: Format On Save` 选项。

3. 然后，在 `Settings` 搜索框中输入 `Prettier`，找到 `Prettier: Require Config` 选项，并将其设置为 `true`。这将强制 `Prettier` 使用项目根目录中的配置文件。

4. 如果项目中没有 `Prettier` 配置文件，可以在项目根目录中创建一个名为 `.prettierrc` 或 `.prettierrc.json` 的文件，并在其中定义 `Prettier` 的配置选项。例如：

   ````
   {
     "semi": true,
     "trailingComma": "all",
     "singleQuote": true,
     "printWidth": 80
   }
   ```

   这将设置 `Prettier` 在保存时自动格式化代码，并使用指定的选项对代码进行格式化。

请注意，这些设置将应用于所有语言，包括 JavaScript、TypeScript、CSS、JSON 等。如果您只想为某些语言启用 `Prettier`，可以在 VS Code 的 `Settings` 中搜索 `Prettier`，找到 `Prettier: Language` 选项，并设置为您想启用 `Prettier` 的语言 ID 列表，例如：

```
{
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[jsonc]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

这将为 JavaScript、TypeScript 和 JSON 文件启用 `Prettier`。请注意，语言 ID 可能因 VS Code 版本、扩展等而异，可以在文件的底部状态栏中找到语言 ID。

希望这些步骤能帮助您快速设置 `Prettier` 在保存时自动格式化代码。