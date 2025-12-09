// src/pages/Post.jsx
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getCategoryLabel } from '../lib/categoryMapping';

export default function Post({ post, onBack }) {
  // 调试：检查 post 数据
  if (!post) {
    return (
      <article className="min-h-screen bg-[#FAFAF9] text-slate-800">
        <div className="max-w-5xl mx-auto px-6 pt-24 pb-8">
          <p className="text-red-600">文章数据不存在</p>
          <button onClick={onBack} className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg">
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
    <article className="min-h-screen bg-[#FAFAF9] text-slate-800">
      {/* 返回按钮 */}
      <div className="max-w-5xl mx-auto px-6 pt-24 pb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors mb-8 group"
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
        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-slate-600">
          {post.category && (
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full font-medium">
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
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-800 mb-8 leading-tight">
          {post.title}
        </h1>

        {/* 摘要 */}
        {post.summary && (
          <p className="text-xl text-slate-600 mb-12 font-sans leading-relaxed">
            {post.summary}
          </p>
        )}

        {/* 正文内容 */}
        <div className="prose prose-lg prose-emerald max-w-none font-sans prose-headings:font-serif prose-p:text-slate-700 prose-p:leading-relaxed prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-800 prose-code:text-emerald-700 prose-code:bg-emerald-50 prose-code:px-1 prose-code:rounded prose-pre:bg-slate-900 prose-pre:text-slate-100">
          {post.content ? (
            <ReactMarkdown
              components={{
                h1: ({node, children, ...props}) => {
                  // 如果 h1 的内容与文章标题相同，则隐藏它（避免重复显示标题）
                  // react-markdown 的 children 通常是字符串或字符串数组
                  const h1Text = Array.isArray(children) 
                    ? children.filter(c => typeof c === 'string').join('').trim()
                    : (typeof children === 'string' ? children.trim() : '');
                  
                  if (h1Text && h1Text === post.title?.trim()) {
                    return null; // 隐藏重复的标题
                  }
                  return <h1 className="font-serif" {...props}>{children}</h1>;
                },
                h2: ({node, ...props}) => <h2 className="font-serif" {...props} />,
                h3: ({node, ...props}) => <h3 className="font-serif" {...props} />,
                h4: ({node, ...props}) => <h4 className="font-serif" {...props} />,
                p: ({node, ...props}) => <p className="text-slate-700 leading-relaxed" {...props} />,
                a: ({node, ...props}) => <a className="text-emerald-600 no-underline hover:underline" {...props} />,
                strong: ({node, ...props}) => <strong className="text-slate-800" {...props} />,
                code: ({node, inline, ...props}) => 
                  inline ? (
                    <code className="text-emerald-700 bg-emerald-50 px-1 rounded" {...props} />
                  ) : (
                    <code {...props} />
                  ),
                pre: ({node, ...props}) => <pre className="bg-slate-900 text-slate-100" {...props} />,
              }}
            >
              {post.content}
            </ReactMarkdown>
          ) : (
            <div className="text-slate-500 italic">
              <p>文章内容为空</p>
              {process.env.NODE_ENV === 'development' && (
                <pre className="mt-4 text-xs bg-slate-100 p-4 rounded overflow-auto">
                  {JSON.stringify(post, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
