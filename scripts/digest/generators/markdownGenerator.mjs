/**
 * Markdown 生成器
 * 将处理后的数据生成 Markdown 文件
 */
import { formatDate } from '../utils/dateUtils.mjs';
import { logger } from '../utils/logger.mjs';

class MarkdownGenerator {
  constructor(config = {}) {
    this.config = config;
  }

  /**
   * 生成完整的 Markdown 文档
   * @param {Array<Object>} data - 处理后的数据数组
   * @param {Object} options - 生成选项
   * @returns {string} Markdown 文档
   */
  generate(data, options = {}) {
    const date = options.date || new Date();
    const stats = this.calculateStats(data);

    const frontmatter = this.generateFrontmatter(date, stats);
    const content = this.generateContent(data, stats);

    return `${frontmatter}\n\n${content}`;
  }

  /**
   * 生成 Frontmatter
   * @param {Date} date - 日期
   * @param {Object} stats - 统计信息
   * @returns {string} Frontmatter 块
   */
  generateFrontmatter(date, stats) {
    const dateStr = formatDate(date, 'YYYY-MM-DD');
    const titleDate = formatDate(date, 'YYYY年MM月DD日');

    return `---
title: "每日资讯精选 - ${titleDate}"
date: "${dateStr}"
digestType: "daily"
category: "资讯"
tags: ${JSON.stringify(stats.topTags.slice(0, 5))}
stats:
  totalItems: ${stats.total}
  sources: ${JSON.stringify(stats.sources)}
  categories: ${JSON.stringify(stats.categories)}
  generatedAt: "${new Date().toISOString()}"
---`;
  }

  /**
   * 生成内容
   * @param {Array<Object>} data - 数据数组
   * @param {Object} stats - 统计信息
   * @returns {string} Markdown 内容
   */
  generateContent(data, stats) {
    let markdown = '';

    // 标题和简介
    markdown += '> 由 AI 自动生成的每日资讯精选\n\n';

    // 今日概览
    markdown += this.generateOverview(stats);

    // 分隔线
    markdown += '\n---\n\n';

    // 按分类组织内容
    const grouped = this.groupByCategory(data);
    const categoryOrder = ['科技', '创业', '设计', '数理', '思考', '其他'];

    for (const category of categoryOrder) {
      if (!grouped[category] || grouped[category].length === 0) continue;

      markdown += `### ${category}\n\n`;

      for (const item of grouped[category]) {
        markdown += this.generateItemCard(item);
        markdown += '\n\n';
      }
    }

    return markdown;
  }

  /**
   * 生成概览部分
   * @param {Object} stats - 统计信息
   * @returns {string} 概览 Markdown
   */
  generateOverview(stats) {
    let markdown = '## 📊 今日概览\n\n';
    markdown += `- **总计**: ${stats.total} 条\n`;
    markdown += `- **来源**: ${stats.sources.join(', ')}\n`;
    markdown += `- **分类**: ${stats.categories.join(', ')}\n`;
    markdown += `- **热门标签**: ${stats.topTags.slice(0, 10).map(t => '#' + t).join(' ')}\n`;

    return markdown;
  }

  /**
   * 生成单条资讯卡片
   * @param {Object} item - 数据项
   * @returns {string} 资讯卡片 Markdown
   */
  generateItemCard(item) {
    const sourceIcon = this.getSourceIcon(item.source);

    let markdown = `#### [${item.title}] - ${sourceIcon}\n\n`;
    markdown += `- **摘要**: ${item.summary}\n`;
    markdown += `- **分类**: ${item.category}\n`;

    if (item.tags && item.tags.length > 0) {
      markdown += `- **标签**: ${item.tags.map(t => '#' + t).join(' ')}\n`;
    }

    markdown += `- **作者**: ${item.author}\n`;
    markdown += `- **链接**: [查看原文](${item.url})\n`;

    if (item.insight) {
      markdown += `- **AI 洞察**: ${item.insight}\n`;
    }

    // 如果有额外元数据，可以在这里添加
    if (item.metadata) {
      const metaInfo = this.formatMetadata(item);
      if (metaInfo) {
        markdown += `- **数据**: ${metaInfo}\n`;
      }
    }

    return markdown;
  }

  /**
   * 格式化元数据
   * @param {Object} item - 数据项
   * @returns {string} 格式化后的元数据
   */
  formatMetadata(item) {
    const parts = [];

    if (item.metadata.view) {
      parts.push(`播放 ${this.formatViewCount(item.metadata.view)}`);
    }

    if (item.metadata.like) {
      parts.push(`点赞 ${this.formatViewCount(item.metadata.like)}`);
    }

    if (item.metadata.duration) {
      parts.push(`时长 ${this.formatDuration(item.metadata.duration)}`);
    }

    return parts.join(' · ');
  }

  /**
   * 格式化观看次数
   * @param {number} view - 观看次数
   * @returns {string} 格式化后的字符串
   */
  formatViewCount(view) {
    if (view >= 100000000) {
      return `${(view / 100000000).toFixed(1)}亿`;
    } else if (view >= 10000) {
      return `${(view / 10000).toFixed(1)}万`;
    }
    return view.toString();
  }

  /**
   * 格式化时长
   * @param {number} seconds - 秒数
   * @returns {string} 格式化后的时长
   */
  formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${minutes}:${String(secs).padStart(2, '0')}`;
  }

  /**
   * 获取来源图标
   * @param {string} source - 来源名称
   * @returns {string} 图标
   */
  getSourceIcon(source) {
    const icons = {
      'X': '𝕏',
      'Twitter': '𝕏',
      '微博': '🌱',
      'B站': '📺',
      'Bilibili': '📺',
      '知乎': '📖',
      'GitHub': '💻',
    };
    return icons[source] || source;
  }

  /**
   * 按分类分组
   * @param {Array<Object>} data - 数据数组
   * @returns {Object} 分组后的对象
   */
  groupByCategory(data) {
    return data.reduce((acc, item) => {
      const category = item.category || '其他';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {});
  }

  /**
   * 计算统计信息
   * @param {Array<Object>} data - 数据数组
   * @returns {Object} 统计信息
   */
  calculateStats(data) {
    const sources = [...new Set(data.map(d => d.source))];
    const categories = [...new Set(data.map(d => d.category || '其他'))];

    const tagCounts = {};
    data.forEach(item => {
      if (item.tags && Array.isArray(item.tags)) {
        item.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });

    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag);

    return {
      total: data.length,
      sources,
      categories,
      topTags,
    };
  }

  /**
   * 保存到文件
   * @param {string} content - Markdown 内容
   * @param {string} filePath - 文件路径
   * @returns {Promise<void>}
   */
  async saveToFile(content, filePath) {
    try {
      await import('fs/promises').then(fs => fs.writeFile(filePath, content, 'utf-8'));
      logger.success(`Markdown 文件已保存: ${filePath}`);
    } catch (error) {
      logger.error(`保存文件失败: ${filePath}`, error);
      throw error;
    }
  }
}

export default MarkdownGenerator;
