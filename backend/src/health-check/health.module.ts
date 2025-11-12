import { Controller, Get, Module } from '@nestjs/common';

// I Made those 2 endpoints for K8s Deployment Liveness and Health Check
@Controller()
class HealthController {
  @Get('/health') health() {
    return { status: 'all ok' };
  }
  @Get('/ready') ready() {
    return { status: 'all is ready ready' };
  }
}

@Module({ controllers: [HealthController] })
export class HealthModule {}
