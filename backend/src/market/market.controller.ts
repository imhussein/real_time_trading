import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Version,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { HistoricalQueryDto, HistoricalResponseDto } from './dtos/market-dots';
import { MarketDataService } from './market-data.service';

@UseGuards(JwtAuthGuard)
@Controller()
export class MarketController {
  constructor(private readonly market: MarketDataService) {}

  @Version('1')
  @Get('api/tickers')
  getTickers() {
    return this.market.listTickers();
  }

  @Version('1')
  @Get('api/price/:symbol')
  getPrice(@Param('symbol') symbol: string) {
    const price = this.market.getLastPrice(symbol);
    if (!price) {
      return {
        error: `Symbol ${symbol} not found`,
        available: this.market.listTickers(),
      };
    }
    return price;
  }

  @Version('1')
  @Get('api/historical/:symbol')
  getHistorical(
    @Param('symbol') symbol: string,
    @Query() q: HistoricalQueryDto,
  ): HistoricalResponseDto {
    const data = this.market.getHistorical(symbol, q.limit!);
    return { symbol, data };
  }
}
