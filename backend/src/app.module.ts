import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';

// 환경변수에 따라 모듈 로드 여부 결정
const skipDb = process.env.SKIP_DB === 'true';
const skipRedis = process.env.SKIP_REDIS === 'true';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Redis 연결 (SKIP_REDIS=true일 때 건너뜀)
    ...(skipRedis ? [] : [RedisModule]),

    // MySQL 연결 (SKIP_DB=true일 때 건너뜀)
    ...(skipDb
      ? []
      : [
          TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
              type: 'mysql',
              host: configService.get<string>('DB_HOST', 'localhost'),
              port: configService.get<number>('DB_PORT', 3306),
              username: configService.get<string>('DB_USERNAME', 'test'),
              password: configService.get<string>('DB_PASSWORD', 'test'),
              database: configService.get<string>('DB_DATABASE', 'backend_db'),
              entities: [],
              synchronize: false,
            }),
          }),
        ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
