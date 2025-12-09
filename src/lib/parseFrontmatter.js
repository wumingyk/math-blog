export const parseFrontmatter = (fileName, rawContent) => {
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
            console.warn('Failed to parse array:', value);
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

    return {
      slug,
      ...metadata,
      content
    };
  } catch (e) {
    console.error(`Error parsing ${fileName}:`, e);
    return null;
  }
};