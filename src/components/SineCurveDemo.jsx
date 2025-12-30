// src/components/SineCurveDemo.jsx
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

export default function SineCurveDemo() {
  const svgRef = useRef(null);
  const [a, setA] = useState(1); // 系数 a

  useEffect(() => {
    const width = 600;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

   // 定义比例尺
const x = d3.scaleLinear()
.domain([-2 * Math.PI, 2 * Math.PI])
.range([margin.left, width - margin.right]);

const y = d3.scaleLinear()
.domain([-1.2, 1.2])
.range([height - margin.bottom, margin.top]);

// 坐标轴
const xAxis = d3.axisBottom(x)
.ticks(9)
.tickFormat(d => `${(d / Math.PI).toFixed(1)}π`);
const yAxis = d3.axisLeft(y).ticks(5);

// ✅ 把 x 轴放在 y=0 的位置，而不是底部
svg.append('g')
.attr('transform', `translate(0,${y(0)})`)
.call(xAxis);

// y 轴依然放在左边
svg.append('g')
.attr('transform', `translate(${margin.left},0)`)
.call(yAxis);

    // 生成数据点
    const data = d3.range(-2 * Math.PI, 2 * Math.PI, 0.01).map(t => ({
      x: t,
      y: Math.sin(a * t),
    }));

    // 绘制曲线
    const line = d3.line()
      .x(d => x(d.x))
      .y(d => y(d.y));

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#10b981')
      .attr('stroke-width', 2)
      .attr('d', line);

    // 添加坐标轴标签
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - 5)
      .attr('text-anchor', 'middle')
      .attr('fill', '#374151')
      .text('x');

    svg.append('text')
      .attr('x', 5)
      .attr('y', margin.top)
      .attr('text-anchor', 'start')
      .attr('fill', '#374151')
      .text('y');
  }, [a]);

  return (
    <div className="my-8 p-6 border rounded-lg bg-white dark:bg-slate-800 shadow-sm">
      <h3 className="text-xl font-bold mb-2">函数 y = sin(ax) 演示</h3>
      <p className="mb-4 text-slate-600 dark:text-slate-300">
        拖动滑块调整系数 a，观察函数曲线在整个数轴上的变化。
      </p>
      <svg ref={svgRef} width={600} height={300}></svg>
      <div className="mt-4">
        <label className="block text-sm mb-1">系数 a: {a}</label>
        <input
          type="range"
          min="1"
          max="10"
          step="1"
          value={a}
          onChange={(e) => setA(Number(e.target.value))}
          className="w-full accent-emerald-600"
        />
      </div>
    </div>
  );
}
