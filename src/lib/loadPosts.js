// src/lib/loadPosts.js
// 使用 Vite 的 import.meta.glob 批量导入文件
// { as: 'raw', eager: true } 表示以字符串形式直接加载，不需要异步 await import()
const markdownFiles = import.meta.glob('../posts/*.md', { as: 'raw', eager: true });

let _postCache = null;

/**
 * 解析 Frontmatter
 * @param {string} fileName - 文件名
 * @param {string} rawContent - 原始内容
 * @returns {Object|null} 解析后的文章对象
 */
function parseFrontmatter(fileName, rawContent) {
  try {
    // 使用正则表达式匹配 frontmatter 分隔符（支持 --- 或 -{3,}）
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n-{3,}\s*\n([\s\S]*)$/;
    const match = rawContent.match(frontmatterRegex);
    
    // 如果没有标准的 frontmatter，返回默认结构
    if (!match) {
      // 尝试从文件名生成 slug
      const slug = fileName.replace('.md', '');
      return {
        slug,
        title: slug,
        date: 'Unknown',
        category: 'Uncategorized',
        content: rawContent
      };
    }

    const yamlBlock = match[1];
    const content = match[2].trim();
    
    // 简单的 YAML 解析器 (手动实现，为了不依赖第三方库)
    const metadata = {};
    yamlBlock.split('\n').forEach(line => {
      const match = line.match(/^(\w+):\s*(.+)$/);
      if (match) {
        let value = match[2].trim();
        // 去除引号
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }
        // 处理布尔值
        if (value === 'true') value = true;
        if (value === 'false') value = false;
        
        metadata[match[1]] = value;
      }
    });

    // 生成 Slug (移除 .md 后缀)
    const slug = fileName.replace('.md', '');

    return {
      slug,
      ...metadata,
      content
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
