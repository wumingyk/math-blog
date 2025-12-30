import { useState } from 'react'

export default function DotNumberDemo() {
  const MAX = 9
  const [count, setCount] = useState(0)
  const [history, setHistory] = useState([])

  const addDot = () => {
    if (count >= MAX) return
    const next = count + 1
    setCount(next)
    setHistory((h) => [...h, next])
  }

  return (
    <div className="my-8 p-6 border rounded-lg bg-white dark:bg-slate-800 shadow-sm">
      <h3 className="text-xl font-bold mb-2">点与数字符号</h3>
      <p className="mb-4 text-slate-600 dark:text-slate-300">
        点击左侧区域，每一次点击增加一个点。右侧显示对应的数字符号，下方记录数字与点的对应关系。
      </p>

      <div className="flex gap-6">
        {/* 左侧：点的生成区 */}
        <div
          onClick={addDot}
          className="flex-1 min-h-[180px] rounded-md border bg-slate-50 dark:bg-slate-900/40 cursor-pointer flex flex-wrap items-start p-4"
        >
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-full bg-slate-800 dark:bg-slate-200 m-2"
            />
          ))}

          {count === 0 && (
            <span className="text-sm text-slate-400">
              点击这里开始计数
            </span>
          )}
        </div>

        {/* 右侧：当前数字 */}
        <div className="w-40 flex flex-col items-center justify-center border rounded-md bg-white dark:bg-slate-800">
          <div className="text-6xl font-bold text-emerald-600">
            {count}
          </div>
          <div className="mt-2 text-sm text-slate-500">
            当前数量
          </div>
        </div>
      </div>

      {/* 计数记录（数字 ↔ 点） */}
      <div className="mt-6">
        <h4 className="text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
          计数记录（数字与点的对应）
        </h4>

        {history.length === 0 ? (
          <div className="text-sm text-slate-400">尚未开始</div>
        ) : (
          <div className="space-y-2">
            {history.map((n, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-2 rounded-md bg-slate-50 dark:bg-slate-900/40 border"
              >
                {/* 数字 */}
                <div className="w-6 text-lg font-bold text-emerald-600">
                  {n}
                </div>

                {/* 对应的点 */}
                <div className="flex flex-wrap">
                  {Array.from({ length: n }).map((_, j) => (
                    <div
                      key={j}
                      className="w-3 h-3 rounded-full bg-slate-700 dark:bg-slate-200 m-1"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 数学说明 */}
      <div className="mt-4 rounded-md border p-4 bg-slate-50 dark:bg-slate-900/40">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          每一个点代表一个单位。数字是对“点的数量”的记号，而不是点本身。
        </p>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
          记录区清楚展示了数字与点之间的一一对应关系：1 对应 1 个点，2 对应 2 个点，依次类推。
        </p>
      </div>
    </div>
  )
}
