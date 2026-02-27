// src/pages/Post.jsx
import React, { lazy, Suspense } from 'react';
import { ArrowLeft, ArrowUp, List } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import AudioPlayer from '../components/AudioPlayer';
import { getCategoryLabel } from '../lib/categoryMapping';

const MarkdownRendererLazy = lazy(() => import('../components/MarkdownRenderer'));

function slugifyHeading(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\u4e00-\u9fa5\s-]/g, '')
    .replace(/\s+/g, '-');
}

function stripMarkdownInline(text) {
  return text
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_~>#]/g, '')
    .trim();
}

function extractHeadings(content = '') {
  const lines = content.split('\n');
  const list = [];
  const slugCount = new Map();
  let inFence = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line.startsWith('```')) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = line.match(/^(##|###)\s+(.+)$/);
    if (!match) continue;

    const level = match[1].length;
    const title = stripMarkdownInline(match[2]);
    if (!title) continue;

    const baseSlug = slugifyHeading(title);
    const count = slugCount.get(baseSlug) || 0;
    slugCount.set(baseSlug, count + 1);
    const id = count > 0 ? `${baseSlug}-${count + 1}` : baseSlug;

    list.push({ id, title, level });
  }

  return list;
}

export default function Post({ post, onBack }) {
  const [scrollProgress, setScrollProgress] = React.useState(0);
  const [showBackToTop, setShowBackToTop] = React.useState(false);
  const [tocOpen, setTocOpen] = React.useState(false);
  const [activeHeading, setActiveHeading] = React.useState('');
  const headings = React.useMemo(() => extractHeadings(post?.content || ''), [post?.content]);

  React.useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
      setScrollProgress(progress);
      setShowBackToTop(scrollTop > 480);

      if (headings.length > 0) {
        let current = headings[0].id;
        for (const heading of headings) {
          const el = document.getElementById(heading.id);
          if (el && el.getBoundingClientRect().top <= 140) {
            current = heading.id;
          }
        }
        setActiveHeading(current);
      }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [headings]);

  React.useEffect(() => {
    if (!tocOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [tocOpen]);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const jumpToHeading = (id) => {
    const element = document.getElementById(id);
    if (!element) return;
    const y = element.getBoundingClientRect().top + window.scrollY - 84;
    window.scrollTo({ top: y, behavior: 'smooth' });
    setTocOpen(false);
  };

  // 调试：检查 post 数据
  if (!post) {
    return (
      <article className="min-h-screen bg-[#FAFAF9] dark:bg-slate-950 text-slate-800 dark:text-slate-200">
        <div className="max-w-5xl mx-auto px-6 pt-24 pb-8">
          <p className="text-red-600 dark:text-red-400">文章数据不存在</p>
          <button onClick={onBack} className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
            返回首页
          </button>
        </div>
      </article>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} - L.E.A.P.</title>
        <meta name="description" content={post.summary || post.title} />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Helmet>
      <div
        className="fixed top-0 left-0 h-1 bg-emerald-500/90 z-[60] transition-[width] duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
      <article className="min-h-screen bg-[#FAFAF9] dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors">
        {/* 返回按钮 */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-6 sm:pb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 min-h-11 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors mb-6 sm:mb-8 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Home</span>
          </button>
        </div>

        {/* 封面图 */}
        {post.image && (
          <div className="w-full h-64 sm:h-96 md:h-[500px] relative overflow-hidden mb-8 sm:mb-12">
            <img
              src={post.image}
              alt={post.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* 文章内容 */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-20">
          {/* Category 和 Date */}
          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-slate-600 dark:text-slate-400">
            {post.category && (
              <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full font-medium">
                {getCategoryLabel(post.category)}
              </span>
            )}
            {post.rawCategory && post.rawCategory !== post.category && (
              <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full font-medium">
                {post.rawCategory}
              </span>
            )}
            {post.date && (
              <time className="font-sans">
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            )}
          </div>

          {/* 标题 */}
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-800 dark:text-slate-200 mb-8 leading-tight">
            {post.title}
          </h1>

          {/* 音频播放器 */}
          {post.audio && (
            <AudioPlayer 
              src={post.audio} 
              title="🎧 收听本文（AI 朗读）" 
            />
          )}

          {/* 摘要 */}
          {post.summary && (
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-10 sm:mb-12 font-sans leading-relaxed">
              {post.summary}
            </p>
          )}

          {/* 正文内容 */}
          {post.content ? (
            <Suspense fallback={<p className="text-slate-500 dark:text-slate-400">Loading content...</p>}>
              <MarkdownRendererLazy content={post.content} postTitle={post.title} />
            </Suspense>
          ) : (
            <div className="text-slate-500 dark:text-slate-400 italic">
              <p>文章内容为空</p>
              {import.meta.env.DEV && (
                <pre className="mt-4 text-xs bg-slate-100 dark:bg-slate-800 p-4 rounded overflow-auto">
                  {JSON.stringify(post, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>
      </article>
      {showBackToTop && (
        <button
          onClick={handleBackToTop}
          className="fixed right-4 bottom-6 sm:bottom-8 min-h-11 min-w-11 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg transition-colors z-50 flex items-center justify-center"
          aria-label="Back to top"
        >
          <ArrowUp size={18} />
        </button>
      )}
      {headings.length > 0 && (
        <button
          onClick={() => setTocOpen(true)}
          className="sm:hidden fixed left-4 bottom-6 min-h-11 px-3 rounded-full bg-white/95 dark:bg-slate-800/95 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-lg z-50 flex items-center gap-2"
          aria-label="Open table of contents"
        >
          <List size={18} />
          <span className="text-sm font-medium">目录</span>
        </button>
      )}
      {tocOpen && (
        <div className="sm:hidden fixed inset-0 z-[70]">
          <button
            className="absolute inset-0 bg-black/40"
            onClick={() => setTocOpen(false)}
            aria-label="Close table of contents"
          />
          <div className="absolute left-0 right-0 bottom-0 rounded-t-2xl bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 max-h-[70vh] overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200">目录</h2>
              <button
                onClick={() => setTocOpen(false)}
                className="min-h-11 px-3 text-sm text-slate-600 dark:text-slate-300"
              >
                关闭
              </button>
            </div>
            <div className="space-y-1 pb-3">
              {headings.map((heading) => (
                <button
                  key={heading.id}
                  onClick={() => jumpToHeading(heading.id)}
                  className={`w-full text-left min-h-11 px-3 rounded-lg text-sm transition-colors ${
                    heading.level === 3 ? 'pl-7' : 'pl-3'
                  } ${
                    activeHeading === heading.id
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {heading.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
