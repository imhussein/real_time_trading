import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InMemoryTickerRepository } from 'src/market/ticker.repository';

type SubPayload = { symbols: string[] };

@WebSocketGateway({
  namespace: '/ws/market',
  cors: { origin: process.env.CORS_ORIGIN || '*' },
})
export class MarketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  // Just fake in memory to track all  users who connected to the server and see who is listenbing for which price update based on the Symbol or token they want to track,
  // BUT of course in real production server, we can have some adapters like redis or Mongodb adpater in case of disrubutred system  for Horizontal scalling
  private clientsSubs = new Map<string, Set<string>>();

  constructor(private repo: InMemoryTickerRepository) {
    // This basically says for every second build a struct of all tickers and for each connected user and then filter that payload to see what each user is sending as symbols they want to listen to
    // in REAL PRODUCTION deployment, this basically simulate something like maybe NATS, or maybe also better we can use something like Kafka for this case as it can handle milllions of streaming messages
    setInterval(
      () => {
        const payload: Record<string, any> = {};
        for (const symbol of this.repo.listSupported()) {
          const current = this.repo.getLastPrice(symbol);

          if (current) {
            payload[symbol] = { price: current.price, ts: current.ts };
          }
        }

        for (const [
          clientId,
          subscribedSymbols,
        ] of this.clientsSubs.entries()) {
          const updatesForClient: Record<string, any> = {};

          for (const symbol of subscribedSymbols) {
            const latestPrice = payload[symbol];
            if (latestPrice) {
              updatesForClient[symbol] = latestPrice;
            }
          }

          if (Object.keys(updatesForClient).length > 0) {
            // give each user what he actually wants currently
            this.server.to(clientId).emit('price.update', updatesForClient);
          }
        }
      },

      Number(process.env.WS_TICK_MS || 1000),
    );
  }

  handleConnection(client: Socket) {
    this.clientsSubs.set(client.id, new Set());
    client.emit('price.snapshot', {});
  }

  handleDisconnect(client: Socket) {
    this.clientsSubs.delete(client.id);
  }

  @SubscribeMessage('subscribe')
  onSubscribe(
    @MessageBody() body: SubPayload,
    @ConnectedSocket() client: Socket,
  ) {
    const set = this.clientsSubs.get(client.id)!;
    for (const s of body.symbols || []) {
      set.add(s);
    }
    client.emit('subscribed', Array.from(set));
  }

  @SubscribeMessage('unsubscribe')
  onUnsubscribe(
    @MessageBody() body: SubPayload,
    @ConnectedSocket() client: Socket,
  ) {
    const set = this.clientsSubs.get(client.id)!;
    for (const s of body.symbols || []) {
      set.delete(s);
    }
    client.emit('subscribed', Array.from(set));
  }
}
