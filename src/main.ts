import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const start = Date.now();

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  await app.listen(8080);

  const end = Date.now();
  console.log(`Application is running on: ${end - start}ms`);
}
bootstrap();
