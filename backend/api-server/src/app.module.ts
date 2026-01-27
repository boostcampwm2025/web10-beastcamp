import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { VenuesModule } from './venues/venues.module';
import { PerformancesModule } from './performances/performances.module';
import { CongestionModule } from './congestion/congestion.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),

      serveRoot: '/',
    }),

    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      useFactory: () => {
        if (process.env.NODE_ENV === 'test') {
          return {
            type: 'sqlite',
            database: ':memory:',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
            logging: false,
          };
        }
        return {
          type: 'mysql',
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '3306', 10),
          username: process.env.DB_USERNAME || 'app',
          password: process.env.DB_PASSWORD || 'test',
          database: process.env.DB_DATABASE || 'ticketing',
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
          logging: true,
          timezone: 'Z',
        };
      },
    }),
    VenuesModule,
    PerformancesModule,
    CongestionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
