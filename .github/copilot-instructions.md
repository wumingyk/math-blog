# Copilot / AI Agent 指南 — my-blog

简短、可执行的提示，帮助 AI 代理快速在本仓库内开展编码工作。

## 一句话概览
- 本仓库是一个基于 React + Vite 的静态博客，Markdown 文章位于 `src/posts`，站点构建前会生成 RSS 与 sitemap。UI 使用 Tailwind + rehype/remark 插件处理数学与高亮。

## 主要位置（先看这些文件）
- 运行与脚本: [package.json](package.json)
- 文章加载与前置处理: [src/lib/loadPosts.js](src/lib/loadPosts.js)
- RSS（浏览器版）: [src/lib/generateRSS.js](src/lib/generateRSS.js)
- RSS（构建/CI 脚本）: [scripts/generate-rss.mjs](scripts/generate-rss.mjs)
- sitemap 脚本: [scripts/generate-sitemap.mjs](scripts/generate-sitemap.mjs)
- Markdown 渲染器（嵌入规则、音频、图片灯箱）: [src/components/MarkdownRenderer.jsx](src/components/MarkdownRenderer.jsx)
- 自定义嵌入模块自动映射: [src/components/customModules.js](src/components/customModules.js)

## 快速命令（工程特有）
- 本地开发: `npm run dev` （Vite dev server）
- 生成 RSS（单独）: `npm run generate-rss` （写入 `public/rss.xml`）
- 生成 sitemap: `npm run sitemap`
- 构建（含 RSS 生成）: `npm run build` （内部执行 `npm run generate-rss && vite build`）
- 代码检查: `npm run lint`

注意：`npm run build` 会先运行 `scripts/generate-rss.mjs`，该脚本在 Node 环境中读取 `src/posts`，并依赖 `CONFIG.site_url`（请在脚本中设置为你的站点域名）。

## 文章与 frontmatter 约定
- 文章目录：`src/posts/*.md`。
- 节点端脚本与 Vite 端解析略有不同：
  - 构建脚本使用 `front-matter`（scripts/generate-rss.mjs）。
  - 浏览器运行时在 `src/lib/loadPosts.js` 使用 `import.meta.glob('../posts/*.md', { query: '?raw', eager: true })` 获取原始字符串并解析。
- 草稿标记：`published: false` 会被过滤（详见 `loadPosts.getAll` 与脚本中的过滤逻辑）。

## Markdown 渲染与嵌入约定（重要）
- 内置 remark/rehype：`remark-gfm`, `remark-math`, `rehype-katex`, `rehype-highlight`（见 `src/components/MarkdownRenderer.jsx`）。
- 图片：自动收集并在点击时打开 Lightbox（yet-another-react-lightbox）。
- 音频链接：如果链接以 `.mp3|.wav|.ogg` 结尾，渲染为内置 `AudioPlayer` 组件。
- 自定义 React Demo 嵌入：在正文中使用严格匹配段落文本 `:::ComponentName:::`（如 `:::SineCurveDemo:::`）会被替换为 `src/components/*Demo.jsx` 中自动导入的组件，映射逻辑见 [src/components/customModules.js](src/components/customModules.js)。不要更改匹配规则，除非同时更新 `customModules.js` 与 `MarkdownRenderer.jsx`。
- 标题处理：`h1` 若文本与 `postTitle` 相同将被隐藏（避免重复渲染）。

## 常见陷阱与注意事项
- 在浏览器运行代码中不要直接重用 `window.location.origin` 的值来在 Node 脚本中生成绝对 URL。项目中存在两套 RSS 生成实现：客户端（`src/lib/generateRSS.js`）与构建脚本（`scripts/generate-rss.mjs`）。CI/构建应使用 `scripts/generate-rss.mjs` 并将 `CONFIG.site_url` 设置为真实域名。
- `src/lib/parseFrontmatter.js` 包含一个轻量的 YAML 解析实现，但大多数构建脚本使用 `front-matter` 库；修改解析行为时注意两端兼容性。
- `loadPosts` 内有简单内存缓存 `_postCache`，开发时若文章更改需重启 dev server 或清空缓存逻辑以看见更新。

## 代码风格与测试线索
- ESLint 配置：`eslint.config.js`；运行 `npm run lint`。项目使用 Tailwind，组件中常直接引入 CSS class（保持现有风格）。

## 例子片段（参考）
- 在文章中嵌入 Demo：

    :::SineCurveDemo:::

- 添加文章 frontmatter 示例（切勿删除 `---` 分隔符）：

    ---
    title: "示例"
    date: "2025-01-01"
    published: true
    ---

## 如果你不确定要修改哪里
- 先查看相关文件（上文列出的关键文件）。对渲染或数据流不确定时，优先修改 `src/components/MarkdownRenderer.jsx` 与 `src/lib/loadPosts.js` 测试在 dev 模式下的行为。

---
如果你希望我把这份指南进一步精简或补充示例（例如为某个具体组件或文章模板写更详细的示例），告诉我想要增强的部分即可.
