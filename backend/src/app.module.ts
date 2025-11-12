import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AppConfigModule } from './config/config.module';
import { HealthModule } from './health-check/health.module';
import { MarketModule } from './market/market.module';

@Module({
  imports: [AppConfigModule, HealthModule, MarketModule, AuthModule],
})
export class AppModule {}
