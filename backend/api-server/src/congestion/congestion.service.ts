import { Injectable, Logger } from '@nestjs/common';
import {
  CongestionResponseDto,
  SiteCongestionDto,
  CongestionDataPointDto,
  CongestionLevel,
  SiteMetricsDto,
} from './dto/congestion-response.dto';

interface SiteConfig {
  site: string;
  displayName: string;
  color: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  url: string;
}

const SITE_CONFIGS: SiteConfig[] = [
  {
    site: 'INTERPARK',
    displayName: '인터파크',
    color: '#8b5cf6',
    backgroundColor: 'bg-purple-50',
    borderColor: 'border-purple-100',
    textColor: 'text-purple-600',
    url: 'https://ticket.interpark.com',
  },
  {
    site: 'YES24',
    displayName: 'YES24',
    color: '#3b82f6',
    backgroundColor: 'bg-blue-50',
    borderColor: 'border-blue-100',
    textColor: 'text-blue-600',
    url: 'https://ticket.yes24.com',
  },
  {
    site: 'MELON_TICKET',
    displayName: '멜론티켓',
    color: '#10b981',
    backgroundColor: 'bg-green-50',
    borderColor: 'border-green-100',
    textColor: 'text-green-600',
    url: 'https://ticket.melon.com',
  },
];

@Injectable()
export class CongestionService {
  private readonly logger = new Logger(CongestionService.name);

  /**
   * 경쟁 강도 점수를 레벨로 변환
   */
  private getCongestionLevel(score: number): CongestionLevel {
    if (score >= 75) return 'EXTREME';
    if (score >= 50) return 'HIGH';
    if (score >= 25) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * 사이트의 응답 시간 측정
   */
  private async measureResponseTime(url: string): Promise<number> {
    const startTime = Date.now();
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000); // 5초 타임아웃

      await fetch(url, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; BeastCamp/1.0)',
        },
      });

      clearTimeout(timeout);
      return Date.now() - startTime;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn(`Failed to measure ${url}: ${errorMessage}`);
      return 5000; // 타임아웃 시 최대값 반환
    }
  }

  /**
   * 사이트 메트릭 측정
   */
  private async measureSiteMetrics(url: string): Promise<SiteMetricsDto> {
    const measurements: number[] = [];
    let timeouts = 0;
    let errors = 0;
    const totalAttempts = 5;

    for (let i = 0; i < totalAttempts; i++) {
      try {
        const responseTime = await this.measureResponseTime(url);
        if (responseTime >= 5000) {
          timeouts++;
        } else {
          measurements.push(responseTime);
        }
      } catch {
        errors++;
      }
    }

    const avgResponseTime =
      measurements.length > 0
        ? measurements.reduce((a, b) => a + b, 0) / measurements.length
        : 5000;

    return {
      avgResponseTime: Math.round(avgResponseTime),
      timeoutRate: timeouts / totalAttempts,
      errorRate: errors / totalAttempts,
      queueDetected: avgResponseTime > 3000, // 3초 이상이면 대기열 의심
    };
  }

  /**
   * 메트릭을 경쟁 강도 점수로 변환
   */
  private calculateCongestionScore(metrics: SiteMetricsDto): number {
    // 가중치
    const weights = {
      responseTime: 0.4,
      timeout: 0.3,
      error: 0.2,
      queue: 0.1,
    };

    // 응답 시간 점수 (0-100, 5초 이상은 100점)
    const responseTimeScore = Math.min(
      (metrics.avgResponseTime / 5000) * 100,
      100,
    );

    // 타임아웃 점수
    const timeoutScore = metrics.timeoutRate * 100;

    // 에러 점수
    const errorScore = metrics.errorRate * 100;

    // 대기열 점수
    const queueScore = metrics.queueDetected ? 100 : 0;

    const totalScore =
      responseTimeScore * weights.responseTime +
      timeoutScore * weights.timeout +
      errorScore * weights.error +
      queueScore * weights.queue;

    return Math.round(Math.min(totalScore, 100));
  }

  /**
   * 최근 24시간 데이터 생성 (시뮬레이션)
   * TODO: 실제 환경에서는 DB에 저장된 과거 측정 데이터 사용
   */
  private generateHistoricalData(
    currentScore: number,
  ): CongestionDataPointDto[] {
    const data: CongestionDataPointDto[] = [];
    const now = new Date();

    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hour = time.getHours();

      // 티켓팅 오픈 시간(10시) 기준 패턴 + 현재 점수 반영
      let baseScore = currentScore * 0.3; // 현재 점수의 30%를 기본값으로
      if (hour >= 9 && hour <= 11) {
        baseScore += 50 + Math.random() * 30; // 오픈 시간 급증
      } else if (hour >= 8 && hour <= 12) {
        baseScore += 20 + Math.random() * 20;
      } else {
        baseScore += Math.random() * 20;
      }

      data.push({
        timestamp: time.toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        congestionScore: Math.round(Math.min(100, Math.max(0, baseScore))),
      });
    }

    return data;
  }

  /**
   * 모든 사이트의 경쟁 강도 조회
   */
  async getCongestionData(): Promise<CongestionResponseDto> {
    this.logger.log('Fetching congestion data for all sites');

    const sitesData: SiteCongestionDto[] = await Promise.all(
      SITE_CONFIGS.map(async (config) => {
        // 사이트 메트릭 측정
        const metrics = await this.measureSiteMetrics(config.url);

        // 경쟁 강도 점수 계산
        const currentScore = this.calculateCongestionScore(metrics);

        // 과거 데이터 생성
        const historicalData = this.generateHistoricalData(currentScore);

        return {
          site: config.site,
          displayName: config.displayName,
          color: config.color,
          backgroundColor: config.backgroundColor,
          borderColor: config.borderColor,
          textColor: config.textColor,
          data: historicalData,
          currentCongestionScore: currentScore,
          currentLevel: this.getCongestionLevel(currentScore),
          metrics,
        };
      }),
    );

    return {
      sites: sitesData,
      lastUpdated: new Date().toISOString(),
    };
  }
}
