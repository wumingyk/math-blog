/**
 * 每日资讯加载器
 * 参考 loadPosts.js 的实现模式
 */
import frontMatter from 'front-matter';

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
      let parsed;
      try {
        parsed = frontMatter(rawContent);
      } catch (error) {
        console.error('Frontmatter 解析失败:', error);
        parsed = { attributes: {}, body: rawContent };
      }

      return {
        slug: fileName,
        ...(parsed.attributes || {}),
        content: (parsed.body || '').trim(),
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

export default loadDigestPosts;
