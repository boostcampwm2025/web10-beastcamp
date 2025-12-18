import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '../redis/redis.module';
import { QueueService } from './queue.service';
import { QueueWorker } from './queue.worker';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    RedisModule,
  ],
  providers: [QueueService, QueueWorker],
})
export class QueueModule {}
