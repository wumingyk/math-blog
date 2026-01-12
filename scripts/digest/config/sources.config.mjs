/**
 * 数据源配置
 */

export const SOURCES_CONFIG = {
  // B站配置
  bilibili: {
    enabled: true,
    count: 10, // 抓取数量
  },

  // Twitter 配置（暂时禁用，Nitter 镜像不稳定）
  twitter: {
    enabled: false, // 暂时禁用
    accounts: ['elonmusk', 'sama', 'OpenAI'], // 要抓取的账号列表
    tweetsPerAccount: 3, // 每个账号抓取 3 条
    bearerToken: process.env.TWITTER_BEARER_TOKEN, // 可选：官方 API
  },

  // 微博配置
  weibo: {
    enabled: true, // 启用热搜榜
    count: 10, // 抓取热搜数量
    categories: ['科技', 'AI', '互联网'], // 分类筛选（可选）
  },

  // 其他数据源可以在这里添加
  // zhihu: { enabled: false },
  // github: { enabled: false },
};

// AI 配置
export const AI_CONFIG = {
  provider: 'qwen', // qwen, wenxin, etc.
  model: 'qwen-turbo', // qwen-turbo 更便宜
  apiKey: process.env.QWEN_API_KEY,
  maxTokens: 2000,
  temperature: 0.3,
  batchSize: 5, // 批量处理大小
};

// 生成配置
export const GENERATOR_CONFIG = {
  outputDir: './src/posts/digest',
  filenamePattern: 'YYYY-MM-DD', // 日期格式
};

export default {
  SOURCES_CONFIG,
  AI_CONFIG,
  GENERATOR_CONFIG,
};
