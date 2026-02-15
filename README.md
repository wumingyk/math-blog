# L.E.A.P. - Exploring the World

> **L**anguage, **E**ngineering, **A**lgorithms, **P**hysics

一个基于 React + Vite 构建的个人博客网站，专注于技术、数学和物理等领域的知识分享。

## ✨ 特色功能

### 🎨 博客系统
- **Markdown 文章**：支持数学公式、代码高亮
- **分类筛选**：按技术领域分类
- **深色模式**：全站支持主题切换
- **响应式设计**：完美适配各种设备

### 📚 Reading 项目集成
- **读书笔记快速导入**：从 Reading 项目一键转换笔记为博客文章
- **标准化模板**：统一的 frontmatter 格式，支持阅读进度追踪
- **自动分类**：支持 Math/Physics/Algorithm/Engineering/Reading/Essay 分类

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

## 📁 项目结构

```
my-blog/
├── src/
│   ├── pages/              # 页面组件
│   │   ├── Home.jsx        # 首页（文章列表）
│   │   ├── Post.jsx        # 文章详情
│   │   └── About.jsx       # 关于页面
│   ├── components/         # 可复用组件
│   ├── lib/                # 工具函数
│   └── posts/              # 博客文章（Markdown）
│
├── scripts/
│   └── generate-sitemap.mjs # 站点地图生成
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

## 📚 从 Reading 项目导入

本项目与 [Reading 项目](~/Documents/Reading) 深度集成。

### 快速转换

```bash
# 转换读书笔记为博客文章
~/.openclaw/workspace/reading-to-blog.sh [笔记路径] [章节标题]

# 示例
~/.openclaw/workspace/reading-to-blog.sh \
  ~/Documents/Reading/notes/数学/数学的语言：化无形为可见.md \
  "第1章：数字为何靠得住"
```

### 模板标准

详见 [TEMPLATE.md](./TEMPLATE.md)

**关键字段**：
- `category`: Reading/Math/Physics/Algorithm/Engineering/Essay
- `source`: 书籍信息（book/author/chapter/progress）
- `published`: true/false

### 阅读笔记位置

```
src/posts/
├── reading/           # 读书笔记
│   └── math-language-ch1.md
├── digest/            # 阅读摘要
└── {other}/           # 其他文章
```

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

### 修改主题颜色

编辑 `tailwind.config.js` 中的颜色配置。

## 📖 相关文档

- [Vite 文档](https://vite.dev/)
- [React 文档](https://react.dev/)
- [Tailwind CSS 文档](https://tailwindcss.com/)

## 📄 License

MIT

---

**L.E.A.P.** - Decoding the world through Language, Engineering, Algorithms, and Physics.
