import { MarketDataService } from '../market-data.service';
import { Ticker } from '../models/ticker.entity';
import { InMemoryTickerRepository } from '../ticker.repository';

describe('MarketDataService', () => {
  let service: MarketDataService;
  let repo: InMemoryTickerRepository;

  beforeEach(() => {
    repo = new InMemoryTickerRepository();
    service = new MarketDataService(repo);
  });

  it('should list all supported tickers', () => {
    const list = service.listTickers();
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);
    expect(list).toContain('AAPL');
  });

  it('should set and get the last price for a symbol', () => {
    const ticker: Ticker = { symbol: 'AAPL', price: 123.45, ts: Date.now() };
    repo.setLastPrice(ticker);

    const result = service.getLastPrice('AAPL');
    expect(result).toBeDefined();
    expect(result?.price).toBeCloseTo(123.45);
  });

  it('should return undefined if last price not found', () => {
    const result = service.getLastPrice('UNKNOWN');
    expect(result).toBeUndefined();
  });

  it('should return historical data for a known symbol', () => {
    const bars = [
      { ts: Date.now(), open: 100, high: 105, low: 99, close: 103 },
      { ts: Date.now() + 1000, open: 103, high: 107, low: 102, close: 106 },
    ];

    repo.seedHistorical('AAPL', bars);

    const result = service.getHistorical('AAPL', 10);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);
    expect(result[1].close).toBe(106);
  });

  it('should handle missing historical data gracefully', () => {
    const result = service.getHistorical('FAKE', 5);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });
});
