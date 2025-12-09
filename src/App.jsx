// src/App.jsx
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PostListItem from './components/PostListItem';
import LoadingSkeleton from './components/LoadingSkeleton';
import PostPage from './pages/Post';
import About from './pages/About';
import { loadPosts } from './lib/loadPosts';
import { fixedCategories } from './lib/categoryMapping';

export default function App() {
  const [view, setView] = useState('home');
  const [posts, setPosts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        setError(null);
        const loaded = await loadPosts.getAll();
        console.log(`[App] 成功加载 ${loaded.length} 篇文章:`, loaded.map(p => ({ title: p.title, slug: p.slug, hasContent: !!p.content })));
        setPosts(loaded);
      } catch (err) {
        console.error('[App] Failed to load posts:', err);
        setError(err.message || 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const openPost = (post) => {
    setSelected(post);
    setView('post');
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setView('home');
    setSelected(null);
    window.scrollTo(0, 0);
  };

  // 根据选中的分类过滤文章
  const filteredPosts = selectedCategory
    ? posts.filter(post => post.category === selectedCategory)
    : posts;

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-800 selection:bg-emerald-100">
      <Header setView={setView} activeView={view} onBack={handleBack} />

      {view === 'home' && (
        <main className="pt-24 pb-20">
          <div className="max-w-4xl mx-auto px-6">
            {/* Hero 区域 */}
            <section className="mb-16">
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-slate-800 leading-tight mb-8">
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
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-emerald-300'
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
                  <p className="text-red-600 mb-4">Error: {error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              )}

              {!loading && !error && posts.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                  <p>No posts found.</p>
                </div>
              )}

              {!loading && !error && posts.length > 0 && (
                <>
                  {filteredPosts.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center text-slate-500">
                      <p>没有找到分类为 "{selectedCategory}" 的文章</p>
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className="mt-4 px-4 py-2 text-sm text-emerald-600 hover:text-emerald-700 underline"
                      >
                        查看所有文章
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                      {filteredPosts.map((post) => (
                        <PostListItem
                          key={post.slug}
                          post={post}
                          onClick={() => openPost(post)}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </section>
          </div>
        </main>
      )}

      {view === 'post' && selected && (
        <PostPage post={selected} onBack={handleBack} />
      )}

      {view === 'about' && <About onBack={handleBack} />}
    </div>
  );
}
