// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import PostListItem from '../components/PostListItem';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { loadPosts } from '../lib/loadPosts';
import { fixedCategories } from '../lib/categoryMapping';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        setError(null);
        const loaded = await loadPosts.getAll();
        setPosts(loaded);
      } catch (err) {
        console.error('Failed to load posts:', err);
        setError(err.message || 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // 根据选中的分类过滤文章
  const filteredPosts = selectedCategory
    ? posts.filter(post => post.category === selectedCategory)
    : posts;

  return (
    <>
      <Helmet>
        <title>L.E.A.P. - Exploring the World</title>
        <meta name="description" content="Decoding the world through Language, Engineering, Algorithms, and Physics." />
      </Helmet>
      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          {/* Hero 区域 */}
          <section className="mb-16">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-slate-800 dark:text-slate-200 leading-tight mb-8">
              Exploring the World
            </h1>
            
            {/* 分类筛选 */}
            {!loading && !error && posts.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 mb-8">
                {fixedCategories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                      selectedCategory === category
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* 文章列表 */}
          <section>
            {loading && <LoadingSkeleton />}
            
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

            {!loading && !error && posts.length === 0 && (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                <p>No posts found.</p>
              </div>
            )}

            {!loading && !error && posts.length > 0 && (
              <>
                {filteredPosts.length === 0 ? (
                  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center text-slate-500 dark:text-slate-400">
                    <p>没有找到分类为 "{selectedCategory}" 的文章</p>
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="mt-4 px-4 py-2 text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline"
                    >
                      查看所有文章
                    </button>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    {filteredPosts.map((post) => (
                      <PostListItem
                        key={post.slug}
                        post={post}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
