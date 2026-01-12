/**
 * 每日资讯加载器
 * 参考 loadPosts.js 的实现模式
 */
const digestFiles = import.meta.glob('../posts/digest/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

let _digestCache = null;

export const loadDigestPosts = {
  /**
   * 获取所有资讯文章
   * @returns {Promise<Array>} 资讯文章数组
   */
  getAll: async () => {
    if (_digestCache) {
      return _digestCache;
    }

    const posts = Object.keys(digestFiles).map((path) => {
      const fileName = path.split('/').pop().replace('.md', '');
      const rawContent = digestFiles[path];

      // 解析 frontmatter
      const frontmatterMatch = rawContent.match(/^---\n([\s\S]*?)\n---/);
      let attributes = {};
      let body = rawContent;

      if (frontmatterMatch) {
        try {
          // 手动解析 YAML frontmatter（简化版）
          const yamlText = frontmatterMatch[1];
          attributes = parseYAML(yamlText);
          body = rawContent.replace(frontmatterMatch[0], '');
        } catch (error) {
          console.error('Frontmatter 解析失败:', error);
        }
      }

      return {
        slug: fileName,
        ...attributes,
        content: body.trim(),
      };
    });

    // 按日期降序排序
    _digestCache = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    return _digestCache;
  },

  /**
   * 根据日期获取资讯
   * @param {string} date - 日期字符串 (YYYY-MM-DD)
   * @returns {Promise<Object>} 资讯文章对象
   */
  getByDate: async (date) => {
    const posts = await loadDigestPosts.getAll();
    return posts.find((p) => p.date === date);
  },

  /**
   * 获取最新的资讯
   * @returns {Promise<Object>} 最新的资讯文章
   */
  getLatest: async () => {
    const posts = await loadDigestPosts.getAll();
    return posts[0] || null;
  },

  /**
   * 清除缓存
   */
  clearCache: () => {
    _digestCache = null;
  },
};

/**
 * 简化的 YAML 解析器
 * @param {string} yamlText - YAML 文本
 * @returns {Object} 解析后的对象
 */
function parseYAML(yamlText) {
  const result = {};

  const lines = yamlText.split('\n');
  for (const line of lines) {
    // 跳过空行和注释
    if (!line.trim() || line.trim().startsWith('#')) continue;

    // 解析 key: value 格式
    const match = line.match(/^(\w+):\s*(.*)$/);
    if (match) {
      const [, key, value] = match;

      // 处理不同类型的值
      if (value === 'true') {
        result[key] = true;
      } else if (value === 'false') {
        result[key] = false;
      } else if (value.startsWith('[') && value.endsWith(']')) {
        // 数组
        result[key] = value
          .slice(1, -1)
          .split(',')
          .map((v) => v.trim().replace(/^"|"$/g, ''));
      } else if (value.startsWith('"') && value.endsWith('"')) {
        // 带引号的字符串
        result[key] = value.slice(1, -1);
      } else if (!isNaN(value)) {
        // 数字
        result[key] = Number(value);
      } else {
        // 普通字符串
        result[key] = value;
      }
    }
  }

  return result;
}

export default loadDigestPosts;
