import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/api';
import { CongestionResponse } from '@/types/traffic';

/**
 * 경쟁 강도 데이터 조회 React Query 훅
 */
export const useTrafficData = () => {
  return useQuery({
    queryKey: ['traffic', 'congestion'],
    queryFn: async () => {
      const response = await api.get<CongestionResponse>('/congestion', {
        serverType: 'api',
      });
      return response;
    },
    refetchInterval: 60000, // 1분마다 갱신
    retry: 2,
    staleTime: 30000, // 30초
  });
};
