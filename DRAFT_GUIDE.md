# 草稿文章使用指南

## 如何隐藏文章

在文章的 frontmatter 中添加 `published: false` 即可隐藏文章：

```yaml
---
title: "我的草稿文章"
date: "2025-01-02"
category: "Tech"
published: false  # 设置为 false 隐藏这篇文章
---

# 文章内容

这是草稿内容，不会在网站显示...
```

## 默认行为

- 如果文章**没有** `published` 字段 → **显示**（默认行为）
- 如果 `published: true` → **显示**
- 如果 `published: false` → **隐藏**

## 草稿文章仍然可以访问

即使文章被隐藏（`published: false`），你仍然可以通过直接访问 URL 来查看它：

```
http://localhost:5173/post/your-draft-post-slug
```

这使得你可以在发布前分享草稿链接给他人审阅。

## 实际应用场景

1. **写作中**：在完成文章前隐藏它
2. **内容审核**：写完但需要校对时隐藏
3. **定时发布**：先写好文章，发布时去掉 `published: false`
4. **私密文章**：只想分享给特定的人（通过直接链接）

## 示例

### 已发布的文章
```yaml
---
title: "公开文章"
date: "2025-01-02"
category: "Tech"
# 不需要 published 字段，或设置为 true
---
```

### 草稿文章
```yaml
---
title: "草稿文章"
date: "2025-01-02"
category: "Tech"
published: false  # 隐藏
---
```

## 发布草稿

要将草稿发布到网站，只需要：

1. 打开文章的 `.md` 文件
2. 删除 `published: false` 这一行，或改为 `published: true`
3. 保存文件

文章会立即出现在网站上！
