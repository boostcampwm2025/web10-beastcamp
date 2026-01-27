'use client';

import { Activity } from 'lucide-react';
import { useTraffic } from '../hooks/useTraffic';
import { TrafficLineChart } from './traffic/TrafficLineChart';
import { TrafficSummaryCards } from './traffic/TrafficSummaryCards';
import {
  TrafficLoading,
  TrafficError,
  TrafficEmpty,
} from './traffic/TrafficStates';
import { CongestionChartData } from '@/types/traffic';

export function TrafficChart() {
  // 환경 변수로 Mock 데이터 사용 여부 결정 (기본값: false, 실제 API 사용)
  const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_TRAFFIC === 'true';
  const { sites, isLoading, isError, error } = useTraffic(useMockData);

  // 차트 데이터 변환: API 응답 → Recharts 형식
  const chartData: CongestionChartData[] =
    sites.length > 0 && sites[0].data.length > 0
      ? sites[0].data.map((_, index) => {
          const dataPoint: CongestionChartData = {
            timestamp: sites[0].data[index].timestamp,
          };

          sites.forEach((site) => {
            dataPoint[site.displayName] =
              site.data[index]?.congestionScore ?? 0;
          });

          return dataPoint;
        })
      : [];

  if (isLoading) return <TrafficLoading />;
  if (isError)
    return (
      <TrafficError
        message={error instanceof Error ? error.message : undefined}
      />
    );
  if (sites.length === 0) return <TrafficEmpty />;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">예매 경쟁 강도 분석</h3>
          <p className="text-sm text-gray-500">
            사이트별 응답 지연·에러율 기반 경쟁 강도 추정 (최근 24시간)
          </p>
        </div>
      </div>

      <TrafficLineChart sites={sites} chartData={chartData} />
      <TrafficSummaryCards sites={sites} />
    </div>
  );
}
