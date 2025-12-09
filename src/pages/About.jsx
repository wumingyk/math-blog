// src/pages/About.jsx
import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function About({ onBack }) {
  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-800 pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors mb-12 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>

        <div className="flex flex-col items-center text-center space-y-6">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-slate-800">
            L.E.A.P.
          </h1>
          <p className="max-w-2xl text-lg md:text-xl text-slate-700 leading-relaxed font-serif">
            Decoding the world through Language, Engineering, Algorithms, and Physics.
          </p>
        </div>
      </div>
    </div>
  );
}
