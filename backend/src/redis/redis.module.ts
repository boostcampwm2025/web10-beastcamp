import { Redis } from 'ioredis';
import { Inject } from '@nestjs/common';
import { Global, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REDIS_BOOK, REDIS_WAIT } from './redis.constants';

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: REDIS_BOOK,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new Redis({
          host: configService.get<string>('REDIS_HOST_BOOK', 'localhost'),
          port: configService.get<number>('REDIS_PORT_BOOK', 6379),
          password: configService.get<string>('REDIS_PASSWORD_BOOK', ''),
          retryStrategy: (times) => {
            return Math.min(times * 50, 2000);
          },
        });
      },
    },
    {
      provide: REDIS_WAIT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new Redis({
          host: configService.get<string>('REDIS_HOST_WAIT', 'localhost'),
          port: configService.get<number>('REDIS_PORT_WAIT', 6380),
          password: configService.get<string>('REDIS_PASSWORD_WAIT', ''),
          retryStrategy: (times) => {
            return Math.min(times * 50, 2000);
          },
        });
      },
    },
  ],
})
export class RedisModule implements OnModuleDestroy, OnModuleInit {
  constructor(
    @Inject(REDIS_BOOK) private readonly bookClient: Redis,
    @Inject(REDIS_WAIT) private readonly waitClient: Redis,
  ) {}

  // 앱 시작 시 핑 테스트
  async onModuleInit() {
    try {
      await Promise.all([this.bookClient.ping(), this.waitClient.ping()]);
    } catch (error) {
      console.error('⚠️ Redis 초기화 중 연결 실패:', error);
    }
  }

  // 앱 종료 시 연결 끊기
  async onModuleDestroy() {
    await Promise.all([this.bookClient.quit(), this.waitClient.quit()]);
    console.log('🛑 Redis 연결 종료');
  }
}
