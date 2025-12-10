import fs from 'fs';
import path from 'path';

const SITE_URL = process.env.SITE_URL || 'https://leapmath.pages.dev';
const POSTS_DIR = path.resolve('src/posts');
const PUBLIC_DIR = path.resolve('public');
const SITEMAP_PATH = path.join(PUBLIC_DIR, 'sitemap.xml');
const ROBOTS_PATH = path.join(PUBLIC_DIR, 'robots.txt');

function readPosts() {
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
  return files.map(file => {
    const slug = file.replace(/\.md$/, '');
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
    // 粗略解析 frontmatter 的 date 字段
    const match = raw.match(/^---[\s\S]*?^date:\s*["']?(.+?)["']?\s*$/m);
    const date = match ? new Date(match[1]).toISOString() : new Date().toISOString();
    return { slug, lastmod: date };
  });
}

function buildSitemap(urls) {
  const urlset = urls
    .map(
      ({ loc, lastmod }) => `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/about</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>${urlset}
</urlset>`;
}

function buildRobots() {
  return `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
}

function main() {
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR);
  }
  const posts = readPosts();
  const urls = posts.map(({ slug, lastmod }) => ({
    loc: `${SITE_URL}/post/${slug}`,
    lastmod,
  }));

  fs.writeFileSync(SITEMAP_PATH, buildSitemap(urls).trim() + '\n');
  fs.writeFileSync(ROBOTS_PATH, buildRobots());
  console.log(`Sitemap generated: ${SITEMAP_PATH}`);
  console.log(`Robots.txt generated: ${ROBOTS_PATH}`);
}

main();

