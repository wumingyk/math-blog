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
    // 使用正则表达式匹配 frontmatter 分隔符
    // 支持多种格式：
    // 1. 标准的 --- 分隔符
    // 2. 任意长度的横线（至少3个）
    // 3. 允许 frontmatter 开始和结束都有空行
    
    // 首先尝试匹配标准的 frontmatter 格式
    let frontmatterRegex = /^---\s*\n([\s\S]*?)\n-{3,}\s*\n\s*([\s\S]*)$/;
    let match = rawContent.match(frontmatterRegex);
    
    // 如果没有匹配到，尝试更宽松的匹配（允许结束符后没有换行）
    if (!match) {
      frontmatterRegex = /^---\s*\n([\s\S]*?)\n-{3,}\s*([\s\S]*)$/;
      match = rawContent.match(frontmatterRegex);
    }
    
    // 如果还是没有匹配到，尝试匹配 frontmatter 开始有空行的情况
    if (!match) {
      frontmatterRegex = /^---\s*\n\s*([\s\S]*?)\n-{3,}\s*\n\s*([\s\S]*)$/;
      match = rawContent.match(frontmatterRegex);
    }
    
    // 如果还是没有匹配到，尝试最宽松的匹配
    if (!match) {
      frontmatterRegex = /^---\s*\n\s*([\s\S]*?)\n-{3,}\s*([\s\S]*)$/;
      match = rawContent.match(frontmatterRegex);
    }
    
    // 如果还是没有匹配到，返回默认结构（将整个内容作为 content）
    if (!match) {
      // 尝试从文件名生成 slug
      const slug = fileName.replace('.md', '');
      console.warn(`[loadPosts] 无法解析 ${fileName} 的 frontmatter，使用默认值。内容长度: ${rawContent.length}`);
      // 尝试从文件名提取标题（处理空格和特殊字符）
      const title = slug.replace(/\s+/g, ' ').trim();
      return {
        slug,
        title,
        date: 'Unknown',
        category: 'Uncategorized',
        tags: [],
        content: rawContent
      };
    }

    const yamlBlock = match[1];
    let content = match[2] || '';
    // 移除开头的空行和空白字符
    content = content.replace(/^\s+/, '').trim();
    
    // 调试信息
    if (!content) {
      console.warn(`[loadPosts] ${fileName} 的内容为空，原始内容长度: ${rawContent.length}, yamlBlock长度: ${yamlBlock.length}`);
    }
    
    // 简单的 YAML 解析器 (手动实现，为了不依赖第三方库)
    const metadata = {};
    // 清理 yamlBlock：移除开头和结尾的空行
    const cleanedYaml = yamlBlock.trim();
    
    cleanedYaml.split('\n').forEach(line => {
      // 跳过空行
      if (!line.trim()) return;
      
      const match = line.match(/^(\w+):\s*(.+)$/);
      if (match) {
        let value = match[2].trim();
        // 去除引号
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        // 处理数组格式（如 tags: ["tag1", "tag2"]）
        if (value.startsWith('[') && value.endsWith(']')) {
          try {
            // 移除方括号，分割并清理每个元素
            const arrayContent = value.slice(1, -1);
            value = arrayContent
              .split(',')
              .map(item => {
                item = item.trim();
                // 移除引号
                if ((item.startsWith('"') && item.endsWith('"')) || 
                    (item.startsWith("'") && item.endsWith("'"))) {
                  return item.slice(1, -1);
                }
                return item;
              })
              .filter(item => item.length > 0);
          } catch (e) {
            // 如果解析失败，保持原值
            console.warn(`[loadPosts] Failed to parse array in ${fileName}:`, value);
          }
        }
        // 处理布尔值
        if (value === 'true') value = true;
        if (value === 'false') value = false;
        
        metadata[match[1]] = value;
      }
    });

    // 生成 Slug (移除 .md 后缀)
    const slug = fileName.replace('.md', '');

    // 处理图片路径：如果 image 字段存在且不是完整 URL，则从 public/images 读取
    if (metadata.image) {
      if (metadata.image.startsWith('http://') || metadata.image.startsWith('https://')) {
        // 完整 URL，保持不变
      } else if (metadata.image.startsWith('/images/')) {
        // 已经是正确的路径，保持不变
      } else if (metadata.image.startsWith('/')) {
        // 以 / 开头但不是 /images/，保持不变（可能是其他路径）
      } else {
        // 相对路径或文件名，转换为 /images/ 路径
        metadata.image = `/images/${metadata.image.replace(/^\.\.?\//, '')}`;
      }
    }

    return {
      slug,
      ...metadata,
      content,
      // 确保 tags 是数组格式
      tags: Array.isArray(metadata.tags) ? metadata.tags : (metadata.tags ? [metadata.tags] : [])
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
    // 在开发模式下，每次重新加载以支持热更新
    if (_postCache && import.meta.env.PROD) {
      return _postCache;
    }

    // 调试：检查加载的文件
    const filePaths = Object.keys(markdownFiles);
    console.log(`[loadPosts] 找到 ${filePaths.length} 个 Markdown 文件:`, filePaths);

    // 遍历 glob 导入的结果
    const posts = filePaths.map((path) => {
      const fileName = path.split('/').pop(); // 从路径 ../posts/abc.md 获取 abc.md
      const rawContent = markdownFiles[path];
      
      if (!rawContent) {
        console.warn(`[loadPosts] ${fileName} 的内容为空`);
        return null;
      }
      
      // 调用解析器
      const post = parseFrontmatter(fileName, rawContent);
      if (post) {
        console.log(`[loadPosts] 成功解析: ${fileName}`, {
          title: post.title,
          contentLength: post.content?.length || 0,
          hasContent: !!post.content
        });
      } else {
        console.error(`[loadPosts] 解析失败: ${fileName}`);
      }
      return post;
    }).filter(post => post !== null); // 过滤掉解析失败的

    console.log(`[loadPosts] 成功加载 ${posts.length} 篇文章`);

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
  },

  /**
   * 清除缓存，强制重新加载文章
   */
  clearCache: () => {
    _postCache = null;
  }
};
