// scripts/generate-rss.mjs
import RSS from 'rss';
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import frontMatter from 'front-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 配置
const CONFIG = {
  title: 'L.E.A.P. - Exploring the World',
  description: 'Decoding the world through Language, Engineering, Algorithms, and Physics.',
  site_url: 'https://yourdomain.com', // 修改为你的实际域名
  language: 'zh-CN',
  feed_url: '/rss.xml',
};

// 读取并解析所有文章
function loadPosts() {
  const postsDir = join(__dirname, '../src/posts');
  const files = readdirSync(postsDir).filter(f => f.endsWith('.md'));

  const posts = files.map(file => {
    const content = readFileSync(join(postsDir, file), 'utf-8');
    const parsed = frontMatter(content);

    return {
      slug: file.replace('.md', ''),
      ...parsed.attributes,
      content: parsed.body,
    };
  });

  // 按日期排序
  return posts.sort((a, b) => {
    const dateA = new Date(a.date || '1970-01-01');
    const dateB = new Date(b.date || '1970-01-01');
    return dateB - dateA;
  });
}

// 生成 RSS
function generateRSS() {
  const posts = loadPosts();

  const feed = new RSS({
    title: CONFIG.title,
    description: CONFIG.description,
    feed_url: CONFIG.site_url + CONFIG.feed_url,
    site_url: CONFIG.site_url,
    language: CONFIG.language,
    copyright: `Copyright ${new Date().getFullYear()}`,
    pubDate: new Date(),
    ttl: 60,
  });

  posts.forEach((post) => {
    const excerpt = post.content?.substring(0, 200).replace(/[#*`]/g, '') + '...';

    feed.item({
      title: post.title || post.slug,
      description: post.excerpt || excerpt,
      url: `${CONFIG.site_url}/post/${post.slug}`,
      date: post.date || new Date(),
      categories: [post.category || 'Uncategorized'],
      author: post.author || 'L.E.A.P.',
    });
  });

  return feed.xml();
}

// 主函数
async function main() {
  console.log('Generating RSS feed...');

  const xml = generateRSS();
  const outputPath = join(__dirname, '../public/rss.xml');

  writeFileSync(outputPath, xml, 'utf-8');
  console.log(`✅ RSS feed generated: ${outputPath}`);
}

main().catch(console.error);
