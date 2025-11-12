import { Ticker } from '../models/ticker.entity';
import { InMemoryTickerRepository } from '../ticker.repository';

describe('InMemoryTickerRepository', () => {
  let repo: InMemoryTickerRepository;

  beforeEach(() => {
    repo = new InMemoryTickerRepository();
  });

  it('should return a list of supported symbols', () => {
    const symbols = repo.listSupported();
    expect(symbols.length).toBeGreaterThan(0);
    expect(symbols).toContain('AAPL');
  });

  it('should set and get last price correctly', () => {
    const ticker: Ticker = { symbol: 'AAPL', price: 123.45, ts: Date.now() };
    repo.setLastPrice(ticker);
    const result = repo.getLastPrice('AAPL');
    expect(result?.price).toBe(123.45);
  });

  it('should seed and retrieve historical data', () => {
    const bars = [
      { ts: Date.now(), open: 100, high: 105, low: 99, close: 102 },
      { ts: Date.now() + 1000, open: 102, high: 106, low: 101, close: 104 },
    ];
    repo.seedHistorical('AAPL', bars);
    const hist = repo.getHistorical('AAPL', 5);
    expect(hist.length).toBe(2);
    expect(hist[1].close).toBe(104);
  });
});
