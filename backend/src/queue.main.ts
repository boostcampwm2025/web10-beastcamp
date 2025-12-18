import { NestFactory } from '@nestjs/core';
import { QueueModule } from './queue/queue.module';

async function bootstrap() {
  const app = await NestFactory.create(QueueModule);
  await app.listen(process.env.PORT ?? 3456);
}
bootstrap();
