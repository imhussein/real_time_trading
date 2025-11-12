import { Injectable, OnModuleInit } from '@nestjs/common';
import { Bar } from '../models/bar.entity';
import { Ticker } from '../models/ticker.entity';
import { InMemoryTickerRepository } from '../ticker.repository';

@Injectable()
export class PriceFeedSimulator implements OnModuleInit {
  constructor(private repo: InMemoryTickerRepository) {}

  onModuleInit() {
    const now = Date.now();
    for (const symbol of this.repo.listSupported()) {
      let px = 100 + Math.random() * 20;
      const bars: Bar[] = [];
      for (let i = 60; i > 0; i--) {
        const ts = now - i * 60_000;
        const open = px;

        // this is like fake fluctuation
        const change = (Math.random() - 0.5) * 0.8;

        // the new prices calcualted after we do some kind of random fluctuation like the price went down and then after sometime went up
        // something like how Binance api will give us over time
        px = Math.max(1, px + change);

        const close = px;
        const high = Math.max(open, close) + Math.random() * 0.3;
        const low = Math.min(open, close) - Math.random() * 0.3;

        bars.push(
          new Bar(
            ts,
            +open.toFixed(2),
            +high.toFixed(2),
            +low.toFixed(2),
            +close.toFixed(2),
          ),
        );
      }

      this.repo.seedHistorical(symbol, bars);
      this.repo.setLastPrice(new Ticker(symbol, bars.at(-1)!.close, now));
    }

    const tickMs = Number(process.env.WS_TICK_MS || 1000);
    const jitter = Number(process.env.WS_JITTER_MS || 250);

    for (const symbol of this.repo.listSupported()) {
      const loop = async () => {
        const base = this.repo.getLastPrice(symbol)!.price;
        const change = (Math.random() - 0.5) * 0.6;

        const price = Math.max(1, base + change);

        this.repo.setLastPrice(
          new Ticker(symbol, +price.toFixed(2), Date.now()),
        );

        setTimeout(loop, tickMs + Math.floor((Math.random() - 0.5) * jitter));
      };
      loop();
    }
  }
}
