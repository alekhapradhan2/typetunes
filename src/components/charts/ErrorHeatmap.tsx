'use client';

// Keyboard layout for the heatmap (standard QWERTY)
const KEYBOARD_ROWS = [
  ['`','1','2','3','4','5','6','7','8','9','0','-','='],
  ['q','w','e','r','t','y','u','i','o','p','[',']','\\'],
  ['a','s','d','f','g','h','j','k','l',';',"'"],
  ['z','x','c','v','b','n','m',',','.','/'],
];

interface ErrorHeatmapProps {
  errorsByKey: Record<string, number>;
}

function getColor(count: number, max: number): string {
  if (count === 0 || max === 0) return 'rgba(0,0,0,0)';
  const intensity = count / max;
  // Muted coral scale: light coral at low, deeper at high
  const r = Math.round(200 + (8 - 200) * intensity);   // #C8 → #08
  const g = Math.round(136 + (40 - 136) * intensity);  // #88 → #28
  const b = Math.round(122 + (60 - 122) * intensity);  // #7A → #3C
  return `rgba(${r},${g},${b},${0.2 + intensity * 0.7})`;
}

export default function ErrorHeatmap({ errorsByKey }: ErrorHeatmapProps) {
  const maxErrors = Math.max(1, ...Object.values(errorsByKey));

  return (
    <div
      className="flex flex-col items-center gap-1.5"
      role="img"
      aria-label="Keyboard error heatmap"
    >
      {KEYBOARD_ROWS.map((row, ri) => (
        <div key={ri} className="flex gap-1" style={{ marginLeft: `${ri * 10}px` }}>
          {row.map((key) => {
            const errors = errorsByKey[key] || 0;
            const bg = getColor(errors, maxErrors);
            return (
              <div
                key={key}
                title={errors > 0 ? `"${key}": ${errors} error${errors !== 1 ? 's' : ''}` : key}
                className="relative flex items-center justify-center rounded text-xs font-mono transition-colors"
                style={{
                  width: 28,
                  height: 28,
                  backgroundColor: bg,
                  border: '1.5px solid rgba(0,0,0,0.07)',
                  color: errors > maxErrors * 0.5 ? '#fff' : '#64748b',
                }}
              >
                {key.length === 1 ? key : key.slice(0, 2)}
                {errors > 0 && (
                  <span
                    className="absolute -top-1 -right-1 text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center"
                    style={{ backgroundColor: '#c8887a', color: '#fff' }}
                  >
                    {errors > 9 ? '9+' : errors}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ))}

      {/* Legend */}
      <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
        <div className="w-3 h-3 rounded" style={{ backgroundColor: 'rgba(200,136,122,0.2)' }} />
        <span>Few errors</span>
        <div className="w-3 h-3 rounded" style={{ backgroundColor: 'rgba(200,136,122,0.9)' }} />
        <span>Many errors</span>
      </div>
    </div>
  );
}
