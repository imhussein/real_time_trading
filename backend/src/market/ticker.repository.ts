import { Injectable } from '@nestjs/common';
import { Bar } from './models/bar.entity';
import { SymbolCode, Ticker } from './models/ticker.entity';

export interface TickerRepositoryPort {
  listSupported(): SymbolCode[];
  getLastPrice(symbol: SymbolCode): Ticker | undefined;
  setLastPrice(t: Ticker): void;
  getHistorical(symbol: SymbolCode, limit: number, tfMs: number): Bar[];
  seedHistorical(symbol: SymbolCode, bars: Bar[]): void;
}

@Injectable()
export class InMemoryTickerRepository implements TickerRepositoryPort {
  private readonly supported: SymbolCode[] = [
    'AAPL',
    'MSFT',
    'GOOGL',
    'AMZN',
    'META',
    'TSLA',
    'NVDA',
    'NFLX',
    'JPM',
    'V',
    'BTC-USD',
    'ETH-USD',
    'XRP-USD',
    'GOLD',
    'OIL',
  ];
  private lastPrice = new Map<SymbolCode, Ticker>();
  private history = new Map<SymbolCode, Bar[]>();

  listSupported(): SymbolCode[] {
    return this.supported;
  }
  getLastPrice(symbol: SymbolCode) {
    return this.lastPrice.get(symbol);
  }
  setLastPrice(t: Ticker) {
    this.lastPrice.set(t.symbol, t);
  }
  seedHistorical(symbol: SymbolCode, bars: Bar[]) {
    this.history.set(symbol, bars);
  }
  getHistorical(symbol: SymbolCode, limit: number): Bar[] {
    const arr = this.history.get(symbol) || [];
    return arr.slice(-limit);
  }
}
