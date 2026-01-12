/**
 * AI 翻译处理器
 * 使用通义千问翻译英文内容
 */
import OpenAI from 'openai';
import { logger } from '../../digest/utils/logger.mjs';

// 翻译 Prompt
const TRANSLATE_PROMPT = `你是一个专业的科技翻译专家和内容筛选助手。请将以下英文资讯翻译成中文，并判断是否应该保留。

【筛选要求】
**必须同时满足以下条件才保留文章**：
1. **技术相关性**: 文章必须与技术相关（编程、AI、软件、硬件、互联网、科技创业、数据科学、网络安全等）
2. **非 AI 生成**: 文章应该是人类原创，而非 AI 自动生成的内容

**不应该保留的文章类型**：
- 纯商业新闻（融资、并购、股价、财报等）
- 产品评测（非技术性）
- 纯新闻资讯（没有技术深度）
- 明显是 AI 生成的列表/汇总文章
- 政策、法规、社会新闻
- 娱乐、消费电子评测

【翻译要求】
1. **标题翻译**: 准确翻译标题，保持专业性和可读性
2. **正文翻译**: 翻译文章内容，保留技术术语的英文原文（如 AI, API, LLM 等）
3. **关键词提取**: 提取 3-5 个核心关键词（中英文各一份）
4. **摘要生成**: 用中文概括文章核心观点（50-100字）

【原文】
标题: {title_en}
来源: {source}
内容: {content_en}
链接: {url}

【输出格式】（必须是有效的 JSON）：
\`\`\`json
{
  "should_include": true/false,
  "reason": "保留/过滤的原因",
  "title_zh": "翻译后的标题",
  "content_zh": "翻译后的内容",
  "summary_zh": "中文摘要",
  "keywords_zh": ["关键词1", "关键词2"],
  "keywords_en": ["keyword1", "keyword2"]
}
\`\`\`

注意事项：
- 如果文章不满足筛选条件，should_include 设为 false，并说明原因
- 技术文章要有深度，包含技术细节、代码、架构设计等
- 翻译要准确，保持技术术语
- 中文要流畅自然`;

class Translator {
  constructor(config = {}) {
    this.config = config;
    this.client = null;
    this.initialized = false;

    if (config.apiKey) {
      this.init();
    }
  }

  init() {
    try {
      // 根据提供商选择不同的 base URL
      const baseURLs = {
        'qwen': 'https://dashscope.aliyuncs.com/compatible-mode/v1',
        'zhipu': 'https://open.bigmodel.cn/api/paas/v4/',
        'wenxin': 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop',
      };

      const baseURL = baseURLs[this.config.provider] || baseURLs['qwen'];

      this.client = new OpenAI({
        apiKey: this.config.apiKey,
        baseURL: baseURL,
      });
      this.initialized = true;
      logger.success(`AI 翻译器初始化成功 (${this.config.provider})`);
    } catch (error) {
      logger.error('AI 翻译器初始化失败', error);
    }
  }

  /**
   * 翻译单条内容
   */
  async translate(item) {
    if (!this.initialized) {
      return this.getFallbackResult(item);
    }

    try {
      const prompt = TRANSLATE_PROMPT
        .replace('{title_en}', item.title)
        .replace('{source}', item.source)
        .replace('{content_en}', this.truncateContent(item.content, 1000))
        .replace('{url}', item.link);

      const response = await this.client.chat.completions.create({
        model: this.config.model,
        messages: [
          { role: 'system', content: '你是一个专业的科技翻译专家。' },
          { role: 'user', content: prompt },
        ],
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens,
      });

      const content = response.choices[0].message.content;
      const result = this.parseJSONResponse(content);

      logger.debug(`翻译成功: ${item.title.substring(0, 30)}...`);

      return {
        ...item,
        ...result,
      };
    } catch (error) {
      logger.error(`翻译失败: ${item.title}`, error);
      return this.getFallbackResult(item);
    }
  }

  /**
   * 批量翻译（优化成本）
   */
  async translateBatch(items, batchSize = 5) {
    if (!this.initialized) {
      logger.warning('AI 未初始化，使用原始数据');
      return items.map(item => this.getFallbackResult(item));
    }

    const results = [];

    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      logger.info(`翻译批次 ${Math.floor(i / batchSize) + 1}/${Math.ceil(items.length / batchSize)}`);

      const batchResults = await Promise.all(
        batch.map(item => this.translate(item))
      );

      results.push(...batchResults);

      // 避免请求过快
      await this.sleep(1000);
    }

    return results;
  }

  /**
   * 解析 JSON 响应
   */
  parseJSONResponse(content) {
    try {
      return JSON.parse(content);
    } catch (error) {
      // 尝试提取 JSON 代码块
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1]);
      }

      // 尝试提取任何 JSON 对象
      const objectMatch = content.match(/\{[\s\S]*\}/);
      if (objectMatch) {
        return JSON.parse(objectMatch[0]);
      }

      logger.error('无法解析 AI 响应为 JSON', { content });
      return {};
    }
  }

  /**
   * 获取降级结果
   */
  getFallbackResult(item) {
    return {
      ...item,
      should_include: true, // 默认保留
      reason: '未使用 AI，默认保留',
      title_zh: item.title,
      content_zh: item.content,
      summary_zh: item.content.substring(0, 100),
      keywords_zh: [],
      keywords_en: [],
    };
  }

  /**
   * 截断内容
   */
  truncateContent(content, maxLength) {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  }

  /**
   * 延迟函数
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 检查是否可用
   */
  isAvailable() {
    return this.initialized && this.client !== null;
  }
}

export default Translator;
