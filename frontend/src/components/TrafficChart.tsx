import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

const generateData = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      time: time.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      interpark: Math.floor(Math.random() * 50000) + 20000,
      yes24: Math.floor(Math.random() * 40000) + 15000,
      melon: Math.floor(Math.random() * 35000) + 10000,
    });
  }
  
  return data;
};

export function TrafficChart() {
  const [data] = useState(generateData());

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg">실시간 트래픽 분석</h3>
          <p className="text-sm text-gray-500">티켓팅 사이트별 트래픽 현황 (최근 24시간)</p>
        </div>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 12 }}
              interval={3}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip 
              formatter={(value: number) => [`${value.toLocaleString()}명`, '']}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px 12px'
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            <Line 
              type="monotone" 
              dataKey="interpark" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              name="인터파크"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="yes24" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="YES24"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="melon" 
              stroke="#10b981" 
              strokeWidth={2}
              name="멜론티켓"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
          <div className="text-xs text-purple-600 mb-1">인터파크</div>
          <div className="text-lg">35.2k</div>
          <div className="text-xs text-gray-500">현재 접속자</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
          <div className="text-xs text-blue-600 mb-1">YES24</div>
          <div className="text-lg">28.7k</div>
          <div className="text-xs text-gray-500">현재 접속자</div>
        </div>
        <div className="bg-green-50 rounded-lg p-3 border border-green-100">
          <div className="text-xs text-green-600 mb-1">멜론티켓</div>
          <div className="text-lg">22.1k</div>
          <div className="text-xs text-gray-500">현재 접속자</div>
        </div>
      </div>
    </div>
  );
}
