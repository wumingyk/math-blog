// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header';
import Home from './pages/Home';
import PostRoute from './pages/PostRoute';
import About from './pages/About';
import Subscribe from './pages/Subscribe';

export default function App() {
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

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-[#FAFAF9] dark:bg-slate-950 text-slate-800 dark:text-slate-200 selection:bg-emerald-100 dark:selection:bg-emerald-900 transition-colors">
        <Header theme={theme} toggleTheme={toggleTheme} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:slug" element={<PostRoute />} />
          <Route path="/about" element={<About />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </HelmetProvider>
  );
}
