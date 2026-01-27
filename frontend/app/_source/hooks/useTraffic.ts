import { useMemo } from 'react';
import { generateMockTrafficData } from '../components/traffic/mockData';
import { SiteTraffic } from '@/types/traffic';
import { useTrafficData } from '../queries/traffic';

interface UseTrafficResult {
  sites: SiteTraffic[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export const useTraffic = (useMockData: boolean = false): UseTrafficResult => {
  const { data, isLoading, isError, error } = useTrafficData();
  const mockSites = useMemo(() => generateMockTrafficData(), []);

  if (useMockData) {
    return {
      sites: mockSites,
      isLoading: false,
      isError: false,
      error: null,
    };
  }

  // 실제 API 데이터 사용
  return {
    sites: data?.sites ?? [],
    isLoading,
    isError,
    error: error as Error | null,
  };
};
