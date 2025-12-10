// src/App.jsx
import React, { useState, useEffect } from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
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
  
  // 深色模式状态管理
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  // 深色模式切换函数
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // 应用主题到 DOM
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

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
    <HelmetProvider>
      <Helmet>
        <title>L.E.A.P. - Exploring the World</title>
        <meta name="description" content="Decoding the world through Language, Engineering, Algorithms, and Physics." />
      </Helmet>
      <div className="min-h-screen bg-[#FAFAF9] dark:bg-slate-950 text-slate-800 dark:text-slate-200 selection:bg-emerald-100 dark:selection:bg-emerald-900 transition-colors">
        <Header setView={setView} activeView={view} onBack={handleBack} theme={theme} toggleTheme={toggleTheme} />

      {view === 'home' && (
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
    </HelmetProvider>
  );
}
