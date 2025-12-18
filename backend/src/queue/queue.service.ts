import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS_WAIT } from '../redis/redis.constants';

@Injectable()
export class QueueService {
  constructor(@Inject(REDIS_WAIT) private readonly redis: Redis) {}

  async enterQueue(userId: string) {
    await this.redis.zadd('queue:waiting', Date.now(), userId);
    return await this.redis.zrank('queue:waiting', userId);
  }

  async notifyFinished(userId: string) {
    await this.redis.publish('channel:finish', userId);
  }

  async removeActiveUser(userId: string) {
    const pipeline = this.redis.pipeline();
    pipeline.zrem('queue:active', userId);
    pipeline.del(`token:${userId}`);
    await pipeline.exec();
    console.log(`👋 [User: ${userId}] 퇴장 완료 (빈 자리 발생)`);
  }
}
