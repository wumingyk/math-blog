# 博客文章模板标准

> 用于 Reading 项目生成博客文章的模板规范

## 文件位置

```
my-blog/src/posts/
├── {slug}.md              # 普通技术文章
├── digest/                # 读书笔记（阅读摘要）
│   └── YYYY-MM-DD.md
└── reading/               # 完整读书笔记（可选）
│   └── {book-slug}.md
```

## Frontmatter 模板

### 标准技术文章

```yaml
---
title: "文章标题"
date: "2026-02-15"          # ISO 格式日期
category: "Category"        # 见下方分类列表
tags: ["tag1", "tag2"]      # 相关标签
description: "文章摘要，用于SEO和列表展示"
published: true             # true=发布, false=草稿
audio: "/audio/{slug}.mp3"   # 可选：音频文件路径
---
```

### 读书笔记（digest）

```yaml
---
title: "书名 第X章：章节标题"
date: "2026-02-15"
category: "Reading"
tags: ["书名", "作者", "主题1", "主题2"]
description: "本章核心观点摘要"
published: true
source:
  book: "书名"
  author: "作者名"
  chapter: "第X章"
  progress: "XX/YYY 页"     # 阅读进度
---
```

## 分类列表

| Category | 说明 | 示例 |
|----------|------|------|
| `Math` | 数学 | 圆周率、数论、几何 |
| `Physics` | 物理 | 熵、时间、量子力学 |
| `Algorithm` | 算法 | 复杂度、数据结构 |
| `Engineering` | 工程 | 系统设计、架构 |
| `Reading` | 读书笔记 | 书籍章节摘要 |
| `Essay` | 随笔 | 思考、感悟 |

## 正文格式规范

### 标题层级

```markdown
# 一级标题（通常就是文章标题，正文不用）

## 二级标题（主要章节）

### 三级标题（小节）

#### 四级标题（可选，较少使用）
```

### 引用块

```markdown
> 重要引用或核心观点

> **作者：** 具体引用内容
```

### 数学公式

```markdown
行内公式：$E = mc^2$

块级公式：
$$
\pi = \frac{\text{圆的周长}}{\text{圆的直径}} \approx 3.14159\dots
$$
```

### 表格

```markdown
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| A | B | C |
| D | E | F |
```

### 列表

```markdown
- 无序列表项
- 另一个项
  - 子项
  - 子项

1. 有序列表项
2. 第二个项
```

### 代码块

```markdown
```python
def example():
    return "Hello World"
```
```

## 阅读笔记专用格式

### 章节结构

```markdown
## 一、章节核心观点

### 子主题1
内容...

### 子主题2
内容...

## 二、重要摘录

> **关键引用**
> 具体内容...

## 三、个人思考

- 思考点1
- 思考点2

## 四、相关连接

- [相关文章](/post/{slug})
- [书籍信息](https://...)
```

## slug 命名规范

```
书名-章节-标题.md          # 第三牧场-第2章-阶层分化.md
topic-keyword.md           # pi-the-universal-constant.md
author-title.md            # tynan-life-engineering.md
```

规则：
- 小写字母
- 单词间用连字符 `-`
- 去掉冠词 (a, an, the)
- 简短但有描述性

## 从 Reading 项目生成文章的脚本示例

```bash
#!/bin/bash
# 将 Reading 笔记转换为博客文章

SOURCE="$HOME/Documents/Reading/notes/数学/数学的语言：化无形为可见.md"
DEST="$HOME/Documents/my-blog/src/posts/reading/"

# 提取 frontmatter
cat > "$DEST/math-language-ch1.md" << 'EOF'
---
title: "数学的语言：化无形为可见 - 第1章"
date: "$(date +%Y-%m-%d)"
category: "Reading"
tags: ["数学", "齐斯·德福林", "数论", "抽象思维"]
description: "从实体计数到抽象数字的演变，探索数字的本质"
published: true
source:
  book: "数学的语言：化无形为可见"
  author: "齐斯·德福林"
  chapter: "第1章：数字为何靠得住"
  progress: "26/376"
---

EOF

# 追加正文（跳过原文件的 frontmatter）
tail -n +20 "$SOURCE" >> "$DEST/math-language-ch1.md"
```

## 自动化工具建议

在 Reading 项目中可以添加：

1. **笔记导出脚本**：`reading-to-blog.sh`
   - 读取 Reading/notes/ 中的完成章节
   - 按模板生成博客文章
   - 自动复制到 my-blog/src/posts/

2. **Frontmatter 生成器**
   - 输入：书名、章节、进度
   - 输出：标准化的 frontmatter

3. **发布检查清单**
   - [ ] frontmatter 完整
   - [ ] 日期格式正确
   - [ ] category 在允许列表中
   - [ ] tags 不为空
   - [ ] description 有内容
   - [ ] published 设为 true
