// src/components/PostListItem.jsx
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCategoryLabel } from '../lib/categoryMapping';

export default function PostListItem({ post }) {
  // 解析日期
  const parseDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      const day = date.getDate();
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      const year = date.getFullYear();
      return { day, month, year };
    } catch {
      return { day: '--', month: '---', year: '----' };
    }
  };

  const { day, month, year } = parseDate(post.date);

  return (
    <Link
      to={`/post/${post.slug}`}
      className="group block"
    >
      <article
        className="relative flex items-start gap-6 p-6 border-b border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all cursor-pointer"
      >
      {/* 左侧：日期 */}
      <div className="flex-shrink-0 w-20 text-right">
        <div className="text-3xl font-serif font-bold text-slate-700 dark:text-slate-300 leading-none">
          {day}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {month} {year}
        </div>
      </div>

      {/* 中间：标题、摘要、分类标签 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-xl font-serif font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-all duration-300 group-hover:translate-x-1 group-hover:scale-[1.02] cursor-pointer">
            {post.title}
          </h2>
          {post.category && (
            <span className="inline-block px-2 py-0.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-full flex-shrink-0">
              {getCategoryLabel(post.category)}
            </span>
          )}
        </div>
        {post.summary && (
          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
            {post.summary}
          </p>
        )}
      </div>

      {/* 右侧：缩略图 */}
      {post.image && (
        <div className="flex-shrink-0 w-32 h-24 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

        {/* 悬停时显示的箭头 - 显示在中间区域右侧 */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ right: post.image ? 'calc(8rem + 1.5rem)' : '1.5rem' }}>
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
            <span>Read Article</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </article>
    </Link>
  );
}

