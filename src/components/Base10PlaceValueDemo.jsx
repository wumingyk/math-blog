import { useState } from 'react'

const MAX = 10

const PLACES = [
  { key: 'thousands', label: '千', color: 'bg-purple-500' },
  { key: 'hundreds', label: '百', color: 'bg-blue-500' },
  { key: 'tens', label: '十', color: 'bg-emerald-500' },
  { key: 'ones', label: '个', color: 'bg-slate-700' },
]

export default function Base10PlaceValueDemo() {
  const [places, setPlaces] = useState({
    ones: 0,
    tens: 0,
    hundreds: 0,
    thousands: 0,
  })

  const addOne = () => {
    setPlaces((prev) => {
      const next = { ...prev }
      next.ones += 1

      if (next.ones === MAX) {
        next.ones = 0
        next.tens += 1
      }
      if (next.tens === MAX) {
        next.tens = 0
        next.hundreds += 1
      }
      if (next.hundreds === MAX) {
        next.hundreds = 0
        next.thousands += 1
      }

      return next
    })
  }

  const reset = () => {
    setPlaces({
      ones: 0,
      tens: 0,
      hundreds: 0,
      thousands: 0,
    })
  }

  return (
    <div className="my-8 p-6 border rounded-lg bg-white dark:bg-slate-800 shadow-sm">
      <h3 className="text-xl font-bold mb-2">十进制位值演示</h3>
      <p className="mb-4 text-slate-600 dark:text-slate-300">
        从个位开始计数，每满 10 个单位就会合并，并向左侧的高一位进位。
      </p>

      {/* 位值区 */}
      <div className="flex gap-4 justify-center mb-6">
        {PLACES.map(({ key, label, color }) => (
          <div
            key={key}
            className="flex flex-col items-center p-3 border rounded-md w-28 bg-slate-50 dark:bg-slate-900/40"
          >
            {/* 方框 */}
            <div className="w-full h-32 border rounded-md flex flex-wrap items-start justify-center p-2 bg-white dark:bg-slate-800">
              {Array.from({ length: places[key] }).map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full m-1 ${color}`}
                />
              ))}
            </div>

            {/* 数字符号 */}
            <div className="mt-2 text-lg font-bold text-slate-700 dark:text-slate-200">
              {places[key]}
            </div>

            {/* 位名 */}
            <div className="text-xs text-slate-500">
              {label}位
            </div>
          </div>
        ))}
      </div>

      {/* 控制按钮 */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={addOne}
          className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
        >
          +1（加一个单位）
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 bg-slate-500 text-white rounded hover:bg-slate-600 transition-colors"
        >
          重置
        </button>
      </div>

      {/* 数学说明 */}
      <div className="mt-6 rounded-md border p-4 bg-slate-50 dark:bg-slate-900/40">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          每一个方框表示一种计数单位：个位、十位、百位、千位。
        </p>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
          当某一位中累计到 10 个点，这 10 个单位会合并为左侧高一位的 1 个单位，这就是十进制的进位规则。
        </p>
      </div>
    </div>
  )
}
