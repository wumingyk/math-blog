// src/components/Header.jsx
import React from 'react';

export default function Header({ setView, activeView, onBack }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-slate-200/50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title */}
          <div
            onClick={() => {
              setView('home');
              if (onBack) onBack();
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="px-3 py-1.5 flex items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 font-serif font-bold text-sm">
              L.E.A.P.
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            <button
              onClick={() => {
                setView('home');
                if (onBack) onBack();
              }}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeView === 'home'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setView('about')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeView === 'about'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              About
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
