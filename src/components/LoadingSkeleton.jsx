// src/components/LoadingSkeleton.jsx
import React from 'react';

export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Hero 骨架 */}
      <div className="mb-16">
        <div className="h-12 w-64 bg-slate-200 rounded mb-4"></div>
      </div>

      {/* 文章列表骨架 */}
      <div className="space-y-0">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex items-start gap-6 p-6 border-b border-slate-200/50"
          >
            {/* 日期骨架 */}
            <div className="flex-shrink-0 w-20">
              <div className="h-8 w-12 bg-slate-200 rounded mb-2"></div>
              <div className="h-4 w-16 bg-slate-200 rounded"></div>
            </div>

            {/* 内容骨架 */}
            <div className="flex-1 min-w-0">
              <div className="h-6 w-3/4 bg-slate-200 rounded mb-3"></div>
              <div className="h-4 w-full bg-slate-200 rounded mb-2"></div>
              <div className="h-4 w-5/6 bg-slate-200 rounded mb-3"></div>
              <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
            </div>

            {/* 图片骨架 */}
            <div className="flex-shrink-0 w-32 h-24 bg-slate-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

