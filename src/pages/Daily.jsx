// src/pages/Daily.jsx
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { loadDigestPosts } from '../lib/loadDigest';

export default function Daily() {
  const [digests, setDigests] = useState([]);
  const [selectedDigest, setSelectedDigest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        setError(null);
        const loaded = await loadDigestPosts.getAll();
        setDigests(loaded);

        // 自动选中最新的
        if (loaded.length > 0) {
          setSelectedDigest(loaded[0]);
        }
      } catch (err) {
        console.error('Failed to load digest:', err);
        setError(err.message || 'Failed to load digest');
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  return (
    <>
      <Helmet>
        <title>每日资讯 - L.E.A.P.</title>
        <meta name="description" content="AI 驱动的每日资讯聚合，精选自 X、微博、B站" />
      </Helmet>

      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <section className="mb-12">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-slate-800 dark:text-slate-200 leading-tight mb-4">
              每日资讯
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              由 AI 自动聚合的精选资讯，来自 B站、微博、X 等平台
            </p>
          </section>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-8 text-center">
              <p className="text-red-600 dark:text-red-400 mb-4">Error: {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && digests.length === 0 && (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400">
              <p className="text-lg mb-4">暂无每日资讯</p>
              <p className="text-sm">资讯将在每天自动生成，敬请期待...</p>
            </div>
          )}

          {/* Content */}
          {!loading && !error && digests.length > 0 && (
            <div className="space-y-8">
              {/* Date Selector */}
              <div className="flex flex-wrap gap-3">
                {digests.map((digest) => (
                  <button
                    key={digest.slug}
                    onClick={() => setSelectedDigest(digest)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                      selectedDigest?.slug === digest.slug
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600'
                    }`}
                  >
                    {formatDate(digest.date)}
                  </button>
                ))}
              </div>

              {/* Digest Content */}
              {selectedDigest && (
                <article className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                  {/* Digest Header */}
                  <header className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3">
                      {selectedDigest.title}
                    </h2>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        📅 {formatDate(selectedDigest.date)}
                      </span>
                      {selectedDigest.stats?.totalItems && (
                        <span className="flex items-center gap-1">
                          📊 {selectedDigest.stats.totalItems} 条
                        </span>
                      )}
                      {selectedDigest.stats?.sources && (
                        <span className="flex items-center gap-1">
                          🔗 {selectedDigest.stats.sources.join(', ')}
                        </span>
                      )}
                    </div>

                    {/* Tags */}
                    {selectedDigest.tags && selectedDigest.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {selectedDigest.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </header>

                  {/* Digest Body */}
                  <div className="p-6">
                    <MarkdownRenderer content={selectedDigest.content} />
                  </div>
                </article>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

/**
 * 格式化日期
 * @param {string} dateStr - 日期字符串
 * @returns {string} 格式化后的日期
 */
function formatDate(dateStr) {
  try {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // 判断是今天、昨天还是其他日期
    if (date.toDateString() === today.toDateString()) {
      return '今天';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return '昨天';
    } else {
      // 格式化为 MM月DD日
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    }
  } catch (error) {
    return dateStr;
  }
}
