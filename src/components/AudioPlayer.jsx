// src/components/AudioPlayer.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

export default function AudioPlayer({ src, title }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      if (audio && audio.currentTime !== undefined) {
        setCurrentTime(audio.currentTime);
      }
    };
    const updateDuration = () => {
      if (audio && audio.duration !== undefined && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    const handleEnded = () => setIsPlaying(false);

    if (audio.addEventListener) {
      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', updateDuration);
      audio.addEventListener('ended', handleEnded);
    }

    return () => {
      if (audio && audio.removeEventListener) {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', updateDuration);
        audio.removeEventListener('ended', handleEnded);
      }
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    audio.currentTime = percentage * duration;
  };

  const formatTime = (seconds) => {
    if (!isFinite(seconds) || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="my-6">
      <div
        className="p-[1px] rounded-[12px] bg-gradient-to-r from-slate-200 via-white to-slate-200 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-opacity"
        style={{ opacity: isHovered ? 0.95 : 1 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="px-4 py-3 bg-white dark:bg-slate-900 rounded-[11px] border border-white/40 dark:border-slate-800/60">
          {/* 隐藏的原生 audio 元素 */}
          <audio ref={audioRef} src={src} preload="metadata" />

          {/* 标题区域（可选） */}
          {title && (
            <div className="mb-3 text-sm font-normal text-slate-700 dark:text-slate-300 font-sans">
              {title}
            </div>
          )}

          {/* 播放器控件区域 */}
          <div className="flex items-center gap-4">
            {/* 播放按钮 */}
            <button
              onClick={togglePlay}
              className="flex-shrink-0 w-9 h-9 rounded-full bg-slate-900 dark:bg-slate-200 flex items-center justify-center hover:opacity-80 transition-opacity"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause size={16} className="text-white dark:text-slate-900 fill-current" />
              ) : (
                <Play size={16} className="text-white dark:text-slate-900 fill-current ml-0.5" />
              )}
            </button>

            {/* 进度条 */}
            <div
              className="flex-1 h-1 bg-[#ddd] dark:bg-slate-700 rounded-full cursor-pointer relative"
              onClick={handleProgressClick}
            >
              <div
                className="absolute left-0 top-0 h-full bg-slate-900 dark:bg-slate-200 rounded-full transition-all"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            {/* 时间显示 */}
            <div className="flex-shrink-0 text-xs font-mono text-slate-600 dark:text-slate-400 tabular-nums">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

