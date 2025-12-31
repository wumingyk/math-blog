# My-Blog 项目概述

> 生成时间: 2025-12-31
> 用途: 帮助 Claude Code 快速了解项目结构和技术栈

## 项目简介

这是一个基于 **React + Vite** 构建的个人博客网站，专注于技术、数学和物理等领域的知识分享。网站名称为 **L.E.A.P.** (Language, Engineering, Algorithms, Physics)，支持 Markdown 博客文章、数学公式渲染、交互式演示等功能。

## 技术栈

### 核心框架
- **React 18.2** - 前端框架
- **Vite 5.4** - 构建工具
- **React Router DOM 7.10** - 路由管理

### UI & 样式
- **Tailwind CSS 3.4** - CSS 框架
- **@tailwindcss/typography** - Markdown 排版
- **lucide-react** - 图标库
- **yet-another-react-lightbox** - 图片画廊

### 内容渲染
- **react-markdown** - Markdown 渲染
- **remark-gfm** - GitHub Flavored Markdown
- **remark-math** - 数学公式解析
- **rehype-katex** - KaTeX 数学公式渲染
- **rehype-highlight** - 代码高亮
- **front-matter** - Frontmatter 解析

### 可视化 & 交互
- **D3.js 7.9** - 数据可视化
- **Three.js 0.182** - 3D 图形
- **KaTeX 0.16** - 数学公式渲染

### 其他工具
- **react-helmet-async** - SEO 管理
- **rss** - RSS 订阅生成
- **clsx & tailwind-merge** - 类名工具

## 项目结构

```
my-blog/
├── src/
│   ├── pages/              # 页面组件
│   │   ├── Home.jsx        # 首页（文章列表 + 分类筛选）
│   │   ├── PostRoute.jsx   # 文章路由页面
│   │   ├── Post.jsx        # 文章详情页
│   │   ├── About.jsx       # 关于页面
│   │   └── Subscribe.jsx   # 订阅页面
│   │
│   ├── components/         # 可复用组件
│   │   ├── Header.jsx              # 导航头部（含主题切换）
│   │   ├── PostListItem.jsx        # 文章列表项
│   │   ├── MarkdownRenderer.jsx    # Markdown 渲染器
│   │   ├── LoadingSkeleton.jsx     # 加载骨架屏
│   │   ├── AudioPlayer.jsx         # 音频播放器
│   │   ├── SocialLink.jsx          # 社交媒体链接
│   │   │
│   │   ├── 交互式演示组件
│   │   ├── SineCurveDemo.jsx              # 正弦曲线演示
│   │   ├── SineSurfaceDemo.jsx            # 正弦曲面演示
│   │   ├── RectRotationDemo.jsx           # 矩形旋转演示
│   │   ├── DotNumberDemo.jsx              # 点数数字演示
│   │   ├── DotGroupingDemo.jsx            # 点分组演示
│   │   ├── DecimalGroupingDemo.jsx        # 十进制分组演示
│   │   ├── Base10PlaceValueDemo.jsx       # 十进制位值演示
│   │   ├── CountingProcessDemo.jsx        # 计数过程演示
│   │   └── NumberChristmasTreeDemo.jsx    # 数字圣诞树演示
│   │   │
│   │   └── 第三方嵌入组件
│   │       ├── DesmosEmbed.jsx     # Desmos 图形计算器
│   │       ├── GeoGebraEmbed.jsx   # GeoGebra 几何软件
│   │       └── JupyterEmbed.jsx    # Jupyter Notebook
│   │
│   ├── lib/                # 工具函数库
│   │   ├── loadPosts.js           # 文章加载服务（含缓存）
│   │   ├── parseFrontmatter.js    # Frontmatter 解析
│   │   ├── categoryMapping.js     # 分类映射
│   │   └── generateRSS.js         # RSS 生成
│   │
│   ├── posts/              # 博客文章（Markdown 格式）
│   │   ├── markdown.md
│   │   ├── commutative-law.md
│   │   ├── entropy-and-time.md
│   │   ├── euler-identity.md
│   │   ├── why-prime-numbers-matter.md
│   │   └── ... (更多文章)
│   │
│   ├── App.jsx             # 应用主组件（路由 + 主题管理）
│   ├── main.jsx            # 应用入口
│   ├── index.css           # 全局样式
│   └── App.css             # 应用样式
│
├── public/                 # 静态资源
│   ├── images/            # 图片资源
│   ├── audio/             # 音频资源
│   ├── rss.xml            # RSS 订阅文件（自动生成）
│   └── vite.svg
│
├── scripts/                # 构建脚本
│   ├── generate-rss.mjs          # RSS 生成脚本
│   └── generate-sitemap.mjs      # Sitemap 生成脚本
│
├── dist/                   # 构建输出目录
├── package.json            # 项目配置
├── vite.config.js         # Vite 配置
├── tailwind.config.js     # Tailwind 配置
└── DRAFT_GUIDE.md         # 草稿文章使用指南

```

## 核心功能

### 1. 博客系统
- **文章管理**: Markdown 格式存储在 `src/posts/` 目录
- **Frontmatter**: 支持文章元数据（标题、日期、分类、发布状态）
- **草稿系统**: 通过 `published: false` 隐藏草稿文章
- **分类筛选**: 首页支持按分类筛选文章

### 2. 主题切换
- **深色/浅色模式**: 全站支持主题切换
- **持久化**: 使用 localStorage 保存用户偏好
- **自动应用**: 通过 Tailwind CSS dark: 前缀实现

### 3. 内容渲染
- **Markdown**: 支持完整的 GFM (GitHub Flavored Markdown)
- **数学公式**: KaTeX 渲染行内和块级公式
- **代码高亮**: 自动语法高亮
- **图片支持**: 响应式图片 + Lightbox 画廊

### 4. 交互式演示
集成多个数学/物理可视化组件：
- D3.js 数据可视化
- Three.js 3D 图形
- Desmos/GeoGebra 嵌入
- Jupyter Notebook 嵌入

### 5. SEO & 订阅
- **Meta 标签**: 使用 react-helmet-async 管理
- **RSS 订阅**: 构建时自动生成 RSS feed
- **Sitemap**: 自动生成网站地图

## 文章 Frontmatter 格式

```yaml
---
title: "文章标题"
date: "2025-12-31"
category: "分类名称"
published: true   # 可选，默认为 true
excerpt: "文章摘要"  # 可选
author: "作者名"   # 可选
---

# 文章内容

这里是 Markdown 正文...
```

**支持的分类** (定义在 `src/lib/categoryMapping.js`):
- Tech
- Math
- Physics
- Philosophy
- 等等...

## 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器 (http://localhost:5173)
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 代码检查
npm run lint

# 生成 RSS feed
npm run generate-rss

# 生成 Sitemap
npm run sitemap
```

**注意**: `npm run build` 会自动执行 `npm run generate-rss`

## 构建流程

1. **生成 RSS**: `npm run generate-rss` 读取所有文章，生成 `public/rss.xml`
2. **Vite 构建**: 编译 React 代码到 `dist/` 目录
3. **部署**: 将 `dist/` 目录内容部署到静态托管服务

## 草稿文章使用

详见 `DRAFT_GUIDE.md`，简要说明：

1. 在文章 frontmatter 添加 `published: false` 即可隐藏
2. 草稿文章不会出现在首页列表
3. 但仍可通过直接 URL 访问（方便预览和分享审阅）
4. 发布时删除 `published: false` 即可

## 配置文件说明

### `vite.config.js`
- 配置 React 插件
- 配置 Markdown 插件 (`vite-plugin-markdown-preview`)
- 设置 `.md` 文件作为资源处理

### `tailwind.config.js`
- Tailwind CSS 配置
- 自定义颜色、字体等

### `package.json`
- 项目依赖
- 构建脚本
- 项目元数据

## 部署建议

### GitHub Pages
```bash
npm run build
# 将 dist/ 目录部署到 gh-pages 分支
```

### Netlify/Vercel
- 构建命令: `npm run build`
- 输出目录: `dist/`
- 自动部署配置已包含在项目中

### 自定义服务器
- 构建后上传 `dist/` 目录到服务器
- 配置 SPA 路由回退（所有路由指向 `index.html`）

## 开发注意事项

### 文章加载机制
- 使用 Vite 的 `import.meta.glob` 批量导入文章
- 内存缓存 (`_postCache`) 避免重复解析
- 按日期降序排序

### 样式系统
- 使用 Tailwind CSS
- 深色模式通过 `dark:` 前缀实现
- 主色调: emerald (翠绿色)
- 背景色: 浅色模式 `#FAFAF9`，深色模式 `slate-950`

### 组件复用
- 所有组件使用函数式组件 + Hooks
- 使用 `clsx` 和 `tailwind-merge` 管理类名
- Props 传递使用解构赋值

## 常见任务

### 添加新文章
1. 在 `src/posts/` 创建新的 `.md` 文件
2. 添加 frontmatter 元数据
3. 编写 Markdown 内容
4. (可选) 设置 `published: false` 作为草稿

### 添加新分类
1. 编辑 `src/lib/categoryMapping.js`
2. 添加新的分类映射

### 修改主题颜色
1. 编辑 `tailwind.config.js`
2. 修改颜色配置

### 修改 RSS 配置
1. 编辑 `scripts/generate-rss.mjs`
2. 修改 `CONFIG` 对象（域名、标题、描述等）

## 项目特色

1. **轻量级**: 无后端，纯静态站点
2. **快速**: Vite 提供极速开发体验
3. **现代**: React 18 + 最新技术栈
4. **数学友好**: 完整的 LaTeX 数学公式支持
5. **交互性强**: 集成多种可视化工具
6. **SEO 优化**: 自动生成 RSS 和 Sitemap

## 相关文档

- [Vite 文档](https://vite.dev/)
- [React 文档](https://react.dev/)
- [Tailwind CSS 文档](https://tailwindcss.com/)
- [react-markdown 文档](https://github.com/remarkjs/react-markdown)
- [KaTeX 文档](https://katex.org/)

---

**快速恢复上下文提示**:
- 博客文章存放在 `src/posts/`
- 页面组件在 `src/pages/`
- 交互式演示组件在 `src/components/`
- 使用 `npm run dev` 启动开发服务器
- 支持草稿功能 (`published: false`)
