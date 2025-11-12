import { Test, TestingModule } from '@nestjs/testing';
import { MarketDataService } from '../market-data.service';
import { MarketController } from '../market.controller';

describe('MarketController', () => {
  let controller: MarketController;
  let service: MarketDataService;

  const mockService = {
    listTickers: jest.fn(),
    getLastPrice: jest.fn(),
    getHistorical: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarketController],
      providers: [
        {
          provide: MarketDataService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<MarketController>(MarketController);
    service = module.get<MarketDataService>(MarketDataService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return list of tickers', async () => {
    const tickers = ['AAPL', 'TSLA', 'BTC-USD'];
    mockService.listTickers.mockReturnValue(tickers);

    const result = controller.getTickers();
    expect(result).toEqual(tickers);
    expect(service.listTickers).toHaveBeenCalledTimes(1);
  });

  it('should return last price for symbol', async () => {
    const price = { symbol: 'AAPL', price: 155, ts: 123456789 };
    mockService.getLastPrice.mockReturnValue(price);

    const result = controller.getPrice('AAPL');
    expect(result).toEqual(price);
    expect(service.getLastPrice).toHaveBeenCalledWith('AAPL');
  });

  it('should return historical data for a symbol', async () => {
    const bars = [
      { ts: 1, open: 100, high: 105, low: 98, close: 102 },
      { ts: 2, open: 102, high: 108, low: 101, close: 107 },
    ];
    mockService.getHistorical.mockReturnValue(bars);

    const result = controller.getHistorical('TSLA', { limit: 10 });
    expect(result).toEqual(bars);
    expect(service.getHistorical).toHaveBeenCalledWith('TSLA', 10);
  });
});
