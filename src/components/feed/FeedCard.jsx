/**
 * RSS 资讯卡片组件
 */
import React from 'react';
import { ExternalLink, Clock } from 'lucide-react';

export default function FeedCard({ item }) {
  const {
    title_zh,
    title_en,
    summary_zh,
    keywords_zh = [],
    source,
    pubDate,
    link,
  } = item;

  // 格式化时间
  const formatTime = (dateStr) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now - date;
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffHours < 1) return '刚刚';
      if (diffHours < 24) return `${diffHours} 小时前`;
      if (diffDays < 7) return `${diffDays} 天前`;
      return date.toLocaleDateString('zh-CN');
    } catch {
      return '';
    }
  };

  return (
    <article className="group relative flex items-start gap-6 p-6 border-b border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all">
      {/* 左侧：来源和时间 */}
      <div className="flex-shrink-0 w-32 text-right">
        <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1">
          {source}
        </div>
        <div className="flex items-center justify-end gap-1 text-xs text-slate-500 dark:text-slate-400">
          <Clock size={12} />
          {formatTime(pubDate)}
        </div>
      </div>

      {/* 中间：内容 */}
      <div className="flex-1 min-w-0">
        {/* 标题 */}
        <h3 className="text-xl font-serif font-semibold text-slate-800 dark:text-slate-200 mb-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-all duration-300 group-hover:translate-x-1">
          {title_zh || title_en}
        </h3>

        {/* 摘要 */}
        {summary_zh && (
          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
            {summary_zh}
          </p>
        )}

        {/* 关键词 */}
        {keywords_zh.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {keywords_zh.slice(0, 5).map((keyword, index) => (
              <span
                key={index}
                className="inline-block px-2 py-0.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-full"
              >
                #{keyword}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 右侧：链接按钮 */}
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 p-2 rounded-lg text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all opacity-0 group-hover:opacity-100"
        title="查看原文"
      >
        <ExternalLink size={20} />
      </a>
    </article>
  );
}
