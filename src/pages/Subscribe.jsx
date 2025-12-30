// src/pages/Subscribe.jsx
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Rss, Copy, Check, BookOpen, Zap, Bell } from 'lucide-react';

export default function Subscribe() {
  const [copied, setCopied] = useState(false);
  const rssUrl = `${window.location.origin}/rss.xml`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(rssUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const readers = [
    {
      name: 'Feedly',
      url: 'https://feedly.com',
      description: '最受欢迎的 RSS 阅读器，支持多平台',
      icon: '🟢'
    },
    {
      name: 'Inoreader',
      url: 'https://www.inoreader.com',
      description: '功能强大的专业 RSS 阅读器',
      icon: '🔵'
    },
    {
      name: 'FreshRSS',
      url: 'https://freshrss.org',
      description: '开源自托管 RSS 阅读器',
      icon: '🟠'
    },
    {
      name: 'NetNewsWire',
      url: 'https://netnewswire.com',
      description: 'macOS/iOS 原生 RSS 阅读器',
      icon: '🍎'
    }
  ];

  return (
    <>
      <Helmet>
        <title>订阅 RSS - L.E.A.P.</title>
        <meta name="description" content="订阅 L.E.A.P. 博客的 RSS Feed，获取最新文章推送" />
      </Helmet>

      <main className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          {/* 标题区域 */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mb-6">
              <Rss size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-800 dark:text-slate-200 mb-4">
              订阅 RSS
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              永不错过任何新文章
            </p>
          </div>

          {/* 什么是 RSS */}
          <section className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-8 mb-8">
            <h2 className="text-2xl font-serif font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-3">
              <BookOpen className="text-emerald-600 dark:text-emerald-400" size={24} />
              什么是 RSS？
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-slate-400">
              <p className="mb-4">
                RSS（Really Simple Syndication）是一种让你在一个地方订阅所有喜欢网站的内容更新方式。
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Zap className="text-emerald-600 dark:text-emerald-400 mt-1 flex-shrink-0" size={16} />
                  <span><strong>即时更新</strong> - 新文章发布后立即推送给你</span>
                </li>
                <li className="flex items-start gap-2">
                  <Bell className="text-emerald-600 dark:text-emerald-400 mt-1 flex-shrink-0" size={16} />
                  <span><strong>隐私保护</strong> - 不需要提供邮箱，完全匿名订阅</span>
                </li>
                <li className="flex items-start gap-2">
                  <Rss className="text-emerald-600 dark:text-emerald-400 mt-1 flex-shrink-0" size={16} />
                  <span><strong>统一管理</strong> - 在一个阅读器中管理所有订阅</span>
                </li>
              </ul>
            </div>
          </section>

          {/* 订阅方式 */}
          <section className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-8 mb-8">
            <h2 className="text-2xl font-serif font-bold text-slate-800 dark:text-slate-200 mb-6">
              如何订阅？
            </h2>

            {/* 方法 1: 复制链接 */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-3">
                方法 1: 复制 RSS 链接
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={rssUrl}
                  className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-mono text-sm"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check size={18} />
                      已复制
                    </>
                  ) : (
                    <>
                      <Copy size={18} />
                      复制链接
                    </>
                  )}
                </button>
              </div>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                复制后粘贴到你的 RSS 阅读器中
              </p>
            </div>

            {/* 方法 2: 选择阅读器 */}
            <div>
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4">
                方法 2: 选择一个 RSS 阅读器
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {readers.map((reader) => (
                  <a
                    key={reader.name}
                    href={reader.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{reader.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {reader.name}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          {reader.description}
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* 快速订阅按钮 */}
          <section className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800 p-8 text-center">
            <h2 className="text-2xl font-serif font-bold text-slate-800 dark:text-slate-200 mb-4">
              还没有 RSS 阅读器？
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              选择上面的任意一个阅读器，或者直接复制 RSS 链接开始使用
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={copyToClipboard}
                className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? '已复制 RSS 链接' : '复制 RSS 链接'}
              </button>
              <a
                href="/rss.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors flex items-center justify-center gap-2"
              >
                <Rss size={18} />
                查看 RSS 源文件
              </a>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
