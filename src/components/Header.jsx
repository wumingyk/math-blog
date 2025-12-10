// src/components/Header.jsx
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Header({ theme, toggleTheme }) {
  const location = useLocation();
  const navigate = useNavigate();
  const activeView = location.pathname.startsWith('/about') ? 'about' : 'home';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-700/50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title */}
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="px-3 py-1.5 flex items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-serif font-bold text-sm">
              L.E.A.P.
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            <button
              onClick={() => navigate('/')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeView === 'home'
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => navigate('/about')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeView === 'about'
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              About
            </button>
            {/* 主题切换按钮 */}
            <button
              onClick={toggleTheme}
              className="ml-2 p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun size={18} className="text-yellow-500" />
              ) : (
                <Moon size={18} />
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
