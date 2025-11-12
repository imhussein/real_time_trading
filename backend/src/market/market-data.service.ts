import { Injectable } from '@nestjs/common';
import { InMemoryTickerRepository } from './ticker.repository';

@Injectable()
export class MarketDataService {
  constructor(private readonly repo: InMemoryTickerRepository) {}

  listTickers() {
    return this.repo.listSupported();
  }

  getLastPrice(symbol: string) {
    return this.repo.getLastPrice(symbol);
  }

  getHistorical(symbol: string, limit: number) {
    return this.repo.getHistorical(symbol, limit);
  }
}
