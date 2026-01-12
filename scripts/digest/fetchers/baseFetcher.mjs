/**
 * 基础抓取器类
 * 所有数据源抓取器都应继承此类
 */
import { logger } from '../utils/logger.mjs';

export class BaseFetcher {
  constructor(config = {}) {
    this.config = config;
    this.name = this.constructor.name.replace('Fetcher', '');
    this.enabled = config.enabled !== false;
  }

  /**
   * 抓取数据（子类必须实现）
   * @returns {Promise<Array>} 抓取的数据数组
   */
  async fetch() {
    throw new Error(`${this.name}.fetch() must be implemented`);
  }

  /**
   * 标准化数据项
   * @param {Object} item - 原始数据项
   * @returns {Object} 标准化后的数据项
   */
  normalize(item) {
    return {
      id: item.id || this.generateId(),
      title: item.title || item.text?.substring(0, 50) || '无标题',
      content: item.text || item.content || item.description || '',
      author: item.author || item.owner?.name || '未知',
      url: item.url || item.link || '',
      publishedAt: item.publishedAt || item.pubdate || new Date(),
      metadata: item.metadata || {},
      source: this.name,
    };
  }

  /**
   * 生成唯一 ID
   * @returns {string} 唯一 ID
   */
  generateId() {
    return `${this.name.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 带重试的抓取
   * @param {number} maxRetries - 最大重试次数
   * @returns {Promise<Array>} 抓取的数据数组
   */
  async fetchWithRetry(maxRetries = 3) {
    let lastError;

    for (let i = 0; i < maxRetries; i++) {
      try {
        logger.debug(`${this.name}: 尝试抓取 (第 ${i + 1} 次)`);
        const data = await this.fetch();
        logger.success(`${this.name}: 抓取成功，获取 ${data.length} 条数据`);
        return data;
      } catch (error) {
        lastError = error;
        logger.warning(`${this.name}: 抓取失败 (${error.message})`);

        if (i < maxRetries - 1) {
          const delay = Math.pow(2, i) * 1000; // 指数退避
          logger.debug(`${this.name}: 等待 ${delay}ms 后重试...`);
          await this.sleep(delay);
        }
      }
    }

    logger.error(`${this.name}: 抓取失败，已达到最大重试次数`, lastError);
    return [];
  }

  /**
   * 执行抓取（带错误处理）
   * @returns {Promise<Array>} 抓取的数据数组
   */
  async execute() {
    if (!this.enabled) {
      logger.info(`${this.name}: 已禁用，跳过抓取`);
      return [];
    }

    try {
      const rawData = await this.fetchWithRetry();
      return rawData.map(item => this.normalize(item));
    } catch (error) {
      logger.error(`${this.name}: 执行失败`, error);
      return [];
    }
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
   * 验证必需的配置
   * @param {Array<string>} requiredKeys - 必需的配置键
   * @throws {Error} 如果缺少必需配置
   */
  validateConfig(requiredKeys = []) {
    const missingKeys = requiredKeys.filter(key => !this.config[key]);
    if (missingKeys.length > 0) {
      throw new Error(`${this.name}: 缺少必需配置: ${missingKeys.join(', ')}`);
    }
  }
}

export default BaseFetcher;
