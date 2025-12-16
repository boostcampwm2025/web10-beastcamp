import { useState, useEffect } from 'react';
import { Wifi, Activity, Zap } from 'lucide-react';

export function NetworkStatus() {
  const [networkData, setNetworkData] = useState({
    speed: 193,
    ping: 36,
    status: '매우 좋음' as '매우 좋음' | '중간' | '매우 나쁨'
  });

  useEffect(() => {
    // Simulate network check
    const interval = setInterval(() => {
      const speed = Math.floor(Math.random() * 200) + 100;
      const ping = Math.floor(Math.random() * 100) + 20;
      let status: '매우 좋음' | '중간' | '매우 나쁨' = '매우 좋음';
      
      if (ping > 80 || speed < 100) {
        status = '매우 나쁨';
      } else if (ping > 50 || speed < 150) {
        status = '중간';
      }

      setNetworkData({ speed, ping, status });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (networkData.status) {
      case '매우 좋음': return 'from-green-500 to-emerald-500';
      case '중간': return 'from-yellow-500 to-orange-500';
      case '매우 나쁨': return 'from-red-500 to-rose-500';
    }
  };

  const getStatusBgColor = () => {
    switch (networkData.status) {
      case '매우 좋음': return 'bg-green-50 border-green-200';
      case '중간': return 'bg-yellow-50 border-yellow-200';
      case '매우 나쁨': return 'bg-red-50 border-red-200';
    }
  };

  return (
    <div className="mt-8">
      <div className={`bg-white rounded-2xl p-6 shadow-sm border ${getStatusBgColor()}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 bg-gradient-to-br ${getStatusColor()} rounded-xl flex items-center justify-center`}>
            <Wifi className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg">네트워크 상태</h3>
            <p className="text-sm text-gray-500">현재 환경의 연결 상태</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">상태</span>
            </div>
            <p className="text-xl">{networkData.status}</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">속도</span>
            </div>
            <p className="text-xl">{networkData.speed} Mbps</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">응답시간</span>
            </div>
            <p className="text-xl">{networkData.ping}ms</p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">
            💡 티켓팅 성공률을 높이려면 <span className={networkData.status === '매우 좋음' ? 'text-green-600' : 'text-orange-600'}>안정적인 네트워크 환경</span>이 필수입니다.
          </p>
        </div>
      </div>
    </div>
  );
}
