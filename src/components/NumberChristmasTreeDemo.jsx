import React, { useMemo } from 'react';

export default function NumberChristmasTree() {
  const height = 12;

  const rows = useMemo(() => {
    return Array.from({ length: height }, (_, i) => {
      const level = i + 1;
      const nums = [];

      for (let j = 1; j <= level; j++) nums.push(j);
      for (let j = level - 1; j >= 1; j--) nums.push(j);

      return nums;
    });
  }, []);

  return (
    <div className="my-12 flex flex-col items-center font-mono text-sm leading-tight select-none">
      {/* Star */}
      <div className="mb-1 text-yellow-300 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]">
        ★
      </div>

      {/* Tree */}
      {rows.map((row, i) => (
        <div key={i} className="flex gap-1">
          {row.map((n, j) => (
            <span
              key={j}
              className="
                text-emerald-300
                drop-shadow-[0_0_6px_rgba(52,211,153,0.6)]
              "
            >
              {n}
            </span>
          ))}
        </div>
      ))}

      {/* Trunk */}
      <div className="mt-2 text-yellow-400">||</div>
    </div>
  );
}
