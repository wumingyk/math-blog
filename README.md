# L.E.A.P. - Exploring the World

> **L**anguage, **E**ngineering, **A**lgorithms, **P**hysics

一个基于 React + Vite 构建的个人博客网站，专注于技术、数学和物理等领域的知识分享，集成了 **AI 驱动的英文科技资讯聚合系统**。

## ✨ 特色功能

### 🤖 AI 驱动的科技资讯聚合
- **14 个高质量科技 RSS 源**：TechCrunch, Hacker News, MIT Technology Review, Wired, The Verge 等
- **AI 智能翻译**：使用智谱 GLM-4 自动翻译成中文
- **智能筛选**：自动过滤非技术相关和 AI 生成的文章
- **卡片式展示**：时间线布局，支持按来源筛选
- **手动更新**：运行脚本即可更新资讯

### 🎨 博客系统
- **Markdown 文章**：支持数学公式、代码高亮
- **分类筛选**：按技术领域分类
- **深色模式**：全站支持主题切换
- **响应式设计**：完美适配各种设备

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:5173

### 构建生产版本
```bash
npm run build
```

## 📡 RSS 资讯聚合系统

### 功能说明

自动从 14 个顶级科技媒体抓取最新资讯，使用 AI 翻译并筛选，只保留高质量的技术相关文章。

**数据源**：
- **General Tech**: Ars Technica, Wired, The Verge
- **Startup & Business**: TechCrunch, Bloomberg Technology
- **Developer & Engineering**: Hacker News, InfoQ, GitHub Blog, Stack Overflow Blog
- **AI & Future Tech**: MIT Technology Review, LessWrong, Alignment Forum
- **Security**: Krebs on Security, The Hacker News

**AI 能力**：
- ✅ 全文翻译（英文 → 中文）
- ✅ 智能摘要生成
- ✅ 中英文关键词提取
- ✅ 技术相关性判断
- ✅ AI 生成内容检测

### 更新资讯

```bash
# 使用智谱 AI 翻译并筛选
node scripts/rss/run.mjs
```

**输出**：
- 文件：`src/data/rss-feed.json`
- 文章数：约 40-45 篇（从 50 篇筛选）
- 翻译时间：约 3-4 分钟

### 配置 AI

编辑 `.env` 文件：

```env
ZHIPU_API_KEY=你的智谱API密钥
```

智谱 AI 申请：https://open.bigmodel.cn/

**成本**：
- 模型：GLM-4-Flash（快速版）
- 每次更新：约 ¥0.75
- 每月成本：约 ¥20-30（每天更新）

## 📁 项目结构

```
my-blog/
├── src/
│   ├── pages/              # 页面组件
│   │   ├── Home.jsx        # 首页（文章列表）
│   │   ├── Post.jsx        # 文章详情
│   │   ├── About.jsx       # 关于页面
│   │   └── Feed.jsx        # RSS 资讯页面
│   ├── components/         # 可复用组件
│   ├── lib/                # 工具函数
│   ├── posts/              # 博客文章（Markdown）
│   └── data/               # RSS 数据文件
│
├── scripts/
│   └── rss/                # RSS 聚合脚本
│       ├── config/          # 配置文件
│       ├── fetchers/       # RSS 抓取器
│       ├── ai/             # AI 翻译器
│       ├── generators/     # 数据生成器
│       ├── utils/          # 工具函数
│       └── index.mjs       # 主脚本
│
├── public/                 # 静态资源
├── package.json
└── README.md
```

## 🛠️ 技术栈

### 核心框架
- React 18.2
- Vite 5.4
- React Router DOM 7.10

### UI & 样式
- Tailwind CSS 3.4
- Lucide React（图标）
- 深色模式支持

### 内容渲染
- react-markdown
- remark-math（数学公式）
- rehype-katex（KaTeX 渲染）
- rehype-highlight（代码高亮）

### RSS 聚合
- rss-parser（RSS 解析）
- OpenAI SDK（AI 调用）
- dotenv（环境变量）

## 📝 文章格式

文章存放在 `src/posts/` 目录，使用 Markdown 格式：

```yaml
---
title: "文章标题"
date: "2026-01-06"
category: "Algorithm"
tags: ["math", "algorithms"]
published: true
---

# 文章内容

这里是 Markdown 正文...
```

**支持的功能**：
- 数学公式（LaTeX）
- 代码高亮
- 图片嵌入
- 自定义样式

## 🌐 部署

### GitHub Pages
```bash
npm run build
# 将 dist/ 目录部署到 gh-pages 分支
```

### Netlify / Vercel
- **构建命令**: `npm run build`
- **输出目录**: `dist/`
- **自动部署**: 推送代码自动触发

## 📊 页面说明

### 首页 (`/`)
- 展示所有博客文章
- 按分类筛选
- 按时间倒序排列

### Feed (`/feed`)
- RSS 资讯聚合页面
- 卡片式时间线布局
- 支持按来源筛选
- 显示翻译后的中文标题、摘要、关键词

### 文章详情 (`/post/:slug`)
- Markdown 渲染
- 数学公式显示
- 代码高亮
- 深色模式支持

### 关于 (`/about`)
- 项目介绍
- 个人信息

## 🔧 开发指南

### 添加新文章

1. 在 `src/posts/` 创建新的 `.md` 文件
2. 添加 frontmatter 元数据
3. 编写 Markdown 内容
4. 刷新浏览器查看

### 更新资讯

```bash
node scripts/rss/run.mjs
```

### 修改主题颜色

编辑 `tailwind.config.js` 中的颜色配置。

### 调整筛选规则

编辑 `scripts/rss/ai/translator.mjs` 中的 `TRANSLATE_PROMPT`。

## 📖 相关文档

- [Vite 文档](https://vite.dev/)
- [React 文档](https://react.dev/)
- [Tailwind CSS 文档](https://tailwindcss.com/)
- [智谱 AI 文档](https://open.bigmodel.cn/)

## 📄 License

MIT

---

**L.E.A.P.** - Decoding the world through Language, Engineering, Algorithms, and Physics.
