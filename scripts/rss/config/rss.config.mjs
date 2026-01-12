/**
 * RSS 抓取配置
 */
export const RSS_CONFIG = {
  // 每个源抓取的最新文章数量
  maxItemsPerFeed: 5,

  // 总文章数量限制
  maxTotalItems: 50,

  // 并发请求数
  concurrency: 3,

  // 请求超时（毫秒）
  timeout: 10000,

  // 增量更新（只抓取新的内容）
  incremental: false, // 暂时禁用，每次全量抓取
};

// AI 配置
export const AI_CONFIG = {
  provider: 'zhipu', // 'qwen' | 'zhipu' | 'wenxin'
  model: 'glm-4-flash', // 智谱: glm-4, glm-4-flash, glm-4-air
  apiKey: process.env.ZHIPU_API_KEY || process.env.QWEN_API_KEY,
  maxTokens: 3000,
  temperature: 0.3,
  batchSize: 5, // 批量翻译
};

export default {
  RSS_CONFIG,
  AI_CONFIG,
};
