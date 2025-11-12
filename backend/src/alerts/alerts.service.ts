import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Ticker } from 'src/market/models/ticker.entity';
import { InMemoryTickerRepository } from 'src/market/ticker.repository';

type PriceAlertDirection = 'above' | 'below';

interface PriceAlert {
  symbol: string;
  threshold: number;
  direction: PriceAlertDirection;
}

@Injectable()
export class PriceAlertService implements OnModuleInit {
  private readonly logger = new Logger(PriceAlertService.name);
  private readonly alerts: PriceAlert[] = [
    { symbol: 'AAPL', threshold: 180, direction: 'above' },
    { symbol: 'MSFT', threshold: 320, direction: 'below' },
    { symbol: 'GOOGL', threshold: 140, direction: 'above' },
    { symbol: 'AMZN', threshold: 130, direction: 'below' },
    { symbol: 'META', threshold: 470, direction: 'above' },
    { symbol: 'TSLA', threshold: 250, direction: 'below' },
    { symbol: 'NVDA', threshold: 900, direction: 'above' },
    { symbol: 'JPM', threshold: 190, direction: 'below' },
    { symbol: 'BTC-USD', threshold: 65000, direction: 'below' },
    { symbol: 'ETH-USD', threshold: 3500, direction: 'above' },
  ];

  constructor(private readonly repo: InMemoryTickerRepository) {}

  onModuleInit() {
    this.logger.log(
      `PriceAlertServic is initialize with ${this.alerts.length} alerts`,
    );
    this.startWatcher();
  }

  private startWatcher() {
    const interval = Number(process.env.ALERT_TICK_MS || 1000);
    setInterval(() => {
      for (const alert of this.alerts) {
        const ticker: Ticker | undefined = this.repo.getLastPrice(alert.symbol);
        if (!ticker) continue;

        const crossed =
          (alert.direction === 'above' && ticker.price >= alert.threshold) ||
          (alert.direction === 'below' && ticker.price <= alert.threshold);

        if (crossed) {
          this.logger.warn(
            `${alert.symbol} price ${ticker.price} is crossed ${alert.direction} ${alert.threshold}`,
          );
          // After that we can use some alert method to send this to any listenr
          // This can be using Sendgrid email service that send alerts to our email or sms using twilio or also send this to real time dashboard using gateway websocket implemntation
        }
      }
    }, interval);
  }
}
