import { ApiProperty } from '@nestjs/swagger';

export type CongestionLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';

export class CongestionDataPointDto {
  @ApiProperty({ description: '시간 (HH:MM)', example: '10:00' })
  timestamp: string;

  @ApiProperty({ description: '경쟁 강도 점수 (0-100)', example: 75 })
  congestionScore: number;
}

export class SiteMetricsDto {
  @ApiProperty({ description: '평균 응답 시간 (ms)', example: 1250 })
  avgResponseTime: number;

  @ApiProperty({ description: '타임아웃 비율 (0-1)', example: 0.12 })
  timeoutRate: number;

  @ApiProperty({ description: '에러 비율 (0-1)', example: 0.08 })
  errorRate: number;

  @ApiProperty({ description: '대기열 감지 여부', example: true })
  queueDetected: boolean;
}

export class SiteCongestionDto {
  @ApiProperty({ description: '사이트 키', example: 'INTERPARK' })
  site: string;

  @ApiProperty({ description: '사이트 표시명', example: '인터파크' })
  displayName: string;

  @ApiProperty({ description: '차트 색상', example: '#8b5cf6' })
  color: string;

  @ApiProperty({ description: '배경 색상 클래스', example: 'bg-purple-50' })
  backgroundColor: string;

  @ApiProperty({
    description: '테두리 색상 클래스',
    example: 'border-purple-100',
  })
  borderColor: string;

  @ApiProperty({
    description: '텍스트 색상 클래스',
    example: 'text-purple-600',
  })
  textColor: string;

  @ApiProperty({ description: '시계열 데이터', type: [CongestionDataPointDto] })
  data: CongestionDataPointDto[];

  @ApiProperty({ description: '현재 경쟁 강도 점수', example: 72 })
  currentCongestionScore: number;

  @ApiProperty({ description: '현재 경쟁 강도 레벨', example: 'HIGH' })
  currentLevel: CongestionLevel;

  @ApiProperty({ description: '측정 지표 (선택)', required: false })
  metrics?: SiteMetricsDto;
}

export class CongestionResponseDto {
  @ApiProperty({
    description: '사이트별 경쟁 강도 데이터',
    type: [SiteCongestionDto],
  })
  sites: SiteCongestionDto[];

  @ApiProperty({
    description: '마지막 업데이트 시간',
    example: '2026-01-27T01:30:00Z',
  })
  lastUpdated: string;
}
