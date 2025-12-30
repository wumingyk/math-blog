import { useState } from 'react'

const TOTAL = 37

export default function DotGroupingDemo() {
  const [mode, setMode] = useState('random') // random | grid | group5 | group10

  const dots = Array.from({ length: TOTAL })

  const renderDots = () => {
    switch (mode) {
      case 'random':
        return (
          <div className="relative w-full h-48 border rounded-md bg-slate-50 dark:bg-slate-900/40">
            {dots.map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-full bg-slate-700 dark:bg-slate-200"
                style={{
                  left: `${Math.random() * 90 + 5}%`,
                  top: `${Math.random() * 80 + 10}%`,
                }}
              />
            ))}
          </div>
        )

      case 'grid':
        return (
          <div className="grid grid-cols-10 gap-2 p-4 border rounded-md bg-slate-50 dark:bg-slate-900/40">
            {dots.map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full bg-slate-700 dark:bg-slate-200"
              />
            ))}
          </div>
        )

      case 'group5':
        return (
          <div className="flex flex-wrap gap-4 p-4 border rounded-md bg-slate-50 dark:bg-slate-900/40">
            {Array.from({ length: Math.ceil(TOTAL / 5) }).map((_, g) => (
              <div
                key={g}
                className="grid grid-cols-5 gap-2 p-2 border rounded-md bg-white dark:bg-slate-800"
              >
                {Array.from({
                  length: Math.min(5, TOTAL - g * 5),
                }).map((_, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-full bg-emerald-600"
                  />
                ))}
              </div>
            ))}
          </div>
        )

      case 'group10':
        return (
          <div className="flex flex-wrap gap-4 p-4 border rounded-md bg-slate-50 dark:bg-slate-900/40">
            {Array.from({ length: Math.ceil(TOTAL / 10) }).map((_, g) => (
              <div
                key={g}
                className="grid grid-cols-5 gap-2 p-2 border-2 rounded-md bg-white dark:bg-slate-800"
              >
                {Array.from({
                  length: Math.min(10, TOTAL - g * 10),
                }).map((_, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-full bg-purple-600"
                  />
                ))}
              </div>
            ))}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="my-8 p-6 border rounded-lg bg-white dark:bg-slate-800 shadow-sm">
      <h3 className="text-xl font-bold mb-2">点的分组与数量感知</h3>
      <p className="mb-4 text-slate-600 dark:text-slate-300">
        同样数量的点，摆放方式不同，我们对数量的感知也会完全不同。
      </p>

      {/* 控制按钮 */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setMode('random')}
          className={`px-3 py-1 rounded ${
            mode === 'random'
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-200 dark:bg-slate-700'
          }`}
        >
          杂乱摆放
        </button>
        <button
          onClick={() => setMode('grid')}
          className={`px-3 py-1 rounded ${
            mode === 'grid'
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-200 dark:bg-slate-700'
          }`}
        >
          规则排列
        </button>
        <button
          onClick={() => setMode('group5')}
          className={`px-3 py-1 rounded ${
            mode === 'group5'
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-200 dark:bg-slate-700'
          }`}
        >
          按 5 分组
        </button>
        <button
          onClick={() => setMode('group10')}
          className={`px-3 py-1 rounded ${
            mode === 'group10'
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-200 dark:bg-slate-700'
          }`}
        >
          按 10 分组
        </button>
      </div>

      {/* 点展示区 */}
      {renderDots()}

      {/* 数学说明 */}
      <div className="mt-4 rounded-md border p-4 bg-slate-50 dark:bg-slate-900/40">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          杂乱摆放的点需要逐个数，几乎无法一眼判断数量。
        </p>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
          当点被规则排列、并按 5 或 10 进行分组时，我们可以通过“结构”而不是“计数”来快速识别数量。
        </p>
      </div>
    </div>
  )
}
