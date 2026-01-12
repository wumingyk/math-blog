# RSS 资讯聚合系统 - 使用说明

## 配置智谱 AI (GLM-4)

### 步骤 1: 填写 API Key

编辑 `.env` 文件，将 `your-zhipu-api-key-here` 替换为你的真实 API Key：

```bash
# 使用你喜欢的编辑器打开 .env
open .env
```

替换为：
```env
ZHIPU_API_KEY=你的真实API_Key
```

### 步骤 2: 加载环境变量并运行

```bash
# 方式 1: 直接设置环境变量
export ZHIPU_API_KEY="你的真实API_Key"
node scripts/rss/index.mjs

# 方式 2: 从 .env 文件加载
export $(cat .env | grep -v '^#' | xargs)
node scripts/rss/index.mjs
```

### 步骤 3: 等待翻译完成

- **总文章数**: 50 篇
- **批次大小**: 5 篇/批
- **预计时间**: 2-3 分钟
- **模型**: GLM-4-Flash (快速版)

你会看到：
```
============================================================
🚀 开始生成 RSS 资讯...
============================================================

📡 第 1 步: 抓取 RSS 源
✅ 总共抓取 50 篇文章

🤖 第 2 步: AI 翻译中...
使用 zhipu 进行批量翻译 (批次大小: 5)
翻译批次 1/10
翻译批次 2/10
...
✅ AI 翻译完成

📝 第 3 步: 生成 JSON 数据...
💾 第 4 步: 保存文件...
============================================================
✨ RSS 资讯生成成功!
📊 统计: 50 篇文章
============================================================
```

## 查看结果

访问：http://localhost:5173/feed

你会看到：
- 中文标题
- 中文摘要
- 中英文关键词
- 原文链接

## 智谱 AI 模型说明

当前配置使用 `glm-4-flash`：
- **优点**: 速度快、成本低
- **适用**: 翻译任务
- **价格**: 约 ¥0.5/百万 tokens

可选模型：
- `glm-4` - 主模型，能力更强
- `glm-4-air` - 轻量级，速度快
- `glm-4-flash` - 超快速，成本最低（当前使用）

如需切换模型，编辑 `scripts/rss/config/rss.config.mjs`：
```javascript
model: 'glm-4', // 或 'glm-4-air', 'glm-4-flash'
```

## 成本估算

使用 GLM-4-Flash 翻译 50 篇文章：
- 输入: ~100k tokens
- 输出: ~150k tokens
- 成本: ~¥0.75

每月成本（每天更新）：
- **约 ¥20-30/月**

## 常见问题

### Q: 翻译失败怎么办？
A: 检查 API Key 是否正确，网络是否正常

### Q: 想只翻译部分文章？
A: 修改 `scripts/rss/config/rss.config.mjs` 中的 `maxTotalItems`

### Q: 如何加快翻译速度？
A: 减小 `batchSize` 或增加 `concurrency`（但可能触发限流）

### Q: 翻译质量不满意？
A: 可以修改 `scripts/rss/ai/translator.mjs` 中的 `TRANSLATE_PROMPT`

## 下次更新

只需再次运行：
```bash
export ZHIPU_API_KEY="你的API_Key"
node scripts/rss/index.mjs
```

数据会自动更新到 `src/data/rss-feed.json`，刷新浏览器即可看到最新内容。
