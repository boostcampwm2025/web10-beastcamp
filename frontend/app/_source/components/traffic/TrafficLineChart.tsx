import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { SiteCongestion, CongestionChartData } from '@/types/traffic';

interface Props {
  sites: SiteCongestion[];
  chartData: CongestionChartData[];
}

export function TrafficLineChart({ sites, chartData }: Props) {
  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} interval={3} />
          <YAxis
            tick={{ fontSize: 12 }}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}`}
            label={{
              value: '경쟁 강도',
              angle: -90,
              position: 'insideLeft',
              style: { fontSize: 12 },
            }}
          />
          <Tooltip
            formatter={(value: number) => [`${value.toFixed(0)}점`, '']}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px 12px',
            }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />

          {sites.map((site) => (
            <Line
              key={site.site}
              type="monotone"
              dataKey={site.displayName}
              stroke={site.color}
              strokeWidth={2}
              name={site.displayName}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
