import {
  Injectable,
  Inject,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS_WAIT } from '../redis/redis.constants';
import { QueueService } from './queue.service';

@Injectable()
export class QueueWorker implements OnModuleInit, OnModuleDestroy {
  private subClient: Redis;
  private readonly MAX_CAPACITY = 10;
  private intervalId: NodeJS.Timeout | null = null;

  constructor(
    @Inject(REDIS_WAIT) private readonly redis: Redis,
    private readonly queueService: QueueService,
  ) {}

  async onModuleInit() {
    this.subClient = this.redis.duplicate();
    await this.subClient.subscribe('channel:finish');

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.subClient.on('message', async (channel: string, msg: string) => {
      if (channel === 'channel:finish') {
        const userId = msg;
        try {
          await this.handleFinishMessage(userId);
        } catch (error) {
          console.error('❌ [Worker] 메시지 처리 중 에러:', error);
        }
      }
    });

    this.intervalId = setInterval(() => {
      this.fillEmptySlots().catch((error) => {
        console.error('❌ [Worker] 스케줄러 에러:', error);
      });
    }, 1000);
  }

  private async handleFinishMessage(userId: string) {
    await this.queueService.removeActiveUser(userId);
    await this.fillEmptySlots();
  }

  onModuleDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    if (this.subClient) {
      this.subClient.quit().catch(() => {});
    }
  }

  private async fillEmptySlots() {
    const activeCount = await this.redis.zcard('queue:active');
    const emptySlots = this.MAX_CAPACITY - activeCount;

    if (emptySlots <= 0) return;

    const users = await this.redis.zpopmin('queue:waiting', emptySlots);
    if (!users.length) return;

    const pipeline = this.redis.pipeline();
    const now = Date.now();

    for (let i = 0; i < users.length; i += 2) {
      const userId = users[i];
      pipeline.zadd('queue:active', now + 300000, userId);
      pipeline.set(`token:${userId}`, 'valid', 'EX', 300);
      console.log(`🚀 [User: ${userId}] 입장 성공! (활성 큐 진입)`);
    }
    await pipeline.exec();
  }
}
