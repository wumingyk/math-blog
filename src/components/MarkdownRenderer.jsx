// src/components/MarkdownRenderer.jsx
import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import Lightbox from 'yet-another-react-lightbox';
import AudioPlayer from './AudioPlayer';
import 'yet-another-react-lightbox/styles.css';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github-dark.css';
import { customModules } from './customModules';

export default function MarkdownRenderer({ content, postTitle }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [images, setImages] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const nodeList = el.querySelectorAll('img');
    const slides = Array.from(nodeList).map(img => ({
      src: img.getAttribute('src') || '',
      alt: img.getAttribute('alt') || '',
    }));
    setImages(slides);
  }, [content]);

  const handleImageClick = (src) => {
    const index = images.findIndex(img => img.src === src);
    setLightboxIndex(index >= 0 ? index : 0);
    setLightboxOpen(true);
  };

  const extractText = (children) => {
    if (typeof children === 'string') return children;
    if (Array.isArray(children)) {
      return children
        .map(c => (typeof c === 'string' ? c : (c?.props?.children ?? '')))
        .join('');
    }
    return '';
  };

  return (
    <>
      <div
        ref={containerRef}
        className="prose prose-lg prose-emerald dark:prose-invert max-w-none font-sans prose-headings:font-serif prose-p:text-slate-700 dark:text-slate-300 prose-p:leading-relaxed prose-a:text-emerald-600 dark:text-emerald-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-800 dark:text-slate-200 prose-code:text-emerald-700 dark:text-emerald-400 prose-code:bg-emerald-50 dark:prose-code:bg-emerald-900/30 prose-code:px-1 prose-code:rounded prose-pre:bg-slate-900 dark:prose-pre:bg-slate-950 prose-pre:text-slate-100 prose-img:rounded-lg prose-img:shadow-lg prose-img:cursor-pointer prose-table:text-slate-700 dark:text-slate-300 prose-th:bg-slate-100 dark:bg-slate-800 prose-th:text-slate-800 dark:text-slate-200 prose-td:border-slate-200 dark:border-slate-700"
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex, rehypeHighlight]}
          components={{
            h1: ({ children, ...props }) => {
              const h1Text = extractText(children).trim();
              if (h1Text && h1Text === postTitle?.trim()) return null;
              return <h1 className="font-serif text-slate-800 dark:text-slate-200" {...props}>{children}</h1>;
            },
            h2: ({ ...props }) => <h2 className="font-serif text-slate-800 dark:text-slate-200" {...props} />,
            h3: ({ ...props }) => <h3 className="font-serif text-slate-800 dark:text-slate-200" {...props} />,
            h4: ({ ...props }) => <h4 className="font-serif text-slate-800 dark:text-slate-200" {...props} />,
            p: ({ children, ...props }) => {
              const text = extractText(children).trim();
              if (customModules[text]) {
                const Module = customModules[text];
                return <Module />;
              }
              return <p className="text-slate-700 dark:text-slate-300 leading-relaxed" {...props}>{children}</p>;
            },
            a: ({ href = '', children, ...props }) => {
              const isAudio = /\.(mp3|wav|ogg)$/i.test(href);
              const titleText = extractText(children).trim();
              if (isAudio) {
                return <AudioPlayer src={href} title={titleText || undefined} />;
              }
              return <a className="text-emerald-600 dark:text-emerald-400 no-underline hover:underline" href={href} {...props}>{children}</a>;
            },
            strong: ({ ...props }) => <strong className="text-slate-800 dark:text-slate-200" {...props} />,
            code: ({ inline, className, children, ...props }) => {
              if (inline) {
                return (
                  <code className="text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-1 rounded" {...props}>
                    {children}
                  </code>
                );
              }
              return <code className={className} {...props}>{children}</code>;
            },
            pre: ({ ...props }) => <pre className="bg-slate-900 dark:bg-slate-950 text-slate-100" {...props} />,
            img: ({ src, alt, ...props }) => (
              <img
                src={src}
                alt={alt}
                className="rounded-lg shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => handleImageClick(src)}
                {...props}
              />
            ),
            table: ({ ...props }) => (
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
