import WebSocket from 'ws';
import { createServer } from 'http';
import { initializeWebSocket } from '../services/websocketService.js';

describe('WebSocket Server', () => {
  let server;
  let wss;
  let ws;

  beforeAll((done) => {
    server = createServer();
    wss = initializeWebSocket(server);
    server.listen(0, () => {
      const port = server.address().port;
      ws = new WebSocket(`ws://localhost:${port}`);
      ws.on('open', done);
    });
  });

  afterAll((done) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.close();
    }
    server.close(done);
  });

  it('should handle subscription message', (done) => {
    ws.send(JSON.stringify({
      type: 'subscribe',
      symbols: ['KRW-BTC'],
      dataType: 'ticker'
    }));

    ws.on('message', (data) => {
      const message = JSON.parse(data.toString());
      expect(message).toHaveProperty('type');
      done();
    });
  });
}); 