'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface WpmChartProps {
  data: { second: number; wpm: number }[];
  avgWpm: number;
}

export default function WpmChart({ data, avgWpm }: WpmChartProps) {
  return (
    <div className="w-full h-56">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 4, left: -20 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(0,0,0,0.05)"
            vertical={false}
          />
          <XAxis
            dataKey="second"
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
            label={{
              value: 'seconds',
              position: 'insideBottom',
              offset: -2,
              fontSize: 10,
              fill: '#9ca3af',
            }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255,255,255,0.95)',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: '8px',
              fontSize: '12px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            }}
            formatter={(value: any) => [`${value as number} WPM`, 'Speed']}
            labelFormatter={(l) => `${l}s`}
          />
          <ReferenceLine
            y={avgWpm}
            stroke="rgba(104,168,80,0.3)"
            strokeDasharray="4 4"
            label={{
              value: `avg ${avgWpm}`,
              position: 'right',
              fontSize: 10,
              fill: 'rgba(104,168,80,0.7)',
            }}
          />
          <Line
            type="monotone"
            dataKey="wpm"
            stroke="#6aa850"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4, fill: '#6aa850', strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
