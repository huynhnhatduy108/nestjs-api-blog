import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()) // <== Thêm vào đây
	await app.listen(3000, () =>
    Logger.log(`Application running on port ${3000}`),
	);
}
bootstrap();
