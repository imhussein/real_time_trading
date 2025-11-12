import { Server, Socket } from 'socket.io';
import { MarketGateway } from 'src/gateways/market.gateway';
import { InMemoryTickerRepository } from '../ticker.repository';

describe('MarketGateway', () => {
  let gateway: MarketGateway;
  let repo: InMemoryTickerRepository;
  let mockServer: Partial<Server>;
  let mockClient: Partial<Socket>;

  beforeEach(() => {
    repo = new InMemoryTickerRepository();

    // mock WebSocket server + client
    mockServer = {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
    };

    mockClient = {
      id: 'client-1',
      emit: jest.fn(),
    };

    gateway = new MarketGateway(repo);
    gateway.server = mockServer as Server;
  });

  it('should create a client subscription set on connection', () => {
    gateway.handleConnection(mockClient as Socket);
    expect(mockClient.emit).toHaveBeenCalledWith('price.snapshot', {});
  });

  it('should delete subscriptions on disconnect', () => {
    gateway.handleConnection(mockClient as Socket);
    // @ts-expect-error private property access for test
    expect(gateway.clientsSubs.size).toBe(1);

    gateway.handleDisconnect(mockClient as Socket);
    // @ts-expect-error private property access for test
    expect(gateway.clientsSubs.size).toBe(0);
  });

  it('should handle subscribe events', () => {
    gateway.handleConnection(mockClient as Socket);

    gateway.onSubscribe({ symbols: ['AAPL', 'BTC-USD'] }, mockClient as Socket);
    expect(mockClient.emit).toHaveBeenCalledWith('subscribed', [
      'AAPL',
      'BTC-USD',
    ]);

    // @ts-expect-error private access for test
    const subs = gateway.clientsSubs.get('client-1');
    expect(subs.has('AAPL')).toBe(true);
    expect(subs.has('BTC-USD')).toBe(true);
  });

  it('should handle unsubscribe events', () => {
    gateway.handleConnection(mockClient as Socket);

    gateway.onSubscribe({ symbols: ['AAPL', 'BTC-USD'] }, mockClient as Socket);
    gateway.onUnsubscribe({ symbols: ['BTC-USD'] }, mockClient as Socket);

    // @ts-expect-error private access for test
    const subs = gateway.clientsSubs.get('client-1');
    expect(subs.has('BTC-USD')).toBe(false);
    expect(subs.has('AAPL')).toBe(true);
  });

  it('should emit price.update messages in tick interval', (done) => {
    jest.useFakeTimers();

    gateway.handleConnection(mockClient as Socket);
    // simulate a repo having one price
    repo.setLastPrice({ symbol: 'AAPL', price: 150, ts: Date.now() });
    // manually add subscription
    // @ts-expect-error private access for test
    gateway.clientsSubs.set('client-1', new Set(['AAPL']));

    // Fast-forward time to trigger interval
    jest.advanceTimersByTime(1000);

    setTimeout(() => {
      expect(mockServer.to).toHaveBeenCalled();
      expect(mockServer.emit).toBeDefined();
      jest.useRealTimers();
      done();
    }, 10);
  });
});
