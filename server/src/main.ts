import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

const config = new DocumentBuilder()
  .setTitle('(Dinamo) technical assignment')
  .setDescription('Recourse this api mages i [User , Vendor , Product , Product,Cart]')
  .setVersion('0.1')
  .addBearerAuth()
  .build();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: configService.get<string>('CLIENT_URL', 'http://localhost:3000'),
    credentials: true,
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  
  // Swagger setup 
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); // Serve at /docs

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
