// src/lib/loadPosts.js
import frontMatter from 'front-matter';

// 使用 Vite 的 import.meta.glob 批量导入文件
// { query: '?raw', import: 'default' } 表示以字符串形式直接加载
const markdownFiles = import.meta.glob('../posts/*.md', { query: '?raw', import: 'default', eager: true });

let _postCache = null;

/**
 * 解析 Frontmatter（使用 front-matter 库）
 * @param {string} fileName - 文件名
 * @param {string} rawContent - 原始内容
 * @returns {Object|null} 解析后的文章对象
 */
function parseFrontmatter(fileName, rawContent) {
  try {
    // 使用 front-matter 库解析
    const parsed = frontMatter(rawContent);

    // 生成 Slug (移除 .md 后缀)
    const slug = fileName.replace('.md', '');

    // 如果没有 frontmatter，返回默认结构
    if (!parsed.attributes || Object.keys(parsed.attributes).length === 0) {
      return {
        slug,
        title: slug,
        date: 'Unknown',
        category: 'Uncategorized',
        content: rawContent
      };
    }

    return {
      slug,
      ...parsed.attributes,
      content: parsed.body
    };
  } catch (e) {
    console.error(`Error parsing ${fileName}:`, e);
    return null;
  }
}

/**
 * 文章加载服务
 */
export const loadPosts = {
  /**
   * 获取所有文章列表（按日期降序排序）
   * @returns {Promise<Array>} 文章数组
   */
  getAll: async () => {
    // 简单的内存缓存，避免重复解析
    if (_postCache) {
      return _postCache;
    }

    // 遍历 glob 导入的结果
    const posts = Object.keys(markdownFiles).map((path) => {
      const fileName = path.split('/').pop(); // 从路径 ../posts/abc.md 获取 abc.md
      const rawContent = markdownFiles[path];
      
      // 调用解析器
      return parseFrontmatter(fileName, rawContent);
    }).filter(post => post !== null); // 过滤掉解析失败的

    // 按日期降序排序
    posts.sort((a, b) => {
      const dateA = new Date(a.date || '1970-01-01');
      const dateB = new Date(b.date || '1970-01-01');
      return dateB - dateA;
    });

    _postCache = posts;
    return posts;
  },

  /**
   * 根据 slug 获取单篇文章
   * @param {string} slug - 文章 slug
   * @returns {Promise<Object>} 文章对象
   */
  getBySlug: async (slug) => {
    const posts = await loadPosts.getAll();
    const post = posts.find(p => p.slug === slug);
    if (!post) {
      throw new Error(`Post not found: ${slug}`);
    }
    return post;
  }
};
