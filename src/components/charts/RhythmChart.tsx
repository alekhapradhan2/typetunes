'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface RhythmChartProps {
  /**
   * Array of inter-keystroke intervals in ms, bucketed into bins.
   * We compute the histogram here for a clean chart.
   */
  intervals: number[];
}

function bucketIntervals(intervals: number[]): { range: string; count: number }[] {
  if (intervals.length === 0) return [];

  // Buckets: 0-50ms, 50-100ms, 100-150ms, ..., 500ms+
  const bucketSize = 50;
  const maxBucket  = 500;
  const buckets: Record<string, number> = {};

  for (let b = 0; b < maxBucket; b += bucketSize) {
    buckets[`${b}`] = 0;
  }
  buckets['500+'] = 0;

  for (const iv of intervals) {
    if (iv >= maxBucket) {
      buckets['500+']++;
    } else {
      const key = String(Math.floor(iv / bucketSize) * bucketSize);
      buckets[key] = (buckets[key] || 0) + 1;
    }
  }

  return Object.entries(buckets).map(([k, v]) => ({
    range: k === '500+' ? '500+' : `${k}`,
    count: v,
  }));
}

export default function RhythmChart({ intervals }: RhythmChartProps) {
  const data = bucketIntervals(intervals);

  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 4, left: -20 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(0,0,0,0.05)"
            vertical={false}
          />
          <XAxis
            dataKey="range"
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
            label={{
              value: 'ms between keys',
              position: 'insideBottom',
              offset: -2,
              fontSize: 10,
              fill: '#9ca3af',
            }}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255,255,255,0.95)',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: '8px',
              fontSize: '12px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            }}
            formatter={(value: any) => [value as number, 'keystrokes']}
            labelFormatter={(l: any) => `${l}–${parseInt(String(l)) + 50}ms`}
          />
          <Bar
            dataKey="count"
            fill="#b8a8c8"
            radius={[4, 4, 0, 0]}
            maxBarSize={32}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
