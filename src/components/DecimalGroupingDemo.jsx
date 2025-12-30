import React, { useState, useRef, useMemo } from 'react';
import { Plus, RotateCcw, Box, Circle } from 'lucide-react';

/**
 * 教学用具：十进制演示板
 * 核心优化：
 * 1. 拖拽逻辑改为计算 Delta (位移差)，移除硬编码坐标，适应性更强。
 * 2. 增加“解组”功能（双击十的组可以还原）。
 * 3. 增加“手动打包”按钮，强化“凑十进一”的仪式感。
 * 4. 修改显示逻辑：十的组显示“1”（代表1个十），内部显示10个点。
 * 5. 修改拆分逻辑：拆分后随机散落，且默认为选中状态。
 */

const CONTAINER_HEIGHT = 500;
const UNIT_R = 12; // "一"的半径
const TEN_R = 36;  // "十"的半径

// 辅助：生成不重叠的随机位置 (简单版)
const getRandomPos = (w, h) => ({
  x: 40 + Math.random() * (w - 80),
  y: 80 + Math.random() * (h - 160),
});

export default function DecimalSystemDemo() {
  const containerRef = useRef(null);
  const idCounter = useRef(1);

  // 状态管理
  const [units, setUnits] = useState(() => 
    Array.from({ length: 14 }).map(() => ({ id: idCounter.current++, ...getRandomPos(600, CONTAINER_HEIGHT), selected: false }))
  );
  const [tens, setTens] = useState([]);
  
  // 拖拽状态
  const [dragState, setDragState] = useState(null); // { type: 'unit'|'ten', id: number, startX, startY, itemStartX, itemStartY }

  // --- 动作逻辑 ---

  // 1. 添加新的“一”
  const addUnit = () => {
    if (!containerRef.current) return;
    const { width } = containerRef.current.getBoundingClientRect();
    setUnits(prev => [
      ...prev, 
      { id: idCounter.current++, x: width / 2 + (Math.random() - 0.5) * 50, y: 100, selected: false }
    ]);
  };

  // 2. 重置
  const reset = () => {
    setUnits([]);
    setTens([]);
    idCounter.current = 0;
  };

  // 3. 选中/取消选中“一”
  const toggleSelectUnit = (id) => {
    if (dragState) return; // 如果在拖拽中，不触发点击
    setUnits(prev => prev.map(u => u.id === id ? { ...u, selected: !u.selected } : u));
  };

  // 4. 打包：将10个选中的“一”变成1个“十”
  const bundleTen = () => {
    const selected = units.filter(u => u.selected);
    if (selected.length !== 10) return;

    // 计算中心点作为新“十”的位置
    const avgX = selected.reduce((acc, cur) => acc + cur.x, 0) / 10;
    const avgY = selected.reduce((acc, cur) => acc + cur.y, 0) / 10;

    // 移除这10个一
    const remainingUnits = units.filter(u => !u.selected);
    setUnits(remainingUnits);

    // 添加1个十
    setTens(prev => [...prev, { id: idCounter.current++, x: avgX, y: avgY }]);
  };

  // 5. 拆解：双击“十”还原为10个“一”
  const unbundleTen = (tenId) => {
    const targetTen = tens.find(t => t.id === tenId);
    if (!targetTen) return;

    // 移除这个十
    setTens(prev => prev.filter(t => t.id !== tenId));

    // 生成10个一，随机散落在原来的位置附近，且处于选中状态
    const newUnits = Array.from({ length: 10 }).map(() => {
      // 随机散落：在中心点周围随机分布 (范围约为 +/- 50px)
      const spread = 50; 
      const offsetX = (Math.random() - 0.5) * 2 * spread;
      const offsetY = (Math.random() - 0.5) * 2 * spread;

      return {
        id: idCounter.current++,
        x: targetTen.x + offsetX,
        y: targetTen.y + offsetY,
        selected: true // 修改点：拆分出来后默认为选中状态（显示1）
      };
    });
    setUnits(prev => [...prev, ...newUnits]);
  };

  // --- 拖拽处理 (Pointer Events 适配移动端) ---

  const handlePointerDown = (e, type, item) => {
    e.preventDefault();
    e.stopPropagation();
    e.target.setPointerCapture(e.pointerId);
    
    setDragState({
      type,
      id: item.id,
      startX: e.clientX,
      startY: e.clientY,
      itemStartX: item.x,
      itemStartY: item.y,
    });
  };

  const handlePointerMove = (e) => {
    if (!dragState) return;
    e.preventDefault();

    const deltaX = e.clientX - dragState.startX;
    const deltaY = e.clientY - dragState.startY;
    const newX = dragState.itemStartX + deltaX;
    const newY = dragState.itemStartY + deltaY;

    if (dragState.type === 'unit') {
      setUnits(prev => prev.map(u => u.id === dragState.id ? { ...u, x: newX, y: newY } : u));
    } else {
      setTens(prev => prev.map(t => t.id === dragState.id ? { ...t, x: newX, y: newY } : t));
    }
  };

  const handlePointerUp = (e) => {
    setDragState(null);
  };

  // 计算统计数据
  const selectedCount = units.filter(u => u.selected).length;
  const totalValue = tens.length * 10 + units.length;

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto font-sans text-slate-700 select-none">
      
      {/* 顶部控制栏 */}
      <div className="w-full bg-white shadow-sm border rounded-xl p-4 mb-4 flex flex-wrap items-center justify-between gap-4">
        
        {/* 数据展示：教学重点 */}
        <div className="flex items-center gap-4 text-lg">
          <div className="flex flex-col items-start">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Value</span>
            <span className="text-3xl font-bold text-slate-800">{totalValue}</span>
          </div>
          <div className="h-8 w-px bg-slate-200"></div>
          <div className="flex gap-3 text-sm font-medium">
             <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded">
               <Box size={16} /> {tens.length} 个十
             </span>
             <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
               <Circle size={16} /> {units.length} 个一
             </span>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2">
          <button onClick={addUnit} className="flex items-center gap-2 px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg transition-colors active:scale-95">
            <Plus size={18} /> 添加"一"
          </button>
          <button onClick={reset} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
            <RotateCcw size={20} />
          </button>
        </div>
      </div>

      {/* 主画布 */}
      <div 
        ref={containerRef}
        className="relative w-full border-2 border-slate-200 border-dashed rounded-2xl bg-slate-50 overflow-hidden touch-none"
        style={{ height: CONTAINER_HEIGHT }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="absolute top-4 left-4 text-slate-400 text-sm pointer-events-none">
          操作提示：<br/>
          1. 点击绿色圆点计数<br/>
          2. 选满10个点击打包<br/>
          3. 双击蓝色圆盘拆分
        </div>

        {/* 动态打包按钮：仅当选中10个时出现在画布中央或跟随鼠标(这里简化为中央上方浮动) */}
        {selectedCount > 0 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
            <button 
              onClick={bundleTen}
              disabled={selectedCount !== 10}
              className={`
                px-6 py-2 rounded-full shadow-lg font-bold text-white transition-all transform duration-300
                ${selectedCount === 10 
                  ? 'bg-blue-600 hover:bg-blue-700 scale-110 animate-bounce' 
                  : 'bg-slate-400 cursor-not-allowed opacity-80'}
              `}
            >
              {selectedCount === 10 ? '✨ 打包成 1 个十！' : `已选 ${selectedCount}/10`}
            </button>
          </div>
        )}

        {/* 渲染：十的组 */}
        {tens.map((ten) => (
          <div
            key={ten.id}
            onPointerDown={(e) => handlePointerDown(e, 'ten', ten)}
            onDoubleClick={() => unbundleTen(ten.id)}
            className="absolute cursor-grab active:cursor-grabbing group"
            style={{
              left: ten.x,
              top: ten.y,
              transform: 'translate(-50%, -50%)', // 居中定位
            }}
          >
            {/* 十的外观 */}
            <div className="relative bg-blue-500/10 border-2 border-blue-500 rounded-full flex items-center justify-center transition-transform hover:scale-105"
                 style={{ width: TEN_R * 2, height: TEN_R * 2 }}>
              {/* 内部装饰点：改为10个，并使用 Flex 布局居中显示 */}
              <div className="flex flex-wrap justify-center items-center content-center gap-1 w-4/5 h-4/5 opacity-50 pointer-events-none">
                 {Array.from({length: 10}).map((_, i) => (
                   <div key={i} className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                 ))}
              </div>
              {/* 右上角角标：改为显示 1 */}
              <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                1
              </div>
              {/* 拆分提示 */}
              <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 text-[10px] bg-slate-800 text-white px-2 py-1 rounded transition-opacity whitespace-nowrap pointer-events-none">
                双击拆分
              </div>
            </div>
          </div>
        ))}

        {/* 渲染：一的点 */}
        {units.map((unit) => (
          <div
            key={unit.id}
            onPointerDown={(e) => handlePointerDown(e, 'unit', unit)}
            onClick={() => toggleSelectUnit(unit.id)}
            className="absolute cursor-pointer transition-all duration-200"
            style={{
              left: unit.x,
              top: unit.y,
              transform: 'translate(-50%, -50%)',
              zIndex: unit.selected ? 10 : 1
            }}
          >
            <div 
              className={`
                rounded-full shadow-sm border-2 flex items-center justify-center text-[10px] font-medium transition-all
                ${unit.selected 
                  ? 'bg-emerald-500 border-emerald-600 text-white scale-125 shadow-md' 
                  : 'bg-emerald-300 border-emerald-400 text-transparent hover:bg-emerald-400'}
              `}
              style={{ width: UNIT_R * 2, height: UNIT_R * 2 }}
            >
              1
            </div>
          </div>
        ))}
        
      </div>
    </div>
  );
}