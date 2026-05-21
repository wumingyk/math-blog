import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, ChevronDown, ChevronUp, Dices, RotateCcw, Sparkles } from 'lucide-react';

const BASES = [2, 3, 4, 5, 6, 8, 10, 12, 16];
const DIGIT_SYMBOLS = '0123456789ABCDEF';
const TARGETS = {
  2: [5, 9, 13, 22, 31],
  3: [8, 14, 20, 35, 53],
  4: [11, 19, 27, 42, 63],
  5: [13, 24, 37, 68, 94],
  6: [17, 29, 44, 83, 125],
  8: [31, 57, 92, 149, 255],
  10: [37, 128, 256, 507, 999],
  12: [47, 119, 215, 431, 947],
  16: [63, 127, 255, 511, 1023],
};

function getPlaces(base) {
  return [3, 2, 1, 0].map((power) => ({
    power,
    value: base ** power,
  }));
}

function toDigits(decimal, base) {
  const places = getPlaces(base);
  return places.map(({ value }) => Math.floor(decimal / value) % base);
}

function fromDigits(digits, base) {
  return digits.reduce((sum, digit, index) => {
    const power = digits.length - index - 1;
    return sum + digit * base ** power;
  }, 0);
}

function formatBaseNumber(digits) {
  const trimmed = digits.join('').replace(/^0+(?=\w)/, '');
  return trimmed || '0';
}

function DigitTokens({ digit, base, tone }) {
  const visible = Math.min(digit, 16);

  return (
    <div className="grid grid-cols-4 gap-1.5" aria-hidden="true">
      {Array.from({ length: visible }).map((_, index) => (
        <span
          key={index}
          className={`h-3 rounded-sm ${tone}`}
        />
      ))}
      {digit === 0 && (
        <span className="col-span-4 h-3 rounded-sm border border-dashed border-slate-300 dark:border-slate-600" />
      )}
      {digit > 16 && (
        <span className="col-span-4 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">
          x{digit}
        </span>
      )}
      {digit === base - 1 && digit > 0 && (
        <span className="col-span-4 rounded-sm bg-amber-100 px-1 py-0.5 text-center text-[11px] font-semibold text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
          再加 1 就进位
        </span>
      )}
    </div>
  );
}

export default function BaseGame() {
  const [base, setBase] = useState(2);
  const [targetIndex, setTargetIndex] = useState(0);
  const [digits, setDigits] = useState(() => toDigits(3, 2));
  const [round, setRound] = useState(1);

  const places = useMemo(() => getPlaces(base), [base]);
  const target = TARGETS[base][targetIndex % TARGETS[base].length];
  const value = fromDigits(digits, base);
  const solved = value === target;
  const targetDigits = useMemo(() => toDigits(target, base), [base, target]);
  const baseNumber = formatBaseNumber(digits);
  const targetBaseNumber = formatBaseNumber(targetDigits);

  const resetDigits = (nextBase = base, nextTargetIndex = targetIndex) => {
    const nextTarget = TARGETS[nextBase][nextTargetIndex % TARGETS[nextBase].length];
    const starter = toDigits(Math.max(0, nextTarget - (nextBase + 1)), nextBase);
    setDigits(starter);
  };

  const changeBase = (nextBase) => {
    setBase(nextBase);
    setTargetIndex(0);
    resetDigits(nextBase, 0);
  };

  const changeDigit = (index, delta) => {
    setDigits((current) => {
      const next = [...current];
      next[index] = Math.min(base - 1, Math.max(0, next[index] + delta));
      return next;
    });
  };

  const nextChallenge = () => {
    const nextIndex = (targetIndex + 1) % TARGETS[base].length;
    setTargetIndex(nextIndex);
    setRound((current) => current + 1);
    resetDigits(base, nextIndex);
  };

  const randomChallenge = () => {
    const nextBase = BASES[Math.floor(Math.random() * BASES.length)];
    const nextIndex = Math.floor(Math.random() * TARGETS[nextBase].length);
    setBase(nextBase);
    setTargetIndex(nextIndex);
    setRound((current) => current + 1);
    resetDigits(nextBase, nextIndex);
  };

  const autoSolve = () => {
    setDigits(targetDigits);
  };

  const tones = [
    'bg-cyan-500',
    'bg-emerald-500',
    'bg-amber-500',
    'bg-rose-500',
  ];

  return (
    <>
      <Helmet>
        <title>进制探险游戏 - L.E.A.P.</title>
        <meta name="description" content="一个用位值、进位和十进制换算来演示不同进制的互动数学游戏。" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Helmet>

      <main className="pt-20 sm:pt-24 pb-16 sm:pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <section className="mb-8 sm:mb-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200">
                  <Sparkles size={16} />
                  第 {round} 关
                </p>
                <h1 className="text-3xl sm:text-5xl font-serif font-bold leading-tight text-slate-900 dark:text-slate-100">
                  进制探险游戏
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
                  调整每一位的数字，让右侧算出的十进制结果等于目标数。每一位最多只能放到「进制 - 1」，再多就要向左进位。
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {BASES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => changeBase(item)}
                    className={`min-h-11 rounded-lg px-3 text-sm font-semibold transition-colors ${
                      base === item
                        ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                        : 'border border-slate-200 bg-white text-slate-700 hover:border-emerald-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
                    }`}
                  >
                    {item} 进制
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-[1fr_320px]">
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-5">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">构造你的数</h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    当前写法：<span className="font-mono font-bold text-slate-800 dark:text-slate-100">{baseNumber}</span>
                    <sub className="ml-0.5">({base})</sub>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => resetDigits()}
                    className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <RotateCcw size={16} />
                    重置
                  </button>
                  <button
                    type="button"
                    onClick={autoSolve}
                    className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-emerald-600 px-3 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    <CheckCircle2 size={16} />
                    看答案
                  </button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-4">
                {places.map(({ power, value: placeValue }, index) => (
                  <div
                    key={power}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950/50"
                  >
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {base}<sup>{power}</sup> 位
                        </div>
                        <div className="mt-1 font-mono text-xl font-bold text-slate-900 dark:text-slate-100">
                          {DIGIT_SYMBOLS[digits[index]]}
                        </div>
                      </div>
                      <div className="text-right text-xs text-slate-500 dark:text-slate-400">
                        权重
                        <div className="font-mono text-sm font-bold text-slate-800 dark:text-slate-200">{placeValue}</div>
                      </div>
                    </div>

                    <div className="mb-3 min-h-20 rounded-md border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-900">
                      <DigitTokens digit={digits[index]} base={base} tone={tones[index]} />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => changeDigit(index, -1)}
                        className="flex min-h-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 hover:border-slate-400 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                        disabled={digits[index] === 0}
                        aria-label={`减少 ${base} 的 ${power} 次方位`}
                      >
                        <ChevronDown size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => changeDigit(index, 1)}
                        className="flex min-h-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 hover:border-slate-400 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                        disabled={digits[index] === base - 1}
                        aria-label={`增加 ${base} 的 ${power} 次方位`}
                      >
                        <ChevronUp size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-5">
              <div className="rounded-lg bg-slate-900 p-4 text-white dark:bg-slate-100 dark:text-slate-950">
                <div className="text-sm font-semibold opacity-80">目标十进制数</div>
                <div className="mt-2 font-mono text-5xl font-bold">{target}</div>
                <div className="mt-2 text-sm opacity-80">
                  答案写成 {base} 进制是 {targetBaseNumber}
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">你的换算</div>
                <div className="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  {places.map(({ power, value: placeValue }, index) => (
                    <div key={power} className="flex justify-between gap-3">
                      <span>
                        {DIGIT_SYMBOLS[digits[index]]} x {base}<sup>{power}</sup>
                      </span>
                      <span className="font-mono">{digits[index] * placeValue}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 border-t border-slate-200 pt-3 dark:border-slate-700">
                  <div className="flex items-end justify-between gap-3">
                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">合计</span>
                    <span className={`font-mono text-3xl font-bold ${solved ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100'}`}>
                      {value}
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className={`h-full rounded-full ${solved ? 'bg-emerald-500' : value > target ? 'bg-rose-500' : 'bg-cyan-500'}`}
                      style={{ width: `${Math.min(100, Math.round((value / target) * 100))}%` }}
                    />
                  </div>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    {solved ? '正好相等，通关。' : value < target ? `还差 ${target - value}。` : `多了 ${value - target}。`}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={nextChallenge}
                  className="min-h-11 rounded-lg bg-slate-900 px-3 text-sm font-semibold text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-300"
                >
                  下一关
                </button>
                <button
                  type="button"
                  onClick={randomChallenge}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:border-emerald-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  <Dices size={16} />
                  随机
                </button>
              </div>
            </aside>
          </section>

          <section className="mt-5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">进制规则</h2>
            <div className="mt-3 grid gap-3 text-sm leading-6 text-slate-600 dark:text-slate-300 md:grid-cols-3">
              <p>在 b 进制里，每一位只能使用 0 到 b - 1 这些数字。</p>
              <p>从右往左，位值依次是 b<sup>0</sup>、b<sup>1</sup>、b<sup>2</sup>、b<sup>3</sup>。</p>
              <p>某一位达到 b 个单位时，会合并成左边高一位的 1 个单位。</p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
