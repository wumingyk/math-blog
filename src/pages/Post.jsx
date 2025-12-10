// src/pages/Post.jsx
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { getCategoryLabel } from '../lib/categoryMapping';

export default function Post({ post, onBack }) {
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

  // 调试信息
  if (import.meta.env.DEV) {
    console.log('[Post] 渲染文章:', {
      title: post.title,
      slug: post.slug,
      contentLength: post.content?.length || 0,
      hasContent: !!post.content,
      contentPreview: post.content?.substring(0, 100)
    });
  }

  return (
    <>
      <Helmet>
        <title>{post.title} - L.E.A.P.</title>
        <meta name="description" content={post.summary || post.title} />
      </Helmet>
      <article className="min-h-screen bg-[#FAFAF9] dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors">
        {/* 返回按钮 */}
        <div className="max-w-5xl mx-auto px-6 pt-24 pb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors mb-8 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Home</span>
          </button>
        </div>

        {/* 封面图 */}
        {post.image && (
          <div className="w-full h-96 md:h-[500px] relative overflow-hidden mb-12">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* 文章内容 */}
        <div className="max-w-3xl mx-auto px-6 pb-20">
          {/* Category 和 Date */}
          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-slate-600 dark:text-slate-400">
            {post.category && (
              <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full font-medium">
                {getCategoryLabel(post.category)}
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

          {/* 摘要 */}
          {post.summary && (
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-12 font-sans leading-relaxed">
              {post.summary}
            </p>
          )}

          {/* 正文内容 */}
          {post.content ? (
            <MarkdownRenderer content={post.content} postTitle={post.title} />
          ) : (
            <div className="text-slate-500 dark:text-slate-400 italic">
              <p>文章内容为空</p>
              {process.env.NODE_ENV === 'development' && (
                <pre className="mt-4 text-xs bg-slate-100 dark:bg-slate-800 p-4 rounded overflow-auto">
                  {JSON.stringify(post, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>
      </article>
    </>
  );
}
