import { Module } from '@nestjs/common';
import { PriceAlertService } from 'src/alerts/alerts.service';
import { MarketGateway } from 'src/gateways/market.gateway';
import { PriceFeedSimulator } from './data/price-feed';
import { MarketDataService } from './market-data.service';
import { MarketController } from './market.controller';
import { InMemoryTickerRepository } from './ticker.repository';

@Module({
  controllers: [MarketController],
  providers: [
    InMemoryTickerRepository,
    PriceFeedSimulator,
    MarketGateway,
    MarketDataService,
    PriceAlertService,
  ],
})
export class MarketModule {}
