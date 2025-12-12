// src/components/RectRotationDemo.jsx
import React, { useMemo, useRef, useState } from 'react';

export default function RectRotationDemo() {
  const CELL = 24;        // 每个方块大小(px)
  const GAP = 4;          // 方块间隙(px)
  const ROWS = 10;        // 总行数
  const COLS = 12;        // 总列数

  const containerRef = useRef(null);

  // 选区状态：左上角坐标(x,y)，宽度w，高度h（单位：方块数）
  const [sel, setSel] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);

  const a = sel.w;
  const b = sel.h;
  const blockCount = useMemo(() => a * b, [a, b]);

  // 鼠标位置转为方块坐标
  const posToCell = (clientX, clientY) => {
    const rect = containerRef.current.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const offsetY = clientY - rect.top;
    const x = Math.floor((offsetX - GAP) / (CELL + GAP));
    const y = Math.floor((offsetY - GAP) / (CELL + GAP));
    return {
      x: Math.min(Math.max(x, 0), COLS - 1),
      y: Math.min(Math.max(y, 0), ROWS - 1),
    };
  };

  const onMouseDown = (e) => {
    const { x, y } = posToCell(e.clientX, e.clientY);
    setDragStart({ x, y });
    setSel({ x, y, w: 1, h: 1 });
    setDragging(true);
  };

  const onMouseMove = (e) => {
    if (!dragging || !dragStart) return;
    const { x, y } = posToCell(e.clientX, e.clientY);
    const left = Math.min(dragStart.x, x);
    const top = Math.min(dragStart.y, y);
    const right = Math.max(dragStart.x, x);
    const bottom = Math.max(dragStart.y, y);
    setSel({ x: left, y: top, w: right - left + 1, h: bottom - top + 1 });
  };

  const onMouseUp = () => {
    setDragging(false);
    setDragStart(null);
  };

  const rotate90 = () => {
    if (sel.w === 0 || sel.h === 0) return;
    setSel((prev) => ({ x: prev.x, y: prev.y, w: prev.h, h: prev.w }));
  };

  const reset = () => {
    setSel({ x: 0, y: 0, w: 0, h: 0 });
    setDragging(false);
    setDragStart(null);
  };

  const cells = useMemo(() => {
    const list = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        list.push({ r, c, key: `${r}-${c}` });
      }
    }
    return list;
  }, []);

  const isSelected = (r, c) =>
    r >= sel.y && r < sel.y + sel.h && c >= sel.x && c < sel.x + sel.w;

  const overlayStyle =
    sel.w > 0 && sel.h > 0
      ? {
          left: GAP + sel.x * (CELL + GAP),
          top: GAP + sel.y * (CELL + GAP),
          width: sel.w * CELL + (sel.w - 1) * GAP,
          height: sel.h * CELL + (sel.h - 1) * GAP,
        }
      : null;

  return (
    <div className="my-8 p-6 border rounded-lg bg-white dark:bg-slate-800 shadow-sm">
      <h3 className="text-xl font-bold mb-2">乘法交换律交互演示：方块选区</h3>
      <p className="mb-4 text-slate-600 dark:text-slate-300">
        在下方网格中拖拽选择一个连续的矩形区域。选中的方块数量即为 a×b。点击“旋转 90°”将 a×b 变为 b×a（以选区左上角为轴），方块数量保持不变。
      </p>

      {/* 网格容器 */}
      <div
        ref={containerRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        className="relative mx-auto rounded-md select-none"
        style={{
          width: GAP * 2 + COLS * CELL + (COLS - 1) * GAP,
          height: GAP * 2 + ROWS * CELL + (ROWS - 1) * GAP,
          padding: GAP,
          backgroundColor: 'rgba(2,6,23,0.03)',
          cursor: 'crosshair',
        }}
      >
        <div
          className="grid"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${COLS}, ${CELL}px)`,
            gridTemplateRows: `repeat(${ROWS}, ${CELL}px)`,
            gap: GAP,
          }}
        >
          {cells.map(({ r, c, key }) => (
            <div
              key={key}
              style={{
                width: CELL,
                height: CELL,
                border: '1px solid rgba(0,0,0,0.1)',
                backgroundColor: isSelected(r, c)
                  ? 'rgba(16,185,129,0.45)'
                  : 'rgba(255,255,255,0.9)',
              }}
            />
          ))}
        </div>

        {overlayStyle && (
          <div
            className="absolute rounded-sm pointer-events-none"
            style={{
              ...overlayStyle,
              border: '2px solid #059669',
              background: 'transparent',
            }}
          />
        )}
      </div>

      {/* 控制按钮 */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={rotate90}
          className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
        >
          旋转 90°
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 bg-slate-500 text-white rounded hover:bg-slate-600 transition-colors"
        >
          重置
        </button>
        <span className="text-sm text-slate-600 dark:text-slate-300 ml-2">
          当前选区：a = {a}, b = {b}（方块数量：{blockCount}）
        </span>
      </div>

      {/* 数学说明 */}
      <div className="mt-3 rounded-md border p-4 bg-slate-50 dark:bg-slate-900/40">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          将横向的方块数量记为 a，纵向的方块数量记为 b。拖拽选择得到的矩形包含的方块总数即为 a×b。
        </p>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
          点击“旋转 90°”会把选区变为 b×a（以左上角为轴），方块总数保持不变，这就是乘法交换律：a × b = b × a。
        </p>
      </div>
    </div>
  );
}
