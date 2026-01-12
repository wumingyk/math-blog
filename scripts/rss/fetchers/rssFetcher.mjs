/**
 * RSS 抓取器
 * 使用 rss-parser 抓取 RSS 源
 */
import Parser from 'rss-parser';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { logger } from '../../digest/utils/logger.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const parser = new Parser({
  timeout: 10000,
  customFields: {
    item: [['media:content', 'media']],
  },
});

export class RSSFetcher {
  constructor(config = {}) {
    this.config = config;
    this.opmlPath = join(__dirname, '../config/feeds.opml');
  }

  /**
   * 解析 OPML 文件，提取所有 RSS 源
   */
  parseOPML() {
    try {
      const opmlContent = readFileSync(this.opmlPath, 'utf-8');
      const feeds = [];

      // 简单的 XML 解析（提取所有 xmlUrl 属性）
      const regex = /xmlUrl="([^"]+)"/g;
      let match;

      while ((match = regex.exec(opmlContent)) !== null) {
        feeds.push({
          url: match[1],
          category: this.categorizeUrl(match[1]),
        });
      }

      logger.info(`从 OPML 解析到 ${feeds.length} 个 RSS 源`);
      return feeds;
    } catch (error) {
      logger.error('OPML 解析失败', error);
      return [];
    }
  }

  /**
   * 根据 URL 分类
   */
  categorizeUrl(url) {
    if (url.includes('techcrunch') || url.includes('bloomberg')) {
      return 'Startup & Business';
    } else if (url.includes('github') || url.includes('stackoverflow') || url.includes('infoq') || url.includes('ycombinator')) {
      return 'Developer & Engineering';
    } else if (url.includes('technologyreview') || url.includes('lesswrong') || url.includes('alignmentforum')) {
      return 'AI & Future Tech';
    } else if (url.includes('krebsonsecurity') || url.includes('thehackernews')) {
      return 'Security';
    } else {
      return 'General Tech News';
    }
  }

  /**
   * 抓取单个 RSS 源
   */
  async fetchFeed(feedUrl, category) {
    try {
      logger.debug(`抓取 RSS: ${feedUrl}`);
      const feed = await parser.parseURL(feedUrl);

      const items = (feed.items || []).slice(0, this.config.maxItemsPerFeed).map(item => ({
        id: this.generateId(item.link || item.guid),
        title: item.title || 'Untitled',
        link: item.link,
        content: item.contentSnippet || item.content || '',
        pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
        source: feed.title || this.extractSource(feedUrl),
        sourceUrl: feedUrl,
        category: category,
      }));

      logger.success(`${feed.title || feedUrl}: ${items.length} 篇文章`);
      return items;
    } catch (error) {
      logger.warning(`RSS 抓取失败: ${feedUrl} - ${error.message}`);
      return [];
    }
  }

  /**
   * 抓取所有 RSS 源
   */
  async fetchAll() {
    const feeds = this.parseOPML();
    const allItems = [];

    // 分批抓取（避免并发过多）
    for (let i = 0; i < feeds.length; i += this.config.concurrency) {
      const batch = feeds.slice(i, i + this.config.concurrency);

      const results = await Promise.allSettled(
        batch.map(feed => this.fetchFeed(feed.url, feed.category))
      );

      results.forEach(result => {
        if (result.status === 'fulfilled') {
          allItems.push(...result.value);
        }
      });

      // 避免请求过快
      await this.sleep(1000);
    }

    // 按时间排序
    allItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    // 限制总数量
    const limitedItems = allItems.slice(0, this.config.maxTotalItems);

    logger.success(`✅ 总共抓取 ${limitedItems.length} 篇文章`);
    return limitedItems;
  }

  /**
   * 提取源名称
   */
  extractSource(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return 'Unknown';
    }
  }

  /**
   * 生成唯一 ID
   */
  generateId(str) {
    return `rss-${Buffer.from(str).toString('base64').slice(0, 20).replace(/[+/=]/g, '')}`;
  }

  /**
   * 延迟函数
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default RSSFetcher;
