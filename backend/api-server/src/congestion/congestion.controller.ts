import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CongestionService } from './congestion.service';
import { CongestionResponseDto } from './dto/congestion-response.dto';

@ApiTags('경쟁 강도')
@Controller('api/congestion')
export class CongestionController {
  constructor(private readonly congestionService: CongestionService) {}

  @Get()
  @ApiOperation({
    summary: '예매 경쟁 강도 조회',
    description:
      '티켓팅 사이트별 응답 지연, 에러율 등을 측정하여 경쟁 강도를 추정합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '경쟁 강도 데이터 조회 성공',
    type: CongestionResponseDto,
  })
  async getCongestionData(): Promise<CongestionResponseDto> {
    return this.congestionService.getCongestionData();
  }
}
