/**
 * RSS 资讯页面
 */
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Rss, Clock } from 'lucide-react';
import FeedCard from '../components/feed/FeedCard';
import { loadFeed } from '../lib/loadFeed';

export default function Feed() {
  const [items, setItems] = useState([]);
  const [metadata, setMetadata] = useState({ updated_at: null, total_items: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSource, setSelectedSource] = useState(null);

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        setError(null);

        const [feedItems, feedMetadata] = await Promise.all([
          loadFeed.getAll(),
          loadFeed.getMetadata(),
        ]);

        setItems(feedItems);
        setMetadata(feedMetadata);
      } catch (err) {
        console.error('Failed to load feed:', err);
        setError(err.message || 'Failed to load feed');
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // 获取所有来源
  const sources = [...new Set(items.map(item => item.source))];

  // 筛选
  const filteredItems = selectedSource
    ? items.filter(item => item.source === selectedSource)
    : items;

  // 格式化更新时间
  const formatUpdateTime = (dateStr) => {
    if (!dateStr) return '未知';
    try {
      return new Date(dateStr).toLocaleString('zh-CN');
    } catch {
      return '未知';
    }
  };

  return (
    <>
      <Helmet>
        <title>科技资讯 - L.E.A.P.</title>
        <meta name="description" content="英文科技资讯聚合，来自 TechCrunch, Hacker News, MIT Tech Review 等高质量源" />
      </Helmet>

      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                <Rss size={24} />
              </div>
              <h1 className="text-5xl font-serif font-bold text-slate-800 dark:text-slate-200">
                科技资讯
              </h1>
            </div>

            <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
              来自顶级科技媒体的最新资讯，AI 翻译成中文
            </p>

            {/* 元数据 */}
            {metadata.updated_at && (
              <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  更新于 {formatUpdateTime(metadata.updated_at)}
                </span>
                <span>•</span>
                <span>{metadata.total_items} 篇文章</span>
              </div>
            )}
          </section>

          {/* 来源筛选 */}
          {!loading && !error && sources.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <button
                onClick={() => setSelectedSource(null)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                  !selectedSource
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                全部
              </button>
              {sources.map(source => (
                <button
                  key={source}
                  onClick={() => setSelectedSource(selectedSource === source ? null : source)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                    selectedSource === source
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  {source}
                </button>
              ))}
            </div>
          )}

          {/* 内容 */}
          <div>
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
              </div>
            )}

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

            {!loading && !error && items.length === 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center text-slate-500 dark:text-slate-400">
                <p className="text-lg mb-2">暂无资讯</p>
                <p className="text-sm">请运行脚本生成资讯数据</p>
              </div>
            )}

            {!loading && !error && filteredItems.length === 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center text-slate-500 dark:text-slate-400">
                <p>没有找到来自 "{selectedSource}" 的资讯</p>
              </div>
            )}

            {!loading && !error && filteredItems.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                {filteredItems.map(item => (
                  <FeedCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
