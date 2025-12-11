// src/pages/PostRoute.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadPosts } from '../lib/loadPosts';
import Post from './Post';
import LoadingSkeleton from '../components/LoadingSkeleton';

export default function PostRoute() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPost() {
      try {
        setLoading(true);
        setError(null);
        const loadedPost = await loadPosts.getBySlug(slug);
        setPost(loadedPost);
      } catch (err) {
        console.error('Failed to load post:', err);
        setError(err.message || 'Post not found');
      } finally {
        setLoading(false);
      }
    }
    if (slug) {
      loadPost();
    }
  }, [slug]);

  const handleBack = () => {
    navigate('/');
    window.scrollTo(0, 0);
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error || !post) {
    return (
      <article className="min-h-screen bg-[#FAFAF9] dark:bg-slate-950 text-slate-800 dark:text-slate-200">
        <div className="max-w-5xl mx-auto px-6 pt-24 pb-8">
          <p className="text-red-600 dark:text-red-400 mb-4">Error: {error || 'Post not found'}</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            返回首页
          </button>
        </div>
      </article>
    );
  }

  return <Post post={post} onBack={handleBack} />;
}

