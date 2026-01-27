import { CongestionLevel } from '@/types/traffic';

export const SITE_COLORS = {
  INTERPARK: {
    displayName: '인터파크',
    color: '#8b5cf6',
    backgroundColor: 'bg-purple-50',
    borderColor: 'border-purple-100',
    textColor: 'text-purple-600',
    key: 'interpark',
  },
  YES24: {
    displayName: 'YES24',
    color: '#3b82f6',
    backgroundColor: 'bg-blue-50',
    borderColor: 'border-blue-100',
    textColor: 'text-blue-600',
    key: 'yes24',
  },
  MELON_TICKET: {
    displayName: '멜론티켓',
    color: '#10b981',
    backgroundColor: 'bg-green-50',
    borderColor: 'border-green-100',
    textColor: 'text-green-600',
    key: 'melon',
  },
} as const;

export const ACTIVE_SITES = ['INTERPARK', 'YES24', 'MELON_TICKET'] as const;

export type SiteKey = (typeof ACTIVE_SITES)[number];

// 경쟁 강도 레벨별 표시 설정
export const CONGESTION_LEVELS: Record<
  CongestionLevel,
  {
    label: string;
    color: string;
    bgColor: string;
    textColor: string;
  }
> = {
  LOW: {
    label: '낮음',
    color: '#10b981',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
  },
  MEDIUM: {
    label: '보통',
    color: '#f59e0b',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-700',
  },
  HIGH: {
    label: '높음',
    color: '#f97316',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-700',
  },
  EXTREME: {
    label: '매우 높음',
    color: '#ef4444',
    bgColor: 'bg-red-100',
    textColor: 'text-red-700',
  },
};

// 경쟁 강도 점수를 레벨로 변환
export function getCongestionLevel(score: number): CongestionLevel {
  if (score >= 75) return 'EXTREME';
  if (score >= 50) return 'HIGH';
  if (score >= 25) return 'MEDIUM';
  return 'LOW';
}
