import { Controller, Post, Body } from '@nestjs/common';
import { QueueService } from './queue.service';

@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  // 1. 유저 접속 시도 (대기열 진입)
  // POST http://localhost:3000/queue/enter
  @Post('enter')
  async enter(@Body('userId') userId: string) {
    const rank = await this.queueService.enterQueue(userId);
    return { msg: '대기열 등록', rank: rank !== null ? rank + 1 : null };
  }

  // 2. 작업 완료 신호 (WAS 역할)
  // POST http://localhost:3000/queue/finish
  @Post('finish')
  async finish(@Body('userId') userId: string) {
    await this.queueService.notifyFinished(userId);
    return { msg: '작업 완료 신호 전송' };
  }
}
