import { WebSocketManager } from '../contexts/CryptoContext';
import WS from 'jest-websocket-mock';

describe('WebSocketManager', () => {
  let ws: WS;
  let manager: WebSocketManager;
  const url = 'ws://localhost:1234';
  
  beforeEach(() => {
    ws = new WS(url);
    const onMessage = jest.fn();
    const onError = jest.fn();
    manager = new WebSocketManager({ url, onMessage, onError });
  });

  afterEach(() => {
    WS.clean();
  });

  it('connects successfully', async () => {
    manager.connect();
    await ws.connected;
    expect(ws.server.clients().length).toBe(1);
  });

  it('attempts to reconnect on connection close', async () => {
    manager.connect();
    await ws.connected;
    ws.close();
    await new Promise(resolve => setTimeout(resolve, 1000));
    expect(ws.server.clients().length).toBe(1);
  });

  it('sends messages when connected', async () => {
    manager.connect();
    await ws.connected;
    const message = JSON.stringify({ type: 'test' });
    manager.send(message);
    await expect(ws).toReceiveMessage(message);
  });
}); 