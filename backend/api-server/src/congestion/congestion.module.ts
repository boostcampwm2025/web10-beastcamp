import { Module } from '@nestjs/common';
import { CongestionController } from './congestion.controller';
import { CongestionService } from './congestion.service';

@Module({
  controllers: [CongestionController],
  providers: [CongestionService],
  exports: [CongestionService],
})
export class CongestionModule {}
