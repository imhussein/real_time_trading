import { ValidationPipe } from '@nestjs/common';

// NestJS Standard Validation Pipe for dto props whitelist, transforming, etc...,
export const GlobalValidationPipe = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
});
