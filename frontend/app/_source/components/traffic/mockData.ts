import { SiteCongestion, CongestionDataPoint } from '@/types/traffic';
import { SITE_COLORS, ACTIVE_SITES, getCongestionLevel } from './trafficConfig';

/**
 * 경쟁 강도 Mock 데이터 생성
 * - 티켓팅 오픈 시간(오전 10시)에 급증하는 패턴 시뮬레이션
 * - 응답 지연, 타임아웃, 에러율 등을 반영한 경쟁 강도 점수 (0-100)
 */
export function generateMockTrafficData(): SiteCongestion[] {
  const now = new Date();
  const sites: SiteCongestion[] = [];

  ACTIVE_SITES.forEach((siteKey) => {
    const config = SITE_COLORS[siteKey];
    const data: CongestionDataPoint[] = [];

    // 최근 24시간 데이터 생성 (경쟁 강도 기반)
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hour = time.getHours();

      // 티켓팅 오픈 시간 (10시) 전후로 경쟁 강도 급증 패턴
      let baseScore = 20; // 기본 점수
      if (hour >= 9 && hour <= 11) {
        baseScore = 70 + Math.random() * 25; // 오픈 시간: 70-95점
      } else if (hour >= 8 && hour <= 12) {
        baseScore = 40 + Math.random() * 30; // 오픈 전후: 40-70점
      } else {
        baseScore = 10 + Math.random() * 30; // 기타: 10-40점
      }

      data.push({
        timestamp: time.toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        congestionScore: Math.min(100, Math.max(0, baseScore)),
      });
    }

    // 현재 경쟁 강도 점수 (마지막 데이터 기준)
    const currentScore = data[data.length - 1]?.congestionScore ?? 50;

    sites.push({
      site: siteKey,
      displayName: config.displayName,
      color: config.color,
      backgroundColor: config.backgroundColor,
      borderColor: config.borderColor,
      textColor: config.textColor,
      data,
      currentCongestionScore: currentScore,
      currentLevel: getCongestionLevel(currentScore),
    });
  });

  return sites;
}
