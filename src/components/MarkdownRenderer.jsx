import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math'; // 1. 新增引入：解析数学符号 ($)
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github-dark.css';

export default function MarkdownRenderer({ content, postTitle }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [images, setImages] = useState([]);

  // 提取所有图片用于灯箱
  const imageNodes = useMemo(() => {
    const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const matches = [];
    let match;
    while ((match = imgRegex.exec(content)) !== null) {
      matches.push({
        src: match[2],
        alt: match[1] || '',
      });
    }
    return matches;
  }, [content]);

  const handleImageClick = (src, index) => {
    setImages(imageNodes.map(img => ({ src: img.src })));
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <div className="prose prose-lg prose-emerald dark:prose-invert max-w-none font-sans 
        prose-headings:font-serif 
        prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:leading-relaxed 
        prose-a:text-emerald-600 dark:prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline 
        prose-strong:text-slate-800 dark:prose-strong:text-slate-200 
        prose-code:text-emerald-700 dark:prose-code:text-emerald-400 prose-code:bg-emerald-50 dark:prose-code:bg-emerald-900/30 prose-code:px-1 prose-code:rounded 
        prose-pre:bg-slate-900 dark:prose-pre:bg-slate-950 prose-pre:text-slate-100 
        prose-img:rounded-lg prose-img:shadow-lg prose-img:cursor-pointer
        prose-table:text-slate-700 dark:prose-table:text-slate-300
        prose-th:bg-slate-100 dark:prose-th:bg-slate-800 prose-th:text-slate-800 dark:prose-th:text-slate-200
        prose-td:border-slate-200 dark:prose-td:border-slate-700">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]} // 2. 修改此处：添加 remarkMath
          rehypePlugins={[rehypeKatex, rehypeHighlight]}
          components={{
            h1: ({ node, children, ...props }) => {
              // 如果 h1 的内容与文章标题相同，则隐藏它（避免重复显示标题）
              const h1Text = Array.isArray(children)
                ? children.filter(c => typeof c === 'string').join('').trim()
                : (typeof children === 'string' ? children.trim() : '');

              if (h1Text && h1Text === postTitle?.trim()) {
                return null;
              }
              return <h1 className="font-serif text-slate-800 dark:text-slate-200" {...props}>{children}</h1>;
            },
            h2: ({ node, ...props }) => <h2 className="font-serif text-slate-800 dark:text-slate-200" {...props} />,
            h3: ({ node, ...props }) => <h3 className="font-serif text-slate-800 dark:text-slate-200" {...props} />,
            h4: ({ node, ...props }) => <h4 className="font-serif text-slate-800 dark:text-slate-200" {...props} />,
            p: ({ node, ...props }) => <p className="text-slate-700 dark:text-slate-300 leading-relaxed" {...props} />,
            a: ({ node, ...props }) => <a className="text-emerald-600 dark:text-emerald-400 no-underline hover:underline" {...props} />,
            strong: ({ node, ...props }) => <strong className="text-slate-800 dark:text-slate-200" {...props} />,
            code: ({ node, inline, className, children, ...props }) => {
              if (inline) {
                return (
                  <code className="text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-1 rounded" {...props}>
                    {children}
                  </code>
                );
              }
              return <code className={className} {...props}>{children}</code>;
            },
            pre: ({ node, ...props }) => <pre className="bg-slate-900 dark:bg-slate-950 text-slate-100" {...props} />,
            img: ({ node, src, alt, ...props }) => {
              const imageIndex = imageNodes.findIndex(img => img.src === src);
              return (
                <img
                  src={src}
                  alt={alt}
                  className="rounded-lg shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => handleImageClick(src, imageIndex >= 0 ? imageIndex : 0)}
                  {...props}
                />
              );
            },
            table: ({ node, ...props }) => (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700" {...props} />
              </div>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={images}
      />
    </>
  );
}