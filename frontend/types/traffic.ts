// 경쟁 강도 레벨
export type CongestionLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';

// 측정 지표
export interface SiteMetrics {
  avgResponseTime: number; // ms
  timeoutRate: number; // 0-1
  errorRate: number; // 0-1
  queueDetected: boolean;
}

// 개별 데이터포인트 (경쟁 강도 기반)
export interface CongestionDataPoint {
  timestamp: string;
  congestionScore: number; // 0-100
}

// 사이트별 경쟁 강도 데이터
export interface SiteCongestion {
  site: string;
  displayName: string;
  color: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  data: CongestionDataPoint[];
  currentCongestionScore: number; // 0-100
  currentLevel: CongestionLevel;
  metrics?: SiteMetrics; // 선택적 상세 지표
}

// API 응답
export interface CongestionResponse {
  sites: SiteCongestion[];
  lastUpdated: string;
}

// Recharts 차트 데이터
export interface CongestionChartData {
  timestamp: string;
  [siteKey: string]: number | string;
}

// 레거시 타입 별칭 (호환성 유지)
export type TrafficDataPoint = CongestionDataPoint;
export type SiteTraffic = SiteCongestion;
export type TrafficResponse = CongestionResponse;
export type TrafficChartData = CongestionChartData;
