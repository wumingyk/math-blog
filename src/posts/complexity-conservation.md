---

title: "如何构建一个轻量级个人博客系统"
date: "2025-01-02"
tags: ["blog", "javascript", "react", "markdown"]
summary: "用最小依赖构建可本地编辑 Markdown 的极简博客系统。"
-----------------------------------------

# 如何构建一个轻量级个人博客系统

很多人想写博客，却不想折腾复杂的框架。本篇记录我如何从零实现一个可本地编辑 Markdown、自动扫描文章并渲染的极简博客系统。

## 目标

* **文章以 Markdown 存储**
* **本地编辑 → 自动更新**
* **无需后端**
* **轻量、易部署**

## 关键思路

1. 在 `/posts` 文件夹放置 `.md` 文件
2. 使用 `import.meta.glob` 扫描文件
3. 使用 `gray-matter` 解析 front-matter
4. 使用 `marked` 渲染 Markdown
5. 自动跳转到 `/post/:slug`

## 代码示例

```js
const files = import.meta.glob("/posts/*.md", { eager: true });
```

## 总结

博客系统不需要庞大，只要写作者愿意持续更新，这样的小结构足够陪伴你很多年。
