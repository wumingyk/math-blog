/**
 * AI 处理器
 * 使用通义千问 API 进行内容处理
 */
import OpenAI from 'openai';
import { logger } from '../utils/logger.mjs';
import { DIGEST_PROMPT, BATCH_DIGEST_PROMPT, SYSTEM_PROMPT } from './prompts.mjs';

class AIProcessor {
  constructor(config = {}) {
    this.provider = config.provider || 'qwen';
    this.model = config.model || 'qwen-turbo';
    this.apiKey = config.apiKey || process.env.QWEN_API_KEY;
    this.maxTokens = config.maxTokens || 2000;
    this.temperature = config.temperature || 0.3;

    this.client = null;
    this.initialized = false;

    if (this.apiKey) {
      this.init();
    }
  }

  /**
   * 初始化 AI 客户端
   */
  init() {
    try {
      if (this.provider === 'qwen') {
        // 通义千问（兼容 OpenAI API）
        this.client = new OpenAI({
          apiKey: this.apiKey,
          baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
        });
      } else if (this.provider === 'wenxin') {
        // 文心一言（兼容 OpenAI API）
        this.client = new OpenAI({
          apiKey: this.apiKey,
          baseURL: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop',
        });
      } else {
        // 其他兼容 OpenAI API 的服务
        this.client = new OpenAI({
          apiKey: this.apiKey,
        });
      }

      this.initialized = true;
      logger.success(`AI 处理器初始化成功 (${this.provider})`);
    } catch (error) {
      logger.error('AI 处理器初始化失败', error);
    }
  }

  /**
   * 处理单条内容
   * @param {Object} item - 原始数据项
   * @returns {Promise<Object>} 处理后的数据项
   */
  async processItem(item) {
    if (!this.initialized) {
      logger.warning('AI 未初始化，跳过处理');
      return this.getFallbackResult(item);
    }

    try {
      const prompt = DIGEST_PROMPT
        .replace('{source}', item.source)
        .replace('{author}', item.author)
        .replace('{title}', item.title)
        .replace('{content}', this.truncateContent(item.content, 1000))
        .replace('{url}', item.url);

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ],
        temperature: this.temperature,
        max_tokens: this.maxTokens,
      });

      const content = response.choices[0].message.content;
      const aiResult = this.parseJSONResponse(content);

      logger.debug(`AI 处理成功: ${item.title}`);

      return {
        ...item,
        ...aiResult,
      };
    } catch (error) {
      logger.error(`AI 处理失败: ${item.title}`, error);
      return this.getFallbackResult(item);
    }
  }

  /**
   * 批量处理内容（更高效）
   * @param {Array<Object>} items - 原始数据项数组
   * @param {number} batchSize - 批次大小
   * @returns {Promise<Array<Object>>} 处理后的数据项数组
   */
  async processBatch(items, batchSize = 5) {
    if (!this.initialized) {
      logger.warning('AI 未初始化，使用降级方案');
      return items.map(item => this.getFallbackResult(item));
    }

    const results = [];

    // 分批处理
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      logger.info(`处理批次 ${Math.floor(i / batchSize) + 1}/${Math.ceil(items.length / batchSize)}`);

      try {
        const batchResult = await this.processOneBatch(batch);
        results.push(...batchResult);

        // 避免请求过快
        await this.sleep(1000);
      } catch (error) {
        logger.error(`批次处理失败`, error);
        // 失败时使用降级方案
        results.push(...batch.map(item => this.getFallbackResult(item)));
      }
    }

    return results;
  }

  /**
   * 处理一个批次
   * @param {Array<Object>} batch - 批次数据
   * @returns {Promise<Array<Object>>} 处理后的数据
   */
  async processOneBatch(batch) {
    const itemsText = batch
      .map((item, index) => {
        return `【项目 ${index + 1}】
ID: ${item.id}
来源: ${item.source}
作者: ${item.author}
标题: ${item.title}
内容: ${this.truncateContent(item.content, 500)}
链接: ${item.url}`;
      })
      .join('\n\n');

    const prompt = BATCH_DIGEST_PROMPT
      .replace('{count}', batch.length)
      .replace('{items}', itemsText);

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      temperature: this.temperature,
      max_tokens: 4000,
    });

    const content = response.choices[0].message.content;
    const aiResults = this.parseJSONResponse(content);

    // 合并 AI 结果到原始数据
    return batch.map(item => {
      const aiResult = aiResults.find(r => r.id === item.id) || {};
      return {
        ...item,
        ...aiResult,
      };
    });
  }

  /**
   * 解析 JSON 响应
   * @param {string} content - AI 返回的内容
   * @returns {Object} 解析后的对象
   */
  parseJSONResponse(content) {
    try {
      // 尝试直接解析
      return JSON.parse(content);
    } catch (error) {
      // 尝试提取 JSON 代码块
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[1]);
        } catch (e) {
          logger.warning('JSON 代码块解析失败');
        }
      }

      // 尝试提取任何 JSON 对象
      const objectMatch = content.match(/\{[\s\S]*\}/);
      if (objectMatch) {
        try {
          return JSON.parse(objectMatch[0]);
        } catch (e) {
          logger.warning('JSON 对象解析失败');
        }
      }

      logger.error('无法解析 AI 响应为 JSON', { content });
      return {};
    }
  }

  /**
   * 获取降级结果（AI 失败时使用）
   * @param {Object} item - 原始数据项
   * @returns {Object} 降级处理后的数据项
   */
  getFallbackResult(item) {
    return {
      ...item,
      summary: this.truncateContent(item.content, 100),
      category: '其他',
      tags: [],
      sentiment: 'neutral',
      insight: '',
    };
  }

  /**
   * 截断内容
   * @param {string} content - 原始内容
   * @param {number} maxLength - 最大长度
   * @returns {string} 截断后的内容
   */
  truncateContent(content, maxLength) {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  }

  /**
   * 延迟函数
   * @param {number} ms - 延迟毫秒数
   * @returns {Promise<void>}
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 检查是否可用
   * @returns {boolean}
   */
  isAvailable() {
    return this.initialized && this.client !== null;
  }
}

export default AIProcessor;
