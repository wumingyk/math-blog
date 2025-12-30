// src/lib/generateRSS.js
import RSS from 'rss';
import { loadPosts } from './loadPosts';

/**
 * 生成 RSS Feed
 * @returns {string} XML 格式的 RSS Feed
 */
export async function generateRSS() {
  const posts = await loadPosts.getAll();

  // 创建 RSS Feed 实例
  const feed = new RSS({
    title: 'L.E.A.P. - Exploring the World',
    description: 'Decoding the world through Language, Engineering, Algorithms, and Physics.',
    feed_url: `${window.location.origin}/rss.xml`,
    site_url: window.location.origin,
    image_url: `${window.location.origin}/logo.png`,
    language: 'zh-CN',
    copyright: `Copyright ${new Date().getFullYear()}`,
    pubDate: new Date(),
    ttl: 60, // 缓存时间（分钟）
  });

  // 添加文章到 Feed
  posts.forEach((post) => {
    feed.item({
      title: post.title || post.slug,
      description: post.excerpt || post.content?.substring(0, 200) + '...',
      url: `${window.location.origin}/post/${post.slug}`,
      date: post.date || new Date(),
      categories: [post.category || 'Uncategorized'],
      author: post.author || 'L.E.A.P.',
    });
  });

  return feed.xml();
}
