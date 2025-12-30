import React, { useMemo, useRef, useState } from 'react';

const WIDTH = 520;
const HEIGHT = 320;
const POINT_RADIUS = 8;
const TOTAL_POINTS = 9;

export default function CountingProcessDemo() {
  const containerRef = useRef(null);

  // 初始随机点阵
  const [points, setPoints] = useState(() =>
    Array.from({ length: TOTAL_POINTS }).map((_, i) => ({
      id: i,
      x: Math.random() * (WIDTH - 80) + 40,
      y: Math.random() * (HEIGHT - 80) + 40,
    }))
  );

  // 点击计数顺序（存 id）
  const [sequence, setSequence] = useState([]);

  // 当前拖拽点
  const [dragId, setDragId] = useState(null);

  // 点击点 → 计数
  const onPointClick = (id) => {
    if (sequence.includes(id)) return;
    setSequence((prev) => [...prev, id]);
  };

  // 拖拽开始
  const onPointerDown = (e, id) => {
    e.stopPropagation();
    setDragId(id);
  };

  // 拖拽移动
  const onPointerMove = (e) => {
    if (dragId === null) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.min(
      Math.max(e.clientX - rect.left, 20),
      WIDTH - 20
    );
    const y = Math.min(
      Math.max(e.clientY - rect.top, 20),
      HEIGHT - 20
    );

    setPoints((prev) =>
      prev.map((p) =>
        p.id === dragId ? { ...p, x, y } : p
      )
    );
  };

  // 拖拽结束
  const onPointerUp = () => setDragId(null);

  // 曲线箭头（Bezier）
  const renderArrow = (from, to, idx) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;

    const cx1 = from.x + dx * 0.4;
    const cy1 = from.y;
    const cx2 = from.x + dx * 0.6;
    const cy2 = to.y;

    const d = `
      M ${from.x} ${from.y}
      C ${cx1} ${cy1},
        ${cx2} ${cy2},
        ${to.x} ${to.y}
    `;

    return (
      <path
        key={idx}
        d={d}
        fill="none"
        stroke="#64748b"
        strokeWidth="2"
        markerEnd="url(#arrowhead)"
      />
    );
  };

  return (
    <div className="my-8 p-6 border rounded-lg bg-white dark:bg-slate-800">
      <h3 className="text-lg font-bold mb-2">
        计数的过程：指认、连接、整理
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
        点最初是杂乱的。请依次点击点完成计数。<br />
        你可以拖动点，将计数路径整理得更清晰。
      </p>

      <div
        ref={containerRef}
        className="relative mx-auto rounded-md bg-slate-50 dark:bg-slate-900"
        style={{ width: WIDTH, height: HEIGHT }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {/* 箭头层 */}
        <svg
          width={WIDTH}
          height={HEIGHT}
          className="absolute inset-0 pointer-events-none"
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="4"
              orient="auto"
            >
              <path d="M 0 0 L 8 4 L 0 8 z" fill="#64748b" />
            </marker>
          </defs>

          {sequence.map((id, i) => {
            if (i === 0) return null;
            return renderArrow(
              points[sequence[i - 1]],
              points[id],
              i
            );
          })}
        </svg>

        {/* 点 */}
        {points.map((p) => {
          const index = sequence.indexOf(p.id);
          const counted = index !== -1;

          return (
            <div
              key={p.id}
              onClick={() => onPointClick(p.id)}
              onPointerDown={(e) => onPointerDown(e, p.id)}
              className="absolute cursor-pointer select-none"
              style={{
                left: p.x - POINT_RADIUS,
                top: p.y - POINT_RADIUS,
              }}
            >
              <div
                className={`rounded-full ${
                  counted
                    ? 'bg-emerald-500'
                    : 'bg-slate-300 hover:bg-slate-400'
                }`}
                style={{
                  width: POINT_RADIUS * 2,
                  height: POINT_RADIUS * 2,
                }}
              />
              {counted && (
                <div className="text-xs text-center mt-1 text-slate-700 dark:text-slate-200">
                  {index + 1}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">
        当前已计数：{sequence.length}
      </div>

      <div className="mt-2 text-sm text-slate-700 dark:text-slate-300">
        计数是一条路径，可以被整理，但顺序不会改变。
      </div>
    </div>
  );
}
