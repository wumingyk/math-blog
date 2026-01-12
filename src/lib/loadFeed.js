/**
 * RSS 数据加载器
 */
export const loadFeed = {
  /**
   * 获取所有资讯
   */
  getAll: async () => {
    try {
      const response = await fetch('/src/data/rss-feed.json');
      if (!response.ok) {
        throw new Error('Failed to load feed data');
      }
      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Failed to load feed:', error);
      return [];
    }
  },

  /**
   * 获取元数据
   */
  getMetadata: async () => {
    try {
      const response = await fetch('/src/data/rss-feed.json');
      if (!response.ok) {
        throw new Error('Failed to load feed data');
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to load feed metadata:', error);
      return { updated_at: null, total_items: 0 };
    }
  },

  /**
   * 按来源筛选
   */
  getBySource: async (source) => {
    const items = await loadFeed.getAll();
    return items.filter(item => item.source === source);
  },

  /**
   * 按分类筛选
   */
  getByCategory: async (category) => {
    const items = await loadFeed.getAll();
    return items.filter(item => item.category === category);
  },
};

export default loadFeed;
